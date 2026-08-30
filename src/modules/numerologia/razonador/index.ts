/**
 * Razonador — public entry point.
 * `analizarConsulta` runs both steps: build the NumRef map -> razonar ->
 * generarNarrativa.
 */

import { razonar, resultadoARefs } from './razonar'
import { generarNarrativa } from './narrativa'
import type { NumerologiaResult } from '../types'
import type { NarrativaResult } from './narrativa'

export { razonar, resultadoARefs, generarNarrativa }
export type {
  EntradaRazonador,
  Hallazgo,
  NumRef,
  PerfilId,
  SeveridadHallazgo,
  TipoHallazgo,
} from './razonar'
export type { NarrativaResult, SeccionNarrativa } from './narrativa'

export function analizarConsulta(resultado: NumerologiaResult): NarrativaResult {
  const refs = resultadoARefs(resultado)
  const hallazgos = razonar({ refs })
  return generarNarrativa(hallazgos)
}