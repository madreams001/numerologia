/**
 * Knowledge bridge — typed access to the numerology knowledge JSONs.
 * The JSONs (interpretaciones, numeros, compatibilidad) were previously
 * orphaned; this module is the single entry point for interpretation texts.
 */

import interpretaciones from "../../knowledge/numerologia/interpretaciones.json";
import numerosJson from "../../knowledge/numerologia/numeros.json";
import compatibilidadJson from "../../knowledge/numerologia/compatibilidad.json";

export interface NumberInfo {
  nombre: string;
  significado: string;
  elemento: string;
  planeta: string;
  positive: string[];
  negative: string;
}

export interface CompatibilityInfo {
  mejores: number[];
  buenos: number[];
  desafiantes: number[];
  evitar: number[];
}

const lifePathTexts: Record<string, string> = interpretaciones.vida;
const expressionTexts: Record<string, string> = interpretaciones.expresion;
const soulUrgeTexts: Record<string, string> = interpretaciones.deseo;
const numberInfoMap: Record<string, NumberInfo> = numerosJson.numeros;
const compatibilityMap: Record<string, CompatibilityInfo> =
  compatibilidadJson.compatibilidad;

/**
 * Life path interpretation text for a number (1-9, 11, 22, 33).
 */
export function getLifePathInterpretation(n: number): string | undefined {
  return lifePathTexts[String(n)];
}

/**
 * Expression number interpretation text (1-9, 11, 22, 33).
 */
export function getExpressionInterpretation(n: number): string | undefined {
  return expressionTexts[String(n)];
}

/**
 * Soul urge (inner desire) interpretation text (1-9, 11, 22, 33).
 */
export function getSoulUrgeInterpretation(n: number): string | undefined {
  return soulUrgeTexts[String(n)];
}

/**
 * Full number info: name, meaning, element, planet, positive/negative traits.
 */
export function getNumberInfo(n: number): NumberInfo | undefined {
  return numberInfoMap[String(n)];
}

/**
 * Compatibility groups (best/good/challenging/avoid) for a number.
 */
export function getCompatibility(n: number): CompatibilityInfo | undefined {
  return compatibilityMap[String(n)];
}

/**
 * General notes about numerology compatibility.
 */
export function getCompatibilityNotes(): string[] {
  return compatibilidadJson.notas;
}