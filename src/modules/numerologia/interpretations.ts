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
const personalityTexts: Record<string, string> = interpretaciones.personalidad;
const motivationTexts: Record<string, string> = interpretaciones.motivacion;
const intuitionTexts: Record<string, string> = interpretaciones.intuicion;
const tendencyTexts: Record<string, string> = interpretaciones.tendencia;
const birthdayTexts: Record<string, string> = interpretaciones.cumpleanos;
const personalYearTexts: Record<string, string> = interpretaciones.personalYear;
const lifeCycleTexts: Record<string, string> = interpretaciones.ciclosVida;
const challengeTexts: Record<string, string> = interpretaciones.retos;
const personalCycleTexts: Record<string, string> = interpretaciones.ciclosPersonales;
const fibonacciTexts: Record<string, string> = interpretaciones.fibonacci;
const dateEnergyTexts: Record<string, string> = interpretaciones.energiasFecha;
const gematriaTexts: Record<string, string> = interpretaciones.gematria;
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

/**
 * Personality number (consonants of full name) interpretation (1-9, 11, 22, 33).
 */
export function getPersonalityInterpretation(n: number): string | undefined {
  return personalityTexts[String(n)];
}

/**
 * Motivation (first name) interpretation (1-9, 11, 22, 33).
 */
export function getMotivationInterpretation(n: number): string | undefined {
  return motivationTexts[String(n)];
}

/**
 * Intuition (second name) interpretation (1-9, 11, 22, 33). Value 0 means
 * the name has no reducible letters, so it has no interpretation.
 */
export function getIntuitionInterpretation(n: number): string | undefined {
  return intuitionTexts[String(n)];
}

/**
 * Tendency (last name) interpretation (1-9, 11, 22, 33).
 */
export function getTendencyInterpretation(n: number): string | undefined {
  return tendencyTexts[String(n)];
}

/**
 * Birthday number interpretation (1-9, 11, 22, 33).
 */
export function getBirthdayInterpretation(n: number): string | undefined {
  return birthdayTexts[String(n)];
}

/**
 * Personal year (calendar-year) interpretation (1-9, 11, 22, 33, 44).
 */
export function getPersonalYearInterpretation(n: number): string | undefined {
  return personalYearTexts[String(n)];
}

/**
 * Life-cycle interpretation for one of the 3 long life periods (1-9, 11, 22, 33).
 */
export function getLifeCycleInterpretation(n: number): string | undefined {
  return lifeCycleTexts[String(n)];
}

/**
 * Challenge number interpretation (0-8).
 */
export function getChallengeInterpretation(n: number): string | undefined {
  return challengeTexts[String(n)];
}

/**
 * Personal cycle interpretation: personal year, periods and months (1-9, 11, 22, 33, 44).
 */
export function getPersonalCycleInterpretation(n: number): string | undefined {
  return personalCycleTexts[String(n)];
}

/**
 * Fibonacci age-cycle interpretation by stage number (1-9, 11, 22, 33, 44).
 */
export function getFibonacciCycleInterpretation(n: number): string | undefined {
  return fibonacciTexts[String(n)];
}

/**
 * Date-energy interpretation for the day/month/year (1-9, 11, 22, 33).
 */
export function getDateEnergyInterpretation(n: number): string | undefined {
  return dateEnergyTexts[String(n)];
}

/**
 * Gematria interpretation: individuality (vowels), personality (consonants)
 * and synthesis (1-9, 11, 22, 33, 44).
 */
export function getGematriaInterpretation(n: number): string | undefined {
  return gematriaTexts[String(n)];
}