/**
 * Numerology reduction utilities
 * Preserves master numbers (11, 22, 33)
 */

export const MASTER_NUMBERS = [11, 22, 33];

export function sumDigits(n: number): number {
  return n
    .toString()
    .split("")
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

export function reduceWithMasters(n: number): number {
  while (n > 9 && !MASTER_NUMBERS.includes(n)) {
    n = sumDigits(n);
  }
  return n;
}

export function reduceNumber(n: number): number {
  return reduceWithMasters(n);
}
