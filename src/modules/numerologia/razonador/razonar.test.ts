import { describe, it, expect } from "vitest";
import { razonar } from "./razonar";
import { generarNarrativa } from "./narrativa";
import { analizarConsulta } from "./index";
import type { Hallazgo, NumRef } from "./index";
import type { NumerologiaResult } from "../types";

function ref(
  rotulo: string,
  valor: number,
  dimension: string,
  perfil?: "registro" | "uso"
): NumRef {
  return { rotulo, valor, dimension, perfil };
}

describe("Razonador", () => {
  it("detects refuerzo when the same value appears in two dimensions", () => {
    const hallazgos = razonar({
      refs: [
        ref("Vida", 7, "camino"),
        ref("Cumpleaños", 7, "don"),
      ],
    }).filter((h) => h.tipo === "refuerzo");

    expect(hallazgos).toHaveLength(1);
    expect(hallazgos[0].severidad).toBe("MEDIA");
    expect(hallazgos[0].numeroA.valor).toBe(7);
    expect(hallazgos[0].descripcion).toContain("7");
    expect(hallazgos[0].descripcion).toContain("Vida");
  });

  it("escalates refuerzo to ALTA with three or more dimensions", () => {
    const hallazgo = razonar({
      refs: [
        ref("Vida", 7, "camino"),
        ref("Cumpleaños", 7, "don"),
        ref("Ciclo 1", 7, "ciclo"),
      ],
    }).find((h) => h.tipo === "refuerzo");

    expect(hallazgo?.severidad).toBe("ALTA");
  });

  it("does not emit refuerzo for single occurrences nor master values", () => {
    const hallazgos = razonar({
      refs: [
        ref("Vida", 7, "camino"),
        ref("Cumpleaños", 11, "don"),
      ],
    });

    expect(hallazgos.filter((h) => h.tipo === "refuerzo").some((h) => h.numeroA.valor === 11)).toBe(false);
    expect(hallazgos.filter((h) => h.tipo === "maestro")).toHaveLength(1);
  });

  it("detects conflicto between paired values", () => {
    const hallazgos = razonar({
      refs: [
        ref("Vida", 4, "camino"),
        ref("Expresión (Registro)", 7, "nombre"),
      ],
    });

    const conflicto = hallazgos.find((h) => h.tipo === "conflicto");
    expect(conflicto).toBeDefined();
    expect(conflicto?.numeroA.valor).toBe(4);
    expect(conflicto?.numeroB?.valor).toBe(7);
    expect(conflicto?.severidad).toBe("ALTA");
  });

  it("detects número maestro", () => {
    const hallazgos = razonar({
      refs: [ref("Vida", 11, "camino")],
    });

    const maestro = hallazgos.find((h) => h.tipo === "maestro");
    expect(maestro).toBeDefined();
    expect(maestro?.numeroA.valor).toBe(11);
    expect(maestro?.severidad).toBe("MEDIA");
  });

  it("escalates a repeated número maestro to ALTA", () => {
    const maestro = razonar({
      refs: [
        ref("Vida", 11, "camino"),
        ref("Tendencia (Registro)", 11, "nombre", "registro"),
      ],
    }).find((h) => h.tipo === "maestro");

    expect(maestro?.severidad).toBe("ALTA");
    expect(maestro?.numeroA.rotulo).toContain("Vida");
  });

  it("detects reto when a challenge number matches the registro personality", () => {
    const reto = razonar({
      refs: [
        ref("Reto Final", 4, "reto"),
        ref("Personalidad (Registro)", 4, "nombre", "registro"),
      ],
    }).find((h) => h.tipo === "reto");

    expect(reto?.severidad).toBe("ALTA");
    expect(reto?.numeroB?.rotulo).toBe("Personalidad (Registro)");
  });

  it("flags high challenge numbers without a name match as MEDIA", () => {
    const retos = razonar({
      refs: [ref("Reto 2", 7, "reto")],
    }).filter((h) => h.tipo === "reto");

    expect(retos).toHaveLength(1);
    expect(retos[0].severidad).toBe("MEDIA");
  });

  it("detects coherencia when a name metric differs between profiles", () => {
    const coherencia = razonar({
      refs: [
        ref("Expresión (Registro)", 7, "nombre", "registro"),
        ref("Expresión (Uso diario)", 3, "nombre", "uso"),
      ],
    }).find((h) => h.tipo === "coherencia");

    expect(coherencia?.numeroA.valor).toBe(7);
    expect(coherencia?.numeroB?.valor).toBe(3);
    expect(coherencia?.severidad).toBe("MEDIA");
  });
});

