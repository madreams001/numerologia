/**
 * Narrativa — orders the findings into readable Spanish sections plus a
 * two-paragraph synthesis. Group order and texts come from reglas.json.
 */

import reglas from './reglas.json'
import { resolverPlantilla } from './razonar'
import type { Hallazgo, TipoHallazgo, SeveridadHallazgo } from './razonar'

export interface SeccionNarrativa {
  titulo: string
  parrafos: string[]
}

export interface NarrativaResult {
  secciones: SeccionNarrativa[]
  resumen: string
}

type ClaveSeccion = 'tensiones' | 'fortalezas' | 'maestros' | 'coherencia'

interface ResumenConector {
  singular: string
  plural: string
  frase: string
}

interface PrefijosTipo {
  ALTA: string
  otra: string
}

interface ReglasNarrativa {
  narrativa: {
    secciones: Record<ClaveSeccion, string>
    intros: Record<ClaveSeccion, string>
    prefijos: Record<TipoHallazgo, PrefijosTipo>
    resumen: {
      inicio: string
      tensiones: ResumenConector
      refuerzos: ResumenConector
      maestros: ResumenConector
      coherencia: string
      final: string
      equilibrado: string
    }
  }
}

const config = reglas as unknown as ReglasNarrativa

const ORDEN_SEVERIDAD: Record<SeveridadHallazgo, number> = { ALTA: 3, MEDIA: 2, BAJA: 1 }

const TIPOS_POR_SECCION: Record<ClaveSeccion, TipoHallazgo[]> = {
  tensiones: ['conflicto', 'reto'],
  fortalezas: ['refuerzo'],
  maestros: ['maestro'],
  coherencia: ['coherencia'],
}

const ORDEN_SECCIONES: ClaveSeccion[] = ['tensiones', 'fortalezas', 'maestros', 'coherencia']

function ordenarPorPrioridad(hallazgos: Hallazgo[]): Hallazgo[] {
  return [...hallazgos].sort(
    (a, b) =>
      ORDEN_SEVERIDAD[b.severidad] - ORDEN_SEVERIDAD[a.severidad] ||
      a.tipo.localeCompare(b.tipo)
  )
}

function construirSeccion(clave: ClaveSeccion, hallazgos: Hallazgo[]): SeccionNarrativa | null {
  const tipos = TIPOS_POR_SECCION[clave]
  const coincidentes = hallazgos.filter((h) => tipos.includes(h.tipo))
  if (coincidentes.length === 0) return null
  const prefijo = (h: Hallazgo) => {
    const porTipo = config.narrativa.prefijos[h.tipo]
    return h.severidad === 'ALTA' ? porTipo.ALTA : porTipo.otra
  }
  const parrafos = [
    config.narrativa.intros[clave],
    ...ordenarPorPrioridad(coincidentes).map((h) => `${prefijo(h)} — ${h.descripcion}`),
  ]
  return { titulo: config.narrativa.secciones[clave], parrafos }
}

function contarPorTipo(hallazgos: Hallazgo[], tipo: TipoHallazgo): number {
  return hallazgos.filter((h) => h.tipo === tipo).length
}

function conectorCantidad(n: number, conector: ResumenConector): string {
  const sustantivo = n === 1 ? conector.singular : conector.plural
  return resolverPlantilla(conector.frase, { n, sustantivo })
}

function construirResumen(hallazgos: Hallazgo[]): string {
  const { inicio, tensiones, refuerzos, maestros, coherencia, final, equilibrado } =
    config.narrativa.resumen
  const nTensiones = contarPorTipo(hallazgos, 'conflicto') + contarPorTipo(hallazgos, 'reto')
  const nRefuerzos = contarPorTipo(hallazgos, 'refuerzo')
  const nMaestros = contarPorTipo(hallazgos, 'maestro')
  const nCoherencia = contarPorTipo(hallazgos, 'coherencia')

  const primerParrafo: string[] = [inicio]
  if (nTensiones > 0) {
    primerParrafo.push(conectorCantidad(nTensiones, tensiones))
  } else if (nRefuerzos === 0 && nMaestros === 0) {
    primerParrafo.push(equilibrado)
  }
  if (nRefuerzos > 0) primerParrafo.push(conectorCantidad(nRefuerzos, refuerzos))
  if (nMaestros > 0) primerParrafo.push(conectorCantidad(nMaestros, maestros))

  const segundoParrafo: string[] = []
  if (nCoherencia > 0) segundoParrafo.push(coherencia)
  segundoParrafo.push(final)

  return `${primerParrafo.join(' ')}\n\n${segundoParrafo.join(' ')}`
}

export function generarNarrativa(hallazgos: Hallazgo[]): NarrativaResult {
  const secciones: SeccionNarrativa[] = []
  for (const clave of ORDEN_SECCIONES) {
    const seccion = construirSeccion(clave, hallazgos)
    if (seccion) secciones.push(seccion)
  }
  return { secciones, resumen: construirResumen(hallazgos) }
}