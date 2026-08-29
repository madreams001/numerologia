import { describe, it, expect } from "vitest";
import {
  getLifePathInterpretation,
  getExpressionInterpretation,
  getSoulUrgeInterpretation,
  getNumberInfo,
  getCompatibility,
  getCompatibilityNotes,
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
    expect(getNumberInfo(44)).toBeUndefined();
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
    expect(getCompatibility(11)).toBeUndefined();
  });
});