describe("generarNarrativa", () => {
  it("orders tensiones before fortalezas and yields a two-paragraph resumen", () => {
    const hallazgos: Hallazgo[] = [
      {
        tipo: "refuerzo",
        severidad: "MEDIA",
        numeroA: ref("Vida", 7, "camino"),
        descripcion: "El número 7 se repite en varias áreas.",
      },
      {
        tipo: "conflicto",
        severidad: "ALTA",
        numeroA: ref("Cumpleaños", 4, "don"),
        numeroB: ref("Ciclo 2", 7, "ciclo"),
        descripcion: "Estos dos números se tensan entre sí.",
      },
    ];

    const narrativa = generarNarrativa(hallazgos);

    expect(narrativa.secciones.map((s) => s.titulo)).toEqual([
      "Tensiones a integrar",
      "Fortalezas que se apoyan entre sí",
    ]);
    expect(narrativa.resumen.length).toBeGreaterThan(0);
    expect(narrativa.resumen.split("\n\n")).toHaveLength(2);
    expect(narrativa.resumen).toContain("1 tensión");
  });

  it("produces an empty section list and a balanced resumen without findings", () => {
    const narrativa = generarNarrativa([]);

    expect(narrativa.secciones).toHaveLength(0);
    expect(narrativa.resumen.length).toBeGreaterThan(0);
    expect(narrativa.resumen).not.toContain("tensión");
  });
});

describe("analizarConsulta", () => {
  function construirResultadoSintetico(): NumerologiaResult {
    const meses = Array.from({ length: 12 }, (_mes, i) => ({
      month: i + 1,
      value: { reducedValue: 1, reductionSteps: [1] },
    }));
    return {
      vida: 11,
      cumpleanos: 4,
      ciclos: { primero: 4, segundo: 7, tercero: 7 },
      personalYear: 7,
      retos: {
        day: 4,
        month: 7,
        year: 2,
        subChallenge1: 7,
        subChallenge2: 6,
        challenge3: 4,
        mainChallenge: 4,
      },
      energias: {
        dayEnergy: { reducedValue: 4, reductionSteps: [4] },
        monthEnergy: { reducedValue: 7, reductionSteps: [7] },
        yearEnergy: { reducedValue: 2, reductionSteps: [2] },
      },
      ciclosPersonales: {
        personalYear: { reducedValue: 2, reductionSteps: [2] },
        personalPeriods: [
          { startMonth: 1, endMonth: 999, value: { reducedValue: 2, reductionSteps: [2] } },
          { startMonth: 1, endMonth: 999, value: { reducedValue: 4, reductionSteps: [4] } },
          { startMonth: 1, endMonth: 999, value: { reducedValue: 6, reductionSteps: [6] } },
        ],
        personalMonths: meses as NumerologiaResult["ciclosPersonales"]["personalMonths"],
        currentPersonalPeriod: 1,
        currentPersonalMonth: 1,
        currentAge: 35,
        lifePath: { reducedValue: 11, reductionSteps: [11] },
        yearUsedOnCalculations: 2026,
      },
      fibonacci: {
        currentAge: 35,
        cycle1: { reducedValue: 2, reductionSteps: [2] },
        cycle2: { reducedValue: 4, reductionSteps: [4] },
        cycle3: { reducedValue: 6, reductionSteps: [6] },
        cycle4: { reducedValue: 8, reductionSteps: [8] },
        cycle5: { reducedValue: 1, reductionSteps: [1] },
        cycle6: { reducedValue: 3, reductionSteps: [3] },
        cycle7: { reducedValue: 5, reductionSteps: [5] },
      },
      registro: {
        nombreCompleto: "NOMBRE APELLIDO",
        expresion: 4,
        deseoAlma: 3,
        personalidad: 7,
        motivacion: 6,
        intuicion: 0,
        tendencia: 11,
        gematria: {
          vowels: { originalSum: 0, reductionSteps: [], finalValue: 1 },
          consonants: { originalSum: 0, reductionSteps: [], finalValue: 1 },
          synthesis: { originalSum: 0, reductionSteps: [1], finalValue: 1 },
          includedLetters: [],
        },
      },
      uso: {
        nombreCompleto: "NOMBRE",
        expresion: 6,
        deseoAlma: 3,
        personalidad: 2,
        motivacion: 6,
        intuicion: 0,
        tendencia: 11,
        gematria: {
          vowels: { originalSum: 0, reductionSteps: [], finalValue: 1 },
          consonants: { originalSum: 0, reductionSteps: [], finalValue: 1 },
          synthesis: { originalSum: 0, reductionSteps: [1], finalValue: 1 },
          includedLetters: [],
        },
      },
    } as unknown as NumerologiaResult;
  }

  it("produces a NarrativaResult with sections and a non-empty resumen", () => {
    const narrativa = analizarConsulta(construirResultadoSintetico());

    expect(narrativa.secciones.length).toBeGreaterThan(0);
    expect(narrativa.secciones.some((s) => s.titulo === "Tensiones a integrar")).toBe(true);
    expect(narrativa.secciones.some((s) => s.titulo === "Números maestros")).toBe(true);
    expect(narrativa.secciones.some((s) => s.titulo === "Entre tu nombre de registro y tu nombre de uso")).toBe(true);
    expect(typeof narrativa.resumen).toBe("string");
    expect(narrativa.resumen.length).toBeGreaterThan(0);
    for (const seccion of narrativa.secciones) {
      expect(seccion.parrafos.length).toBeGreaterThan(0);
      for (const parrafo of seccion.parrafos) {
        expect(typeof parrafo).toBe("string");
        expect(parrafo.length).toBeGreaterThan(0);
      }
    }
  });
});