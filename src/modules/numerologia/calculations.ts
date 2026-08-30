/**
 * Numerology Calculations
 * All letter-to-number mappings and calculation functions
 */

import { reduceWithMasters, MASTER_NUMBERS } from "../../utils/reduce";
import {
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

  // Per-component school: reduce each component (day, month, year) with
  // master numbers preserved, then reduce the sum. This is the same school
  // used by the Personal Year, Life Cycles and the kaabalah straight-across
  // reduction (which also preserves masters). Direct digit concatenation is
  // a DIFFERENT school that only differs on master-heavy dates, but those
  // differences are exactly what we want to keep (e.g. 11/01/1954 ->
  // per-component 4 vs concatenation 22).
  return reduceWithMasters(
    reduceWithMasters(day) + reduceWithMasters(month) + reduceWithMasters(year)
  );
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

  // Per-component school: reduce each component (with masters) before summing.
  // First cycle: reduced month + reduced day
  const first = reduceWithMasters(
    reduceWithMasters(month) + reduceWithMasters(day)
  );

  // Second cycle: reduced day + reduced year
  const second = reduceWithMasters(
    reduceWithMasters(day) + reduceWithMasters(year)
  );

  // Third cycle: reduced first + reduced second
  const third = reduceWithMasters(
    reduceWithMasters(first) + reduceWithMasters(second)
  );

  return { first, second, third };
}

// ============ PERSONAL YEAR ============

export function calculatePersonalYear(birthDate: Date, currentYear: number): number {
  // Pythagorean school: reduce(day) + reduce(month) + reduce(currentYear),
  // then reduce the sum. Digit concatenation is a DIFFERENT school: it
  // happens to agree on some dates (7/2/2026 -> 19 -> 1 either way) but
  // diverges when a concatenated total lands on a master number, e.g.
  // 11/01/2024 -> concat "1112024" = 11 vs per-component 11+1+8 = 20 -> 2.
  // (For the record, the "9 instead of 1" seen for 7/2/1969 was caused by
  // the timezone bug shifting the day to the 6th, "262026" -> 9 — not by
  // concatenation.) We use per-component consistently everywhere.
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

// ============ MOTIVATION (GIVEN NAMES) ============

/**
 * Motivation: the full set of given names (e.g. "ANDRES RAUL"), reduced
 * together. Every given name contributes — there is no split on the first
 * word. Empty or letter-less input reduces to 0.
 */
export function calculateMotivation(firstNames: string): number {
  const letters = getLetters(firstNames);
  // SCHOOL DECISION (documented): this computes ALL given names reduced
  // together (e.g. "ANDRES RAUL" -> 5), interpreted as the "general impulse"
  // of the given names. The CLASSICAL "soul motive" school uses ONLY the
  // vowels of the first name (without Y). The full-name variant was chosen
  // deliberately and the value is kept; the classical alternative exists.
  const sum = letters.reduce((acc, l) => acc + letterToNumber(l), 0);
  return reduceWithMasters(sum);
}

// ============ INTUITION (SECOND GIVEN NAME) ============

export function calculateIntuition(nombres: string): number {
  const parts = nombres.trim().split(/\s+/);
  const middleName = parts.length >= 2 ? parts[1] : "";
  const letters = getLetters(middleName);
  const sum = letters.reduce((acc, l) => acc + letterToNumber(l), 0);
  return reduceWithMasters(sum);
}

// ============ TENDENCY (LAST NAMES) ============

/**
 * Tendency: the full set of last names (e.g. "AVILA BEDETTI"), reduced
 * directly. The last names are supplied as-is (no slicing of a full name).
 * Empty or letter-less input reduces to 0.
 */
export function calculateTendency(lastNames: string): number {
  const letters = getLetters(lastNames);
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
 * Master-number policy for challenges: day/month/year are reduced WITH
 * masters preserved (e.g. day 29 -> 11, year 1975 -> 22), deliberately kept
 * in sync with Date Energies (getDateEnergies uses the same per-component
 * reduction). The resulting absolute differences stay within the
 * interpretable 0-8 range for ordinary dates.
 *
 * Semantics (classical numerology): the THREE life-line challenges form the
 * trinity — P1 = |month − day|, P2 = |day − year|, P3 = |month − year| — and
 * the FINAL challenge is |P1 − P2|. kaabalah called |P1 − P2| "mainChallenge"
 * and omitted P3; we keep the field names for compatibility but now expose
 * all four values.
 */
export interface Challenges {
  day: number;
  month: number;
  year: number;
  subChallenge1: number; // |month - day| first life-line challenge
  subChallenge2: number; // |day - year| second life-line challenge
  challenge3: number;    // |month - year| third life-line challenge
  mainChallenge: number; // |subChallenge1 - subChallenge2| final challenge
}

export function calculateChallenges(birthDate: Date): Challenges {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const year = birthDate.getFullYear();

  const dayN = reduceWithMasters(day);
  const monthN = reduceWithMasters(month);
  const yearN = reduceWithMasters(year);

  const subChallenge1 = reduceWithMasters(Math.abs(monthN - dayN));
  const subChallenge2 = reduceWithMasters(Math.abs(dayN - yearN));
  const challenge3 = reduceWithMasters(Math.abs(monthN - yearN));
  const mainChallenge = reduceWithMasters(
    Math.abs(subChallenge1 - subChallenge2)
  );

  return {
    day: dayN,
    month: monthN,
    year: yearN,
    subChallenge1,
    subChallenge2,
    challenge3,
    mainChallenge,
  };
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
