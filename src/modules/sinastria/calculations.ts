/**
 * Sinastría — Cálculos de compatibilidad entre dos personas.
 *
 * Combina:
 *   - Cruce numerológico: compara los números clave de dos personas
 *     (Vida, Expresión, Deseo del Alma, Personalidad) usando la tabla de
 *     cruces y las interpretaciones de `src/knowledge/sinastria/cruzamientos.json`.
 *   - Cruce astrológico: reusa `calculateSynastry` de astrología, que cruza
 *     las posiciones planetarias reales de las dos cartas natales.
 */
import type { AspectName } from "kaabalah/astrology";
import { calculateSynastry as astrologiaCalculateSynastry } from "../astrologia/calculations";
import type { ChartInput } from "../astrologia/calculations";
import {
  calculateLifePath,
  calculateExpression,
  calculateSoulUrge,
  calculatePersonality,
} from "../numerologia/calculations";
import cruzamientos from "../../knowledge/sinastria/cruzamientos.json";

// ============ TYPES ============

export type TonoCruce = "armonia" | "desafio" | "neutro";

export interface CruceNumerologico {
  /** Clave del campo numerológico (vida, expresion, deseoAlma, personalidad). */
  clave: string;
  /** Nombre legible del número A (e.g. "Número de Vida"). */
  nombreA: string;
  /** Nombre legible del número B. */
  nombreB: string;
  /** Valor del número de la persona A. */
  valorA: number;
  /** Valor del número de la persona B. */
  valorB: number;
  /** Significado textual del cruce (desde el knowledge base). */
  significado: string;
  /** Tono del cruce: armonía, desafío o neutro. */
  tono: TonoCruce;
  /** Texto de interpretación del tono (desde el knowledge base). */
  interpretacion: string;
}

export interface CruceAstrologico {
  planetaA: string;
  planetaB: string;
  /** Tipo de aspecto (conjunción, trígono, cuadrado, ...). */
  aspecto: AspectName;
  /** Orbe en grados. */
  orb: number;
  tono: TonoCruce;
  interpretacion: string;
}

export interface SinastriaResult {
  personaA: { nombre: string };
  personaB: { nombre: string };
  crucesNumerologicos: CruceNumerologico[];
  crucesAstrologicos?: CruceAstrologico[];
}

// ============ KNOWLEDGE BASE HELPERS ============

/** Nombres legibles de cada clave numerológica para la UI. */
const NOMBRES_NUMERO: Record<string, string> = {
  vida: "Número de Vida",
  expresion: "Expresión",
  deseoAlma: "Deseo del Alma",
  personalidad: "Personalidad",
};

/**
 * Interpretación textual de cada tono, tomada del knowledge base.
 */
const INTERPRETACION: Record<TonoCruce, string> = {
  armonia: cruzamientos.interpretaciones.armonia,
  desafio: cruzamientos.interpretaciones.desafio,
  neutro: cruzamientos.interpretaciones.neutro,
};

const MAESTROS = [11, 22, 33] as const;

function esMaestro(n: number): boolean {
  return (MAESTROS as readonly number[]).includes(n);
}

/**
 * Clasifica un cruce de dos números en armonía / desafío / neutro.
 *
 * Heurística documentada (numerología práctica):
 *   - Números IGUALES (incluidos los maestros) → armonía: resuenan en la
 *     misma frecuencia, la relación "fluye sin esfuerzo".
 *   - Suma armónica entre 9 y 11 → armonía: son complementos que se afinan
 *     (p.ej. 3 + 6 = 9, 5 + 6 = 11).
 *   - Un número maestro (11/22/33) cruzado con un número NO maestro →
 *     desafío: el ideal elevado choca con el cotidiano, exige trabajo.
 *   - Diferencia grande (>= 8) → desafío: naturalezas demasiado distintas
 *     que requieren esfuerzo consciente.
 *   - Cualquier otro caso → neutro.
 */
export function clasificarCruceNumerico(a: number, b: number, maestro: boolean = true): TonoCruce {
  if (a === b) return "armonia";
  const suma = a + b;
  if (suma === 9 || suma === 11 || suma === 22) return "armonia";
  if (maestro && (esMaestro(a) || esMaestro(b))) return "desafio";
  if (Math.abs(a - b) >= 8) return "desafio";
  return "neutro";
}

// ============ CRUCE NUMEROLÓGICO ============

