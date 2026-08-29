/**
 * Numerología — Tipos extendidos del resultado.
 *
 * NumerologiaResult: los 11 números clásicos (cálculo propio) más las
 * secciones nuevas basadas en kaabalah. Las secciones nuevas exponen
 * SOLO los números calculados (la interpretación textual se agrega en
 * una fase posterior).
 */
import { calculateGematria } from './calculations'
import type { NumerologyModuleTypes } from './calculations'

export type { NumerologyModuleTypes }

export interface NumerologiaResult {
  vida: number
  cumpleanos: number
  ciclos: { primero: number; segundo: number; tercero: number }
  personalYear: number
  expresion: number
  deseoAlma: number
  personalidad: number
  motivacion: number
  intuicion: number
  tendencia: number
  retos: NumerologyModuleTypes.Challenges
  energias: NumerologyModuleTypes.DateEnergies
  ciclosPersonales: NumerologyModuleTypes.PersonalCycles
  fibonacci: NumerologyModuleTypes.FibonacciCycle
  gematria: ReturnType<typeof calculateGematria>
}
