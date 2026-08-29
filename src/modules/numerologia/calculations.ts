/**
 * Numerology Calculations
 * All letter-to-number mappings and calculation functions
 */

import { reduceWithMasters, MASTER_NUMBERS } from "../../utils/reduce";
import {
  calculateChallenges as kaabalahCalculateChallenges,
  calculateCycles as kaabalahCalculateCycles,
  calculatePersonalCycles as kaabalahCalculatePersonalCycles,
  calculateFibonacciCycle as kaabalahCalculateFibonacciCycle,
  calculateStraightAcrossReductionLifePath as kaabalahStraightAcrossLifePath,
  getDateEnergies as kaabalahGetDateEnergies,
} from "kaabalah/numerology";
import {
  calculateGematria as kaabalahCalculateGematria,
  reverseGematria as kaabalahReverseGematria,
} from "kaabalah/gematria";

// Re-export kaabalah types for consumers of the wrappers below.
export type {
  NumerologyModuleTypes as KaabalahNumerologyTypes,
  NumerologyModuleTypes,
} from "kaabalah/numerology";
export type {
  GematriaData as KaabalahGematriaTypes,
  GematriaData,
} from "kaabalah/gematria";
import type { NumerologyModuleTypes } from "kaabalah/numerology";
import type { GematriaData } from "kaabalah/gematria";

// Letter-to-number mapping (A=1..I=9, J=1..R=9, S=1..Z=8)
const LETTER_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

// Spanish-specific accents mapping
const ACCENT_MAP: Record<string, string> = {
  Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U",
  Ü: "U", Ñ: "N",
};

function normalizeLetter(char: string): string {
  const upper = char.toUpperCase();
  return ACCENT_MAP[upper] || upper;
}

function letterToNumber(char: string): number {
  const normalized = normalizeLetter(char);
  return LETTER_MAP[normalized] || 0;
}

function isVowel(char: string): boolean {
  const normalized = normalizeLetter(char);
  return "AEIOU".includes(normalized);
}

function isConsonant(char: string): boolean {
  const normalized = normalizeLetter(char);
  return /^[A-Z]$/.test(normalized) && !isVowel(normalized);
}

function getLetters(name: string): string[] {
  return name
    .split("")
    .filter((c) => /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]$/.test(c));
}

// ============ LIFE PATH NUMBER ============

export function calculateLifePath(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();

  // Sum all digits of the full date
  const total = sumAllDigits(`${month}${day}${year}`);
  return reduceWithMasters(total);
}

function sumAllDigits(dateStr: string): number {
  return dateStr.split("").reduce((sum, d) => sum + parseInt(d, 10), 0);
}

// ============ BIRTHDAY NUMBER ============

export function calculateBirthday(birthDate: Date): number {
  return reduceWithMasters(birthDate.getDate());
}

// ============ LIFE CYCLES ============

export interface LifeCycles {
  first: number;   // Birth to ~27-28
  second: number;  // ~28-55
  third: number;   // ~56+
}

export function calculateLifeCycles(birthDate: Date): LifeCycles {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const year = birthDate.getFullYear();

  // First cycle: sum month + day
  const first = reduceWithMasters(month + day);

  // Second cycle: sum day + year
  const second = reduceWithMasters(day + year);

  // Third cycle: sum first + second
  const third = reduceWithMasters(first + second);

  return { first, second, third };
}

// ============ PERSONAL YEAR ============

export function calculatePersonalYear(birthDate: Date, currentYear: number): number {
  // Pythagorean school: reduce(day) + reduce(month) + reduce(currentYear),
  // then reduce the sum. Concatenating all digits gives wrong results on
  // many dates (e.g. 7/2/2026 -> 9 instead of 1).
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const total =
    reduceWithMasters(day) +
    reduceWithMasters(month) +
    reduceWithMasters(currentYear);
  return reduceWithMasters(total);
}

// ============ EXPRESSION NUMBER ============

export function calculateExpression(fullName: string): number {
  const letters = getLetters(fullName);
  const sum = letters.reduce((acc, l) => acc + letterToNumber(l), 0);
  return reduceWithMasters(sum);
}

// ============ SOUL URGE (DESIRE) ============

export function calculateSoulUrge(fullName: string): number {
  const letters = getLetters(fullName);
  const vowels = letters.filter((l) => isVowel(l));
  const sum = vowels.reduce((acc, l) => acc + letterToNumber(l), 0);
  return reduceWithMasters(sum);
}

// ============ PERSONALITY ============

export function calculatePersonality(fullName: string): number {
  const letters = getLetters(fullName);
  const consonants = letters.filter((l) => isConsonant(l));
  const sum = consonants.reduce((acc, l) => acc + letterToNumber(l), 0);
  return reduceWithMasters(sum);
}

