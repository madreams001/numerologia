/**
 * Astrology Calculations
 * Wraps kaabalah/astrology (Swiss Ephemeris via WASM) for natal charts,
 * aspects, transits, and chart comparison.
 */

import {
  getBirthChart as kaabalahGetBirthChart,
  getTransitChart as kaabalahGetTransitChart,
  getSynastryChart as kaabalahGetSynastryChart,
  getSwissEph as kaabalahGetSwissEph,
  type BirthChart,
  type BirthChartOptions,
  type TransitChartOptions,
  type SynastryChart,
  type SynastryChartOptions,
  type AspectEdge,
  type AspectName,
  type HouseSystem,
  type ZodiacPosition,
  HouseSystem as HouseSystemEnum,
} from "kaabalah/astrology";

// ============ TYPES ============

export interface ChartInput {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  latitude: number;
  longitude: number;
  houseSystem?: HouseSystem;
  timeZoneOffset?: number; // UTC offset in minutes (e.g. -180 for Argentina UTC-3)
}

export interface PlanetInfo {
  name: string;
  sign: string;
  degree: string;      // e.g. "24°45'"
  decimalDegrees: number;
  house?: number;
  retrograde?: boolean;
}

export interface NatalChartResult {
  planets: PlanetInfo[];
  ascendant: ZodiacPosition;
  mc: ZodiacPosition;
  dc: ZodiacPosition;
  ic: ZodiacPosition;
  houses: ZodiacPosition[];
  aspects: AspectEdge[];
  sect: "diurnal" | "nocturnal";
  hasTime: boolean; // false when no time was provided
  raw: BirthChart;  // raw kaabalah chart for further processing
}

export interface TransitResult {
  natalChart: NatalChartResult;
  transitDate: Date;
  transitPlanets: PlanetInfo[];
  aspects: Array<{
    transitPlanet: string;
    natalPlanet: string;
    aspect: AspectName;
    orb: number;
    applying: boolean;
    retrograde: boolean;
  }>;
}

// Planet names in Spanish for display
const PLANET_NAMES_ES: Record<string, string> = {
  Sun: "Sol",
  Moon: "Luna",
  Mercury: "Mercurio",
  Venus: "Venus",
  Mars: "Marte",
  Jupiter: "Júpiter",
  Saturn: "Saturno",
  Uranus: "Urano",
  Neptune: "Neptuno",
  Pluto: "Plutón",
};

// ============ CORE FUNCTIONS ============

/**
 * Resolve the browser URL where the Swiss Ephemeris data files (.se1) are served.
 *
 * Vite copies everything under `public/` verbatim into `dist/`, and `BASE_URL`
 * (import.meta.env.BASE_URL) is `/numerologia/` on GitHub Pages and `/` in local
 * dev — so this resolves correctly in both environments without hardcoding.
 */
function resolveEphePath(): string {
  const base = import.meta.env.BASE_URL || "/";
  // "BASE_URL" is guaranteed to end with "/", so strip it before appending
  // the "ephe" folder: "/numerologia/" -> "/numerologia/ephe".
  return `${base.replace(/\/+$/, "")}/ephe`;
}

/**
 * Initialize Swiss Ephemeris. In the browser it fetches the ephemeris .se1 files
 * from the URL where Vite serves them (resolved via BASE_URL); in Node/tests the
 * node backend resolves them from the kaabalah filesystem bundles, so no
 * ephePath is passed there. Idempotent — the underlying getSwissEph caches once.
 */
export async function initSwissEph(): Promise<void> {
  if (typeof window !== "undefined") {
    await kaabalahGetSwissEph({ ephePath: resolveEphePath() });
  } else {
    await kaabalahGetSwissEph();
  }
}

/**
 * Idempotent guard that ensures Swiss Ephemeris is initialized before any chart
 * calculation. Called at the start of every public calculation wrapper so no
 * caller (component, future feature, test) has to remember to init manually.
 */
async function ensureSwissEph(): Promise<void> {
  await initSwissEph();
}

/**
 * Calculate a natal chart from birth data.
 */
export async function calculateNatalChart(input: ChartInput): Promise<NatalChartResult> {
  await ensureSwissEph();
  const { year, month, day, hour, minute, latitude, longitude } = input;
  const hasTime = hour !== undefined && minute !== undefined;

  const options: BirthChartOptions = {
    date: {
      year,
      month,
      day,
      hour: hour ?? 12, // default to noon if no time
      minute: minute ?? 0,
    },
    latitude,
    longitude,
    houseSystem: (input.houseSystem as unknown as HouseSystem) || HouseSystemEnum.PLACIDUS,
    timeZoneSettings: input.timeZoneOffset !== undefined
      ? { utcOffsetMinutes: input.timeZoneOffset }
      : undefined,
  };

  const chart = await kaabalahGetBirthChart(options);

  const planets: PlanetInfo[] = Object.values(chart.planets).map((p) => ({
    name: PLANET_NAMES_ES[p.name] || p.name,
    sign: p.zodiacPosition.sign,
    degree: p.zodiacPosition.traditionalFormat,
    decimalDegrees: p.zodiacPosition.decimalDegrees,
    house: hasTime ? p.zodiacPosition.house : undefined,
  }));

  return {
    planets,
    ascendant: chart.houses.ascendant,
    mc: chart.houses.mc,
    dc: chart.houses.dc,
    ic: chart.houses.ic,
    houses: chart.houses.houses,
    aspects: chart.aspects,
    sect: chart.sect,
    hasTime,
    raw: chart,
  };
}

