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
  calculateChallenges,
  getDateEnergies,
  calculatePersonalCycles,
  calculateFibonacciCycle,
  calculateCyclesInfo,
  calculateGematria,
  findNameForNumber,
  calculateStraightAcrossLifePath,
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

  // ============ KAABALAH WRAPPERS ============
  describe("Kaabalah Wrappers", () => {
    // Dates at local noon avoid TZ day-shift (recommended by kaabalah).
    const date = new Date(1990, 2, 15, 12); // 1990-03-15

    it("straight-across life path matches the manual reduction (parity)", () => {
      const dates = [
        new Date(1990, 2, 15, 12),
        new Date(1999, 10, 2, 12),
        new Date(1999, 3, 22, 12),
        new Date(1990, 0, 15, 12),
        new Date(2000, 0, 1, 12),
        new Date(1975, 6, 4, 12), // preserves master 33
        new Date(1988, 11, 30, 12),
      ];
      for (const d of dates) {
        const kaabalahRes = calculateStraightAcrossLifePath(d).lifePath;
        expect(calculateLifePath(d)).toBe(kaabalahRes.reducedValue);
      }
    });

    it("straight-across result exposes day/month/year energies", () => {
      const res = calculateStraightAcrossLifePath(date);
      expect(res.dayEnergy.reducedValue).toBe(6);
      expect(res.monthEnergy.reducedValue).toBe(3);
      expect(res.yearEnergy.reducedValue).toBe(1);
      expect(res.lifePath.reductionSteps[res.lifePath.reductionSteps.length - 1]).toBe(
        res.lifePath.reducedValue
      );
    });

    it("calculateChallenges returns structured challenges 0-8", () => {
      const c = calculateChallenges(date);
      expect(c).toHaveProperty("day");
      expect(c).toHaveProperty("month");
      expect(c).toHaveProperty("year");
      expect(c).toHaveProperty("mainChallenge");
      expect(c).toHaveProperty("subChallenge1");
      expect(c).toHaveProperty("subChallenge2");
      const values = [c.day, c.month, c.year, c.mainChallenge, c.subChallenge1, c.subChallenge2];
      for (const v of values) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(8);
      }
      // 1990-03-15: day=15->6, month=3, year=1990->1
      expect(c.day).toBe(6);
      expect(c.month).toBe(3);
      expect(c.year).toBe(1);
      expect(c.mainChallenge).toBe(2);
      expect(c.subChallenge1).toBe(3);
      expect(c.subChallenge2).toBe(5);
    });

    it("getDateEnergies returns day/month/year with reduction steps", () => {
      const e = getDateEnergies(date);
      expect(e.dayEnergy.reductionSteps[0]).toBe(15);
      expect(e.dayEnergy.reducedValue).toBe(6);
      expect(e.monthEnergy.reducedValue).toBe(3);
      // 1990 -> 19 -> 10 -> 1
      expect(e.yearEnergy.reductionSteps).toEqual([1990, 19, 10, 1]);
      for (const key of ["dayEnergy", "monthEnergy", "yearEnergy"] as const) {
        const v = e[key];
        expect(v.reductionSteps[v.reductionSteps.length - 1]).toBe(v.reducedValue);
      }
    });

    it("calculatePersonalCycles returns year, 3 periods, 12 months and active indexes", () => {
      const pc = calculatePersonalCycles(date, "MARIA");
      expect(pc.personalYear.reducedValue).toBe(1);
      expect(Array.isArray(pc.personalYear.reductionSteps)).toBe(true);
      expect(pc.personalPeriods).toHaveLength(3);
      for (const period of pc.personalPeriods) {
        expect(period.value.reducedValue).toBeGreaterThanOrEqual(1);
      }
      expect(pc.personalMonths).toHaveLength(12);
      for (const month of pc.personalMonths) {
        expect(month.month).toBeGreaterThanOrEqual(1);
        expect(month.month).toBeLessThanOrEqual(12);
      }
      expect(pc.currentPersonalPeriod).toBeGreaterThanOrEqual(1);
      expect(pc.currentPersonalPeriod).toBeLessThanOrEqual(3);
      expect(pc.currentPersonalMonth).toBeGreaterThanOrEqual(1);
      expect(pc.currentPersonalMonth).toBeLessThanOrEqual(12);
      expect(pc.currentAge).toBeGreaterThanOrEqual(0);
      expect(pc.yearUsedOnCalculations).toBeGreaterThan(2000);
      expect(pc.lifePath.reducedValue).toBe(1);
      expect(pc.soulNumber?.reducedValue).toBe(3);
    });

    it("calculateFibonacciCycle is deterministic for a fixed today", () => {
      const today = new Date(2026, 7, 29, 12); // 2026-08-29
      const fib = calculateFibonacciCycle(date, today);
      expect(fib.currentAge).toBe(36);
      const expected = { cycle1: 9, cycle2: 2, cycle3: 2, cycle4: 4, cycle5: 6, cycle6: 1, cycle7: 7 };
      for (const [key, value] of Object.entries(expected)) {
        const cycle = fib[key as keyof typeof fib] as { reducedValue: number; reductionSteps: number[] };
        expect(cycle.reducedValue).toBe(value);
        expect(cycle.reductionSteps[cycle.reductionSteps.length - 1]).toBe(cycle.reducedValue);
      }
    });

    it("calculateCyclesInfo returns yearly/age/monthly cycles", () => {
      const today = new Date(2026, 7, 29, 12);
      const info = calculateCyclesInfo(date, today);
      expect(info.ageCycles).toHaveLength(7);
      expect(info.yearlyCycles).toHaveLength(7);
      expect(info.monthlyCycles).toHaveLength(7);
      expect(info.ageCycles.filter((c) => c.isActive)).toHaveLength(1);
      expect(info.monthlyCycles.filter((c) => c.isActive)).toHaveLength(1);
      expect(info.currentAgeCycle).toBe(6);
      expect(info.totalDays).toBeGreaterThanOrEqual(1);
    });

    it("calculateGematria computes synthesis with reduction steps", () => {
      const g = calculateGematria("MARIA JOSE");
      // kaabalah gematria uses its own correspondence model (not Pythagorean).
      // NOTE: in gematria, reductionSteps excludes the original sum (unlike
      // the numerology reduceToSingleWithSteps representation).
      expect(g.synthesis.originalSum).toBe(333);
      expect(g.synthesis.finalValue).toBe(9);
      expect(g.synthesis.reductionSteps[g.synthesis.reductionSteps.length - 1]).toBe(9);
      expect(g.vowels.finalValue).toBe(5);
      expect(g.consonants.finalValue).toBe(4);
      expect(Array.isArray(g.includedLetters)).toBe(true);
    });

    it("calculateGematria handles a pure-vowel phrase", () => {
      const g = calculateGematria("AEIOU");
      expect(g.consonants.finalValue).toBe(0);
      expect(g.vowels.finalValue).toBe(1);
      expect(g.synthesis.finalValue).toBe(1);
      expect(g.synthesis.originalSum).toBe(28);
    });

    it("findNameForNumber returns letter combinations matching a target synthesis", () => {
      const res = findNameForNumber({ targetSynthesis: 6, maxLength: 4, maxResults: 3 });
      expect(res.totalFound).toBeGreaterThan(0);
      for (const r of res.results) {
        expect(typeof r.letters).toBe("string");
        expect(r.letters.length).toBeGreaterThan(0);
        expect(r.synthesis.finalValue).toBe(6);
      }
      expect(Array.isArray(res.results)).toBe(true);
    });
  });
});
