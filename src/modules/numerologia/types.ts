/**
 * Numerología — Tipos extendidos del resultado.
 *
 * NumerologiaResult: los 11 números clásicos (cálculo propio) más las
 * secciones nuevas basadas en kaabalah. Las secciones nuevas exponen
 * SOLO los números calculados (la interpretación textual se agrega en
 * una fase posterior).
 */
import { calculateGematria, type Challenges } from './calculations'
import type { NumerologyModuleTypes } from './calculations'

export type { NumerologyModuleTypes }

/**
 * Cálculos basados en el NOMBRE de un perfil (Registro Civil o Uso diario).
 * Expresión/Deseo/Personalidad/Gematría usan el nombre completo
 * (nombres + apellidos); Motivación/Intuición usan los nombres; Tendencia
 * usa los apellidos.
 */
export interface PerfilCalculos {
  /** Nombre completo del perfil (nombres + apellidos), tal como se ingresó. */
  nombreCompleto: string
  expresion: number
  deseoAlma: number
  personalidad: number
  motivacion: number
  intuicion: number
  tendencia: number
  gematria: ReturnType<typeof calculateGematria>
}

export interface NumerologiaResult {
  vida: number
  cumpleanos: number
  ciclos: { primero: number; segundo: number; tercero: number }
  personalYear: number
  retos: Challenges
  energias: NumerologyModuleTypes.DateEnergies
  ciclosPersonales: NumerologyModuleTypes.PersonalCycles
  fibonacci: NumerologyModuleTypes.FibonacciCycle
  /** Perfil A — nombre del Registro Civil (de nacimiento). */
  registro: PerfilCalculos
  /** Perfil B — nombre de uso diario (cómo lo llaman / se presenta). */
  uso: PerfilCalculos
}
