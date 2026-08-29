import { describe, it, expect } from "vitest";
import {
  getLifePathInterpretation,
  getExpressionInterpretation,
  getSoulUrgeInterpretation,
  getNumberInfo,
  getCompatibility,
  getCompatibilityNotes,
  getPersonalityInterpretation,
  getMotivationInterpretation,
  getIntuitionInterpretation,
  getTendencyInterpretation,
  getBirthdayInterpretation,
  getPersonalYearInterpretation,
  getLifeCycleInterpretation,
  getChallengeInterpretation,
  getPersonalCycleInterpretation,
  getFibonacciCycleInterpretation,
  getDateEnergyInterpretation,
  getGematriaInterpretation,
} from "./interpretations";

describe("Interpretations Knowledge Bridge", () => {
  const allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  const unknownNumbers = [0, 10, 44, 55];

  it("provides life path interpretation for every known number", () => {
    for (const n of allNumbers) {
      const text = getLifePathInterpretation(n);
      expect(text).toBeTypeOf("string");
      expect(text!.length).toBeGreaterThan(10);
    }
  });

  it("returns undefined for numbers without interpretation", () => {
    for (const n of unknownNumbers) {
      expect(getLifePathInterpretation(n)).toBeUndefined();
    }
  });

  it("provides expression and soul urge interpretations", () => {
    expect(getExpressionInterpretation(1)).toBeTypeOf("string");
    expect(getExpressionInterpretation(33)).toBeTypeOf("string");
    expect(getSoulUrgeInterpretation(22)).toBeTypeOf("string");
    expect(getExpressionInterpretation(44)).toBeUndefined();
    expect(getSoulUrgeInterpretation(55)).toBeUndefined();
  });

  it("getNumberInfo returns structured info for all known numbers", () => {
    for (const n of allNumbers) {
      const info = getNumberInfo(n);
      expect(info).toBeDefined();
      expect(info!.nombre).toBeTypeOf("string");
      expect(info!.significado).toBeTypeOf("string");
      expect(info!.elemento).toBeTypeOf("string");
      expect(info!.planeta).toBeTypeOf("string");
      expect(info!.positive).toHaveLength(5);
      expect(info!.negative).toBeTypeOf("string");
    }
    expect(getNumberInfo(44)).toBeDefined();
    expect(getNumberInfo(44)!.nombre).toBeTypeOf("string");
    expect(getNumberInfo(55)).toBeUndefined();
  });

  it("getCompatibility returns group arrays and notes", () => {
    for (const n of allNumbers.slice(0, 9)) {
      const compat = getCompatibility(n);
      expect(compat).toBeDefined();
      expect(Array.isArray(compat!.mejores)).toBe(true);
      expect(Array.isArray(compat!.buenos)).toBe(true);
      expect(Array.isArray(compat!.desafiantes)).toBe(true);
      expect(Array.isArray(compat!.evitar)).toBe(true);
    }
    expect(getCompatibilityNotes().length).toBeGreaterThan(0);
    expect(getCompatibility(11)).toBeDefined();
    expect(getCompatibility(22)).toBeDefined();
    expect(getCompatibility(33)).toBeDefined();
    expect(getCompatibility(55)).toBeUndefined();
  });

  it("provides text interpretations for the classical per-number sections", () => {
    for (const n of allNumbers) {
      expect(getPersonalityInterpretation(n)).toBeTypeOf("string");
      expect(getMotivationInterpretation(n)).toBeTypeOf("string");
      expect(getTendencyInterpretation(n)).toBeTypeOf("string");
      expect(getBirthdayInterpretation(n)).toBeTypeOf("string");
    }
    // Intuition may be 0 when the second name has no reducible letters.
    expect(getIntuitionInterpretation(0)).toBeUndefined();
    expect(getIntuitionInterpretation(1)).toBeTypeOf("string");
    expect(getIntuitionInterpretation(44)).toBeUndefined();
  });

  it("provides personal-year and life-cycle interpretations", () => {
    for (const n of allNumbers) {
      expect(getPersonalYearInterpretation(n)).toBeTypeOf("string");
      expect(getLifeCycleInterpretation(n)).toBeTypeOf("string");
    }
    expect(getPersonalYearInterpretation(44)).toBeTypeOf("string");
    expect(getPersonalYearInterpretation(55)).toBeUndefined();
  });

  it("provides challenge interpretations for values 0-8 only", () => {
    for (let n = 0; n <= 8; n++) {
      const text = getChallengeInterpretation(n);
      expect(text).toBeTypeOf("string");
      expect(text!.length).toBeGreaterThan(10);
    }
    expect(getChallengeInterpretation(9)).toBeUndefined();
    expect(getChallengeInterpretation(-1)).toBeUndefined();
  });

  it("provides personal-cycle, fibonacci, date-energy and gematria interpretations", () => {
    for (const n of allNumbers) {
      expect(getPersonalCycleInterpretation(n)).toBeTypeOf("string");
      expect(getFibonacciCycleInterpretation(n)).toBeTypeOf("string");
      expect(getDateEnergyInterpretation(n)).toBeTypeOf("string");
      expect(getGematriaInterpretation(n)).toBeTypeOf("string");
    }
    expect(getPersonalCycleInterpretation(44)).toBeTypeOf("string");
    expect(getFibonacciCycleInterpretation(44)).toBeTypeOf("string");
    expect(getGematriaInterpretation(44)).toBeTypeOf("string");
    expect(getPersonalCycleInterpretation(55)).toBeUndefined();
    expect(getDateEnergyInterpretation(10)).toBeUndefined();
  });
});