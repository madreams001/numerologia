// @vitest-environment node
/**
 * Astrology Calculations Tests
 */
/// <reference types="vitest" />

import { describe, it, expect, beforeAll } from "vitest";
import {
  calculateNatalChart,
  calculateTransits,
  initSwissEph,
  formatPlanetPosition,
  formatAspect,
  getAspectEmoji,
  getAspectNameEs,
  getSignElement,
  getSignQuality,
  type ChartInput,
  type PlanetInfo,
} from "./calculations";

// Test coordinates
const BUENOS_AIRES = { latitude: -34.6037, longitude: -58.3816 };

describe("Astrology Helper Functions", () => {
  describe("formatPlanetPosition", () => {
    it("formats planet with sign and degree", () => {
      const planet: PlanetInfo = {
        name: "Sol",
        sign: "Aries",
        degree: "24°45'",
        decimalDegrees: 24.75,
        house: 10,
      };
      expect(formatPlanetPosition(planet)).toBe("Sol en Aries 24°45' Casa 10");
    });

    it("formats planet without house", () => {
      const planet: PlanetInfo = {
        name: "Luna",
        sign: "Tauro",
        degree: "12°30'",
        decimalDegrees: 12.5,
      };
      expect(formatPlanetPosition(planet)).toBe("Luna en Tauro 12°30'");
    });
  });

  describe("formatAspect", () => {
    it("formats conjunction with orb", () => {
      expect(formatAspect("Sol", "Luna", "Conjunción", 1.5)).toBe(
        "Sol Conjunción Luna (orbe 1.5°)"
      );
    });

    it("formats trine with orb", () => {
      expect(formatAspect("Venus", "Marte", "Trígono", 3.2)).toBe(
        "Venus Trígono Marte (orbe 3.2°)"
      );
    });
  });

  describe("getAspectEmoji", () => {
    it("returns correct emoji for conjunction", () => {
      expect(getAspectEmoji("conjunction")).toBe("☌");
    });

    it("returns correct emoji for sextile", () => {
      expect(getAspectEmoji("sextile")).toBe("⚹");
    });

    it("returns correct emoji for square", () => {
      expect(getAspectEmoji("square")).toBe("□");
    });

    it("returns correct emoji for trine", () => {
      expect(getAspectEmoji("trine")).toBe("△");
    });

    it("returns correct emoji for opposition", () => {
      expect(getAspectEmoji("opposition")).toBe("☍");
    });
  });

  describe("getAspectNameEs", () => {
    it("returns Spanish name for conjunction", () => {
      expect(getAspectNameEs("conjunction")).toBe("Conjunción");
    });

    it("returns Spanish name for sextile", () => {
      expect(getAspectNameEs("sextile")).toBe("Sextil");
    });

    it("returns Spanish name for square", () => {
      expect(getAspectNameEs("square")).toBe("Cuadrado");
    });

    it("returns Spanish name for trine", () => {
      expect(getAspectNameEs("trine")).toBe("Trígono");
    });

    it("returns Spanish name for opposition", () => {
      expect(getAspectNameEs("opposition")).toBe("Oposición");
    });
  });

  describe("getSignElement", () => {
    it("returns Fuego for fire signs", () => {
      expect(getSignElement("Aries")).toBe("Fuego");
      expect(getSignElement("Leo")).toBe("Fuego");
      expect(getSignElement("Sagittarius")).toBe("Fuego");
    });

    it("returns Tierra for earth signs", () => {
      expect(getSignElement("Tauro")).toBe("Tierra");
      expect(getSignElement("Virgo")).toBe("Tierra");
      expect(getSignElement("Capricornio")).toBe("Tierra");
    });

    it("returns Aire for air signs", () => {
      expect(getSignElement("Géminis")).toBe("Aire");
      expect(getSignElement("Libra")).toBe("Aire");
      expect(getSignElement("Acuario")).toBe("Aire");
    });

    it("returns Agua for water signs", () => {
      expect(getSignElement("Cáncer")).toBe("Agua");
      expect(getSignElement("Escorpio")).toBe("Agua");
      expect(getSignElement("Piscis")).toBe("Agua");
    });
  });

  describe("getSignQuality", () => {
    it("returns Cardinal for cardinal signs", () => {
      expect(getSignQuality("Aries")).toBe("Cardinal");
      expect(getSignQuality("Cáncer")).toBe("Cardinal");
      expect(getSignQuality("Libra")).toBe("Cardinal");
      expect(getSignQuality("Capricornio")).toBe("Cardinal");
    });

    it("returns Fijo for fixed signs", () => {
      expect(getSignQuality("Tauro")).toBe("Fijo");
      expect(getSignQuality("Leo")).toBe("Fijo");
      expect(getSignQuality("Escorpio")).toBe("Fijo");
      expect(getSignQuality("Acuario")).toBe("Fijo");
    });

    it("returns Mutable for mutable signs", () => {
      expect(getSignQuality("Géminis")).toBe("Mutable");
      expect(getSignQuality("Virgo")).toBe("Mutable");
      expect(getSignQuality("Sagittarius")).toBe("Mutable");
      expect(getSignQuality("Piscis")).toBe("Mutable");
    });
  });
});