export interface DatosPersonaSinastria {
  nombre: string;
  fecha: Date;
  nombreCompleto: string;
}

/**
 * Calcula el cruce numerológico entre dos personas.
 * Usa la tabla de cruces del knowledge base y reutiliza los cálculos
 * numerológicos existentes (Vida, Expresión, Deseo del Alma, Personalidad).
 */
export function calcularCruceNumerologico(
  personaA: DatosPersonaSinastria,
  personaB: DatosPersonaSinastria,
): CruceNumerologico[] {
  const numerosA = {
    vida: calculateLifePath(personaA.fecha),
    expresion: calculateExpression(personaA.nombreCompleto),
    deseoAlma: calculateSoulUrge(personaA.nombreCompleto),
    personalidad: calculatePersonality(personaA.nombreCompleto),
  };
  const numerosB = {
    vida: calculateLifePath(personaB.fecha),
    expresion: calculateExpression(personaB.nombreCompleto),
    deseoAlma: calculateSoulUrge(personaB.nombreCompleto),
    personalidad: calculatePersonality(personaB.nombreCompleto),
  };

  const metodoNumerologico = cruzamientos.metodos.find((m) => m.nombre === "Cruzamiento Numerológico");
  const crucesDef = metodoNumerologico?.cruces?.filter((c): c is { numero_a: string; numero_b: string; significado: string } =>
    "numero_a" in c && c.numero_a !== undefined
  ) ?? [];

  return crucesDef.map((cruce) => {
    const a = numerosA[cruce.numero_a as keyof typeof numerosA];
    const b = numerosB[cruce.numero_b as keyof typeof numerosB];
    const tono = clasificarCruceNumerico(a, b);
    return {
      clave: `${cruce.numero_a}-${cruce.numero_b}`,
      nombreA: NOMBRES_NUMERO[cruce.numero_a],
      nombreB: NOMBRES_NUMERO[cruce.numero_b],
      valorA: a,
      valorB: b,
      significado: cruce.significado,
      tono,
      interpretacion: INTERPRETACION[tono],
    };
  });
}

// ============ CRUCE ASTROLÓGICO ============

/**
 * Clasifica un aspecto sinástrico según su naturaleza armónica o tensa.
 */
export function clasificarAspecto(aspecto: AspectName): TonoCruce {
  const armonicos: AspectName[] = ["conjunction", "sextile", "trine"];
  const tensos: AspectName[] = ["square", "opposition", "quincunx", "trioctile"];
  if (armonicos.includes(aspecto)) return "armonia";
  if (tensos.includes(aspecto)) return "desafio";
  return "neutro"; // duodecile, octile y demás
}

/**
 * Calcula el cruce astrológico entre dos personas (sinastría real).
 * Reusa `calculateSynastry` de astrología: cruza las posiciones planetarias
 * de las dos cartas natales y devuelve los aspectos entre ambas.
 */
export async function calcularCruceAstrologico(
  chartA: ChartInput,
  chartB: ChartInput,
): Promise<CruceAstrologico[]> {
  const synastry = await astrologiaCalculateSynastry(chartA, chartB);
  return synastry.aspects.map((asp) => {
    const tono = clasificarAspecto(asp.aspect);
    return {
      planetaA: asp.planetA,
      planetaB: asp.planetB,
      aspecto: asp.aspect,
      orb: asp.orb,
      tono,
      interpretacion: INTERPRETACION[tono],
    };
  });
}

// ============ AGRUPADOR ============

/**
 * Calcula la sinastría completa (numerológica y astrológica) entre dos personas.
 * El cruce astrológico se omite cuando no se proveen las coordenadas/lugar.
 */
export async function calcularSinastria(
  personaA: DatosPersonaSinastria,
  personaB: DatosPersonaSinastria,
  chartA?: ChartInput,
  chartB?: ChartInput,
): Promise<SinastriaResult> {
  const crucesNumerologicos = calcularCruceNumerologico(personaA, personaB);
  let crucesAstrologicos: CruceAstrologico[] | undefined;
  if (chartA && chartB) {
    crucesAstrologicos = await calcularCruceAstrologico(chartA, chartB);
  }
  return {
    personaA: { nombre: personaA.nombre },
    personaB: { nombre: personaB.nombre },
    crucesNumerologicos,
    crucesAstrologicos,
  };
}