// ============ MOTIVATION (FIRST NAME) ============

export function calculateMotivation(fullName: string): number {
  const firstName = fullName.split(" ")[0] || "";
  const letters = getLetters(firstName);
  const sum = letters.reduce((acc, l) => acc + letterToNumber(l), 0);
  return reduceWithMasters(sum);
}

// ============ INTUITION (MIDDLE NAME) ============

export function calculateIntuition(fullName: string): number {
  const parts = fullName.split(" ");
  const middleName = parts.length >= 3 ? parts[1] : "";
  const letters = getLetters(middleName);
  const sum = letters.reduce((acc, l) => acc + letterToNumber(l), 0);
  return reduceWithMasters(sum);
}

// ============ TENDENCY (LAST NAME) ============

export function calculateTendency(fullName: string): number {
  const parts = fullName.split(" ");
  const lastName = parts[parts.length - 1] || "";
  const letters = getLetters(lastName);
  const sum = letters.reduce((acc, l) => acc + letterToNumber(l), 0);
  return reduceWithMasters(sum);
}

// ============ MASTER NUMBER CHECK ============

export function isMasterNumber(n: number): boolean {
  return MASTER_NUMBERS.includes(n);
}

// ============ LETTER-TO-NUMBER FOR DISPLAY ============

export function getLetterNumber(char: string): number {
  return letterToNumber(char);
}

export function getLetterMapping(): Record<string, number> {
  return { ...LETTER_MAP };
}

// ============ KAABALAH WRAPPERS (advanced numerology) ============
// These functions delegate to the kaabalah library. They are complements to
// the manual calculations above and keep their own master-number handling
// (kaabalah also treats 44 as a master number).

export type GematriaResult = ReturnType<typeof kaabalahCalculateGematria>;

/**
 * Life challenges (kaabalah): absolute differences between the reduced
 * day, month and year. Values range from 0 to 8.
 */
export function calculateChallenges(
  birthDate: Date
): NumerologyModuleTypes.Challenges {
  return kaabalahCalculateChallenges(birthDate);
}

/**
 * Daily/monthly/yearly date energies (kaabalah) with reduction steps.
 */
export function getDateEnergies(
  birthDate: Date
): NumerologyModuleTypes.DateEnergies {
  return kaabalahGetDateEnergies(birthDate);
}

/**
 * Personal cycles (kaabalah): personal year + 3 periods + 12 months.
 * Based on birthday-to-birthday calendar, NOT the app's calendar-year
 * personal year. The active month/period are computed against "today".
 */
export function calculatePersonalCycles(
  birthDate: Date,
  firstName: string
): NumerologyModuleTypes.PersonalCycles {
  return kaabalahCalculatePersonalCycles(birthDate, undefined, firstName);
}

/**
 * Fibonacci age cycles (kaabalah): produces 7 cycles keyed by the current
 * age. `today` defaults to now but can be passed to make results deterministic.
 */
export function calculateFibonacciCycle(
  birthDate: Date,
  today: Date = new Date()
): NumerologyModuleTypes.FibonacciCycle {
  return kaabalahCalculateFibonacciCycle(birthDate, today);
}

/**
 * Yearly / age / monthly cycles (kaabalah). Named differently from
 * calculateLifeCycles (the 3 life periods) to avoid confusion.
 */
export function calculateCyclesInfo(
  startDate: Date,
  today: Date
): NumerologyModuleTypes.CycleInfo {
  return kaabalahCalculateCycles(startDate, today);
}

/**
 * Gematria of a phrase (kaabalah Hebrew correspondence model).
 * Returns vowels/consonants/synthesis with reduction steps and the
 * included letters. NOTE: letter values differ from the Pythagorean
 * map used by calculateExpression/calculateSoulUrge.
 */
export function calculateGematria(phrase: string): GematriaResult {
  return kaabalahCalculateGematria(phrase);
}

/**
 * Reverse gematria: find name/letter combinations that match target
 * vowel(s), consonant(s) or total synthesis numbers.
 */
export function findNameForNumber(
  options: GematriaData.ReverseGematriaOptions
): GematriaData.ReverseGematriaOutput {
  return kaabalahReverseGematria(options);
}

/**
 * Straight-across life path reduction (kaabalah). Used as a parity check
 * against calculateLifePath, which implements the same technique by hand.
 */
export function calculateStraightAcrossLifePath(
  birthDate: Date
): NumerologyModuleTypes.StraightAcrossReductionLifePathResult {
  return kaabalahStraightAcrossLifePath(birthDate);
}

export { normalizeLetter, isVowel, isConsonant, getLetters };
