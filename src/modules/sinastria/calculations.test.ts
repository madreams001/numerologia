// @vitest-environment node
/**
 * Sinastría Calculations Tests
 */
/// <reference types="vitest" />

import { describe, it, expect, beforeAll } from "vitest";
import {
  clasificarCruceNumerico,
  clasificarAspecto,
  calcularCruceNumerologico,
  calcularCruceAstrologico,
  calcularSinastria,
  type DatosPersonaSinastria,
} from "./calculations";
import { initSwissEph, type ChartInput } from "../astrologia/calculations";

const BUENOS_AIRES = { latitude: -34.6037, longitude: -58.3816 };

// Persona de referencia para los tests numerológicos.
const personaA: DatosPersonaSinastria = {
  nombre: "Ana",
  fecha: new Date(1990, 2, 15), // 15-mar-1990
  nombreCompleto: "Ana García",
};

describe("clasificarCruceNumerico", () => {
  it("números iguales son armonía", () => {
    expect(clasificarCruceNumerico(5, 5)).toBe("armonia");
    expect(clasificarCruceNumerico(22, 22)).toBe("armonia");
  });

  it("suma armónica (9, 11, 22) es armonía", () => {
    expect(clasificarCruceNumerico(3, 6)).toBe("armonia"); // 9
    expect(clasificarCruceNumerico(5, 6)).toBe("armonia"); // 11
    expect(clasificarCruceNumerico(11, 11)).toBe("armonia"); // 22 (iguales)
  });

  it("número maestro cruzado con no-maestro es desafío", () => {
    expect(clasificarCruceNumerico(11, 5)).toBe("desafio");
    expect(clasificarCruceNumerico(4, 33)).toBe("desafio");
  });

  it("diferencia grande es desafío", () => {
    expect(clasificarCruceNumerico(1, 9)).toBe("desafio"); // diff 8
  });

  it("caso neutro", () => {
    expect(clasificarCruceNumerico(3, 5)).toBe("neutro"); // suma 8, diff 2
    expect(clasificarCruceNumerico(2, 8)).toBe("neutro"); // suma 10 (no 9/11/22), diff 6 (<8)
  });

  it("suma armónica con diff moderado suma 11", () => {
    expect(clasificarCruceNumerico(4, 7)).toBe("armonia"); // suma 11
  });
});

describe("clasificarAspecto", () => {
  it("aspectos armónicos", () => {
    expect(clasificarAspecto("conjunction")).toBe("armonia");
    expect(clasificarAspecto("sextile")).toBe("armonia");
    expect(clasificarAspecto("trine")).toBe("armonia");
  });

  it("aspectos tensos", () => {
    expect(clasificarAspecto("square")).toBe("desafio");
    expect(clasificarAspecto("opposition")).toBe("desafio");
    expect(clasificarAspecto("quincunx")).toBe("desafio");
    expect(clasificarAspecto("trioctile")).toBe("desafio");
  });

  it("aspectos menores son neutros", () => {
    expect(clasificarAspecto("duodecile")).toBe("neutro");
    expect(clasificarAspecto("octile")).toBe("neutro");
  });
});

describe("calcularCruceNumerologico", () => {
  it("produce un cruce por cada entrada del knowledge base numerológico", () => {
    const personaB: DatosPersonaSinastria = {
      nombre: "Luis",
      fecha: new Date(1985, 6, 22),
      nombreCompleto: "Luis Pérez",
    };
    const cruces = calcularCruceNumerologico(personaA, personaB);
    // El knowledge base tiene 5 cruces numerológicos.
    expect(cruces.length).toBe(5);
    // Cada cruce tiene una interpretación válida.
    for (const cruce of cruces) {
      expect(cruce.significado.length).toBeGreaterThan(0);
      expect(cruce.interpretacion.length).toBeGreaterThan(0);
      expect(["armonia", "desafio", "neutro"]).toContain(cruce.tono);
    }
  });

  it("las claves cubren los pares definidos", () => {
    const personaB: DatosPersonaSinastria = {
      nombre: "Luis",
      fecha: new Date(1985, 6, 22),
      nombreCompleto: "Luis Pérez",
    };
    const cruces = calcularCruceNumerologico(personaA, personaB);
    const claves = cruces.map((c) => c.clave).sort();
    expect(claves).toEqual([
      "deseoAlma-deseoAlma",
      "expresion-expresion",
      "personalidad-personalidad",
      "vida-expresion",
      "vida-vida",
    ]);
  });
});

describe("calcularCruceAstrologico y calcularSinastria", () => {
  beforeAll(async () => {
    await initSwissEph();
  }, 30000);

  const chartA: ChartInput = {
    year: 1990,
    month: 3,
    day: 15,
    hour: 14,
    minute: 30,
    latitude: BUENOS_AIRES.latitude,
    longitude: BUENOS_AIRES.longitude,
    timeZoneOffset: -180,
  };
  const chartB: ChartInput = {
    year: 1985,
    month: 7,
    day: 22,
    hour: 9,
    minute: 0,
    latitude: BUENOS_AIRES.latitude,
    longitude: BUENOS_AIRES.longitude,
    timeZoneOffset: -180,
  };

  it("calcularCruceAstrologico cruza dos cartas reales", async () => {
    const cruces = await calcularCruceAstrologico(chartA, chartB);
    expect(Array.isArray(cruces)).toBe(true);
    for (const cruce of cruces) {
      expect(cruce.planetaA).toBeDefined();
      expect(cruce.planetaB).toBeDefined();
      expect(typeof cruce.orb).toBe("number");
      expect(["armonia", "desafio", "neutro"]).toContain(cruce.tono);
    }
  });

  it("calcularSinastria incluye solo cruces cuando hay chart", async () => {
    const result = await calcularSinastria(personaA, {
      nombre: "Luis",
      fecha: new Date(1985, 6, 22),
      nombreCompleto: "Luis Pérez",
    }, chartA, chartB);
    expect(result.personaA.nombre).toBe("Ana");
    expect(result.personaB.nombre).toBe("Luis");
    expect(result.crucesNumerologicos.length).toBe(5);
    expect(result.crucesAstrologicos).toBeDefined();
    expect(result.crucesAstrologicos!.length).toBeGreaterThanOrEqual(0);
  });

  it("calcularSinastria omite cruces astrológicos sin charts", async () => {
    const result = await calcularSinastria(personaA, {
      nombre: "Luis",
      fecha: new Date(1985, 6, 22),
      nombreCompleto: "Luis Pérez",
    });
    expect(result.crucesNumerologicos.length).toBe(5);
    expect(result.crucesAstrologicos).toBeUndefined();
  });
});
