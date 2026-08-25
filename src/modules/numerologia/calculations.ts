/**
 * Numerology Calculations
 * All letter-to-number mappings and calculation functions
 */

import { reduceWithMasters, MASTER_NUMBERS } from "../../utils/reduce";

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
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const total = sumAllDigits(`${month}${day}${currentYear}`);
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

export { normalizeLetter, isVowel, isConsonant, getLetters };