// Natal chart test — async, uses Swiss Ephemeris WASM
describe("calculateNatalChart", () => {
  beforeAll(async () => {
    await initSwissEph();
  }, 30000);
  const buenosAiresInput: ChartInput = {
    year: 1990,
    month: 3,
    day: 15,
    hour: 14,
    minute: 30,
    latitude: BUENOS_AIRES.latitude,
    longitude: BUENOS_AIRES.longitude,
    timeZoneOffset: -180, // UTC-3 Argentina
  };

  it("calculates complete natal chart with time", async () => {
    const chart = await calculateNatalChart(buenosAiresInput);

    expect(chart.hasTime).toBe(true);
    expect(chart.planets.length).toBeGreaterThanOrEqual(10); // Sun through Pluto
    expect(chart.ascendant).toBeDefined();
    expect(chart.mc).toBeDefined();
    expect(chart.dc).toBeDefined();
    expect(chart.ic).toBeDefined();
    expect(chart.houses.length).toBe(12);
    expect(chart.raw).toBeDefined();
  });

  it("returns planets with correct structure", async () => {
    const chart = await calculateNatalChart(buenosAiresInput);

    const sun = chart.planets.find((p) => p.name === "Sol");
    expect(sun).toBeDefined();
    expect(sun!.sign).toBeDefined();
    expect(sun!.degree).toBeDefined();
    expect(sun!.decimalDegrees).toBeGreaterThanOrEqual(0);
    expect(sun!.decimalDegrees).toBeLessThanOrEqual(360);
    expect(sun!.house).toBeDefined(); // should have house when time is provided
  });

  it("calculates natal chart without time (no houses)", async () => {
    const noTimeInput: ChartInput = {
      year: 1990,
      month: 3,
      day: 15,
      latitude: BUENOS_AIRES.latitude,
      longitude: BUENOS_AIRES.longitude,
    };

    const chart = await calculateNatalChart(noTimeInput);

    expect(chart.hasTime).toBe(false);
    expect(chart.planets.length).toBeGreaterThanOrEqual(10);
    // Without time, planets may not have accurate house assignments
  });

  it("includes aspects in natal chart", async () => {
    const chart = await calculateNatalChart(buenosAiresInput);

    expect(chart.aspects).toBeDefined();
    expect(Array.isArray(chart.aspects)).toBe(true);
    // A real chart always has aspects
  });

  it("returns sect (diurnal or nocturnal)", async () => {
    const chart = await calculateNatalChart(buenosAiresInput);

    expect(["diurnal", "nocturnal"]).toContain(chart.sect);
  });
});

describe("calculateTransits", () => {
  beforeAll(async () => {
    await initSwissEph();
  }, 30000);
  const buenosAiresInput: ChartInput = {
    year: 1990,
    month: 3,
    day: 15,
    hour: 14,
    minute: 30,
    latitude: BUENOS_AIRES.latitude,
    longitude: BUENOS_AIRES.longitude,
    timeZoneOffset: -180,
  };

  it("calculates transits for a given date", async () => {
    const transitDate = new Date(2026, 7, 25); // Aug 25, 2026
    const transitResult = await calculateTransits(buenosAiresInput, transitDate);

    expect(transitResult.natalChart).toBeDefined();
    expect(transitResult.transitDate).toEqual(transitDate);
    expect(transitResult.transitPlanets.length).toBeGreaterThanOrEqual(10);
    expect(Array.isArray(transitResult.aspects)).toBe(true);
  });

  it("transit planets have retrograde flag", async () => {
    const transitDate = new Date(2026, 7, 25);
    const transitResult = await calculateTransits(buenosAiresInput, transitDate);

    for (const planet of transitResult.transitPlanets) {
      expect(typeof planet.retrograde).toBe("boolean");
    }
  });
});