/**
 * Calculate current transits against a natal chart.
 */
export async function calculateTransits(
  natalInput: ChartInput,
  transitDate: Date,
): Promise<TransitResult> {
  await ensureSwissEph();
  const natal = await calculateNatalChart(natalInput);

  const options: TransitChartOptions = {
    natal: {
      date: {
        year: natalInput.year,
        month: natalInput.month,
        day: natalInput.day,
        hour: natalInput.hour ?? 12,
        minute: natalInput.minute ?? 0,
      },
      latitude: natalInput.latitude,
      longitude: natalInput.longitude,
    },
    transitDate,
  };

  const transitChart = await kaabalahGetTransitChart(options);

  const transitPlanets: PlanetInfo[] = Object.values(transitChart.transitPlanets).map(
    (p) => ({
      name: PLANET_NAMES_ES[p.name] || p.name,
      sign: p.zodiacPosition.sign,
      degree: p.zodiacPosition.traditionalFormat,
      decimalDegrees: p.zodiacPosition.decimalDegrees,
      house: p.natalHouse,
      retrograde: p.retrograde,
    }),
  );

  const aspects = transitChart.aspects.map((a) => ({
    transitPlanet: PLANET_NAMES_ES[a.planetA] || a.planetA,
    natalPlanet: PLANET_NAMES_ES[a.planetB] || a.planetB,
    aspect: a.aspect,
    orb: a.orb,
    applying: a.applying,
    retrograde: a.retrograde,
  }));

  return {
    natalChart: natal,
    transitDate,
    transitPlanets,
    aspects,
  };
}

/**
 * Calculate synastry (cross-chart comparison) between two people.
 */
export async function calculateSynastry(
  personA: ChartInput,
  personB: ChartInput,
): Promise<SynastryChart> {
  await ensureSwissEph();
  const options: SynastryChartOptions = {
    chartA: {
      date: {
        year: personA.year,
        month: personA.month,
        day: personA.day,
        hour: personA.hour ?? 12,
        minute: personA.minute ?? 0,
      },
      latitude: personA.latitude,
      longitude: personA.longitude,
    },
    chartB: {
      date: {
        year: personB.year,
        month: personB.month,
        day: personB.day,
        hour: personB.hour ?? 12,
        minute: personB.minute ?? 0,
      },
      latitude: personB.latitude,
      longitude: personB.longitude,
    },
  };

  return kaabalahGetSynastryChart(options);
}

// ============ HELPER FUNCTIONS ============

/**
 * Format a zodiac position for display.
 * Example: "Sol en Aries 24°45'"
 */
export function formatPlanetPosition(planet: PlanetInfo): string {
  const houseStr = planet.house ? ` Casa ${planet.house}` : "";
  return `${planet.name} en ${planet.sign} ${planet.degree}${houseStr}`;
}

/**
 * Format an aspect for display.
 */
export function formatAspect(
  planetA: string,
  planetB: string,
  aspect: string,
  orb: number,
): string {
  return `${planetA} ${aspect} ${planetB} (orbe ${orb.toFixed(1)}°)`;
}

/**
 * Get aspect emoji for display.
 */
export function getAspectEmoji(aspect: AspectName): string {
  const emojis: Record<string, string> = {
    conjunction: "☌",
    sextile: "⚹",
    square: "□",
    trine: "△",
    opposition: "☍",
  };
  return emojis[aspect] || "•";
}

/**
 * Get aspect name in Spanish.
 */
export function getAspectNameEs(aspect: AspectName): string {
  const names: Record<string, string> = {
    conjunction: "Conjunción",
    sextile: "Sextil",
    square: "Cuadrado",
    trine: "Trígono",
    opposition: "Oposición",
    quincunx: "Quincunce",
    duodecile: "Duodécil",
    octile: "Octil",
    trioctile: "Trioctil",
  };
  return names[aspect] || aspect;
}

/**
 * Get zodiac sign element.
 */
export function getSignElement(sign: string): string {
  const elements: Record<string, string> = {
    Aries: "Fuego", Leo: "Fuego", Sagittarius: "Fuego",
    Tauro: "Tierra", Virgo: "Tierra", Capricornio: "Tierra",
    Géminis: "Aire", Libra: "Aire", Acuario: "Aire",
    Cáncer: "Agua", Escorpio: "Agua", Piscis: "Agua",
  };
  return elements[sign] || "Desconocido";
}

/**
 * Get zodiac sign quality.
 */
export function getSignQuality(sign: string): string {
  const qualities: Record<string, string> = {
    Aries: "Cardinal", Tauro: "Fijo", Géminis: "Mutable",
    Cáncer: "Cardinal", Leo: "Fijo", Virgo: "Mutable",
    Libra: "Cardinal", Escorpio: "Fijo", Sagittarius: "Mutable",
    Capricornio: "Cardinal", Acuario: "Fijo", Piscis: "Mutable",
  };
  return qualities[sign] || "Desconocido";
}
