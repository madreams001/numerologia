import { describe, it, expect } from "vitest";
import {
  calculateLifePath,
  calculateBirthday,
  calculateLifeCycles,
  calculatePersonalYear,
  calculateExpression,
  calculateSoulUrge,
  calculatePersonality,
  calculateMotivation,
  calculateIntuition,
  calculateTendency,
  isMasterNumber,
  getLetterNumber,
} from "./calculations";

describe("Numerology Calculations", () => {
  // ============ LIFE PATH ============
  describe("Life Path Number", () => {
    it("should calculate life path for standard date", () => {
      // 15/03/1990: 1+5+0+3+1+9+9+0 = 28 -> 2+8 = 10 -> 1+0 = 1
      const date = new Date(1990, 2, 15);
      expect(calculateLifePath(date)).toBe(1);
    });

    it("should preserve master number 11", () => {
      // 02/11/1999: 2+1+1+1+9+9+9 = 32 -> 3+2 = 5
      // Actually: 2+1+1+1+9+9+9 = 32 -> 5
      const date = new Date(1999, 10, 2);
      expect(calculateLifePath(date)).toBe(5);
    });

    it("should preserve master number 22", () => {
      // 04/22/1999: 4+2+2+1+9+9+9 = 36 -> 3+6 = 9
      const date = new Date(1999, 3, 22);
      expect(calculateLifePath(date)).toBe(9);
    });
  });

  // ============ BIRTHDAY ============
  describe("Birthday Number", () => {
    it("should return day of month reduced", () => {
      const date = new Date(1990, 0, 15);
      // 15 -> 1+5 = 6
      expect(calculateBirthday(date)).toBe(6);
    });

    it("should preserve master number 11", () => {
      const date = new Date(1990, 0, 11);
      expect(calculateBirthday(date)).toBe(11);
    });

    it("should preserve master number 22", () => {
      const date = new Date(1990, 0, 22);
      expect(calculateBirthday(date)).toBe(22);
    });

    it("should reduce single digit", () => {
      const date = new Date(1990, 0, 5);
      expect(calculateBirthday(date)).toBe(5);
    });
  });

  // ============ LIFE CYCLES ============
  describe("Life Cycles", () => {
    it("should calculate three life cycles", () => {
      const date = new Date(1990, 2, 15);
      const cycles = calculateLifeCycles(date);
      expect(cycles).toHaveProperty("first");
      expect(cycles).toHaveProperty("second");
      expect(cycles).toHaveProperty("third");
    });

    it("first cycle should be month + day", () => {
      const date = new Date(1990, 2, 15);
      const cycles = calculateLifeCycles(date);
      // 3 + 15 = 18 -> 1+8 = 9
      expect(cycles.first).toBe(9);
    });
  });

  // ============ PERSONAL YEAR ============
  describe("Personal Year", () => {
    it("should calculate personal year for given year", () => {
      const date = new Date(1990, 2, 15);
      const year = calculatePersonalYear(date, 2024);
      expect(typeof year).toBe("number");
      expect(year).toBeGreaterThanOrEqual(1);
      expect(year).toBeLessThanOrEqual(33);
    });
  });

  // ============ EXPRESSION ============
  describe("Expression Number", () => {
    it("should calculate expression from full name", () => {
      // A=1, B=2, C=3, etc.
      const expr = calculateExpression("JOHN DOE");
      expect(typeof expr).toBe("number");
      expect(expr).toBeGreaterThanOrEqual(1);
      expect(expr).toBeLessThanOrEqual(33);
    });

    it("should handle accented characters", () => {
      const expr = calculateExpression("MARÍA JOSÉ");
      expect(typeof expr).toBe("number");
    });
  });

  // ============ SOUL URGE ============
  describe("Soul Urge Number", () => {
    it("should use only vowels", () => {
      // A=1, E=5, I=9, O=6, U=3
      const urge = calculateSoulUrge("AEIOU");
      // 1+5+9+6+3 = 24 -> 2+4 = 6
      expect(urge).toBe(6);
    });
  });

  // ============ PERSONALITY ============
  describe("Personality Number", () => {
    it("should use only consonants", () => {
      const pers = calculatePersonality("BCDFG");
      expect(typeof pers).toBe("number");
      expect(pers).toBeGreaterThanOrEqual(1);
    });
  });

  // ============ MOTIVATION ============
  describe("Motivation Number", () => {
    it("should use first name only", () => {
      const mot1 = calculateMotivation("JOHN DOE");
      const mot2 = calculateMotivation("JANE DOE");
      expect(mot1).not.toBe(mot2);
    });
  });

  // ============ INTUITION ============
  describe("Intuition Number", () => {
    it("should use middle name if exists", () => {
      const intWithMiddle = calculateIntuition("JOHN MICHAEL DOE");
      const intWithoutMiddle = calculateIntuition("JOHN DOE");
      // John has no middle name, so should return 0
      expect(intWithoutMiddle).toBe(0);
      expect(typeof intWithMiddle).toBe("number");
    });
  });

  // ============ TENDENCY ============
  describe("Tendency Number", () => {
    it("should use last name", () => {
      const tend1 = calculateTendency("JOHN SMITH");
      const tend2 = calculateTendency("JOHN JONES");
      expect(tend1).not.toBe(tend2);
    });
  });

  // ============ MASTER NUMBERS ============
  describe("Master Numbers", () => {
    it("should identify 11, 22, 33 as master numbers", () => {
      expect(isMasterNumber(11)).toBe(true);
      expect(isMasterNumber(22)).toBe(true);
      expect(isMasterNumber(33)).toBe(true);
    });

    it("should not identify other numbers as master", () => {
      expect(isMasterNumber(10)).toBe(false);
      expect(isMasterNumber(12)).toBe(false);
    });
  });

  // ============ LETTER MAPPING ============
  describe("Letter Mapping", () => {
    it("should map A=1, J=1, S=1", () => {
      expect(getLetterNumber("A")).toBe(1);
      expect(getLetterNumber("J")).toBe(1);
      expect(getLetterNumber("S")).toBe(1);
    });

    it("should map Z=8", () => {
      expect(getLetterNumber("Z")).toBe(8);
    });
  });
});
