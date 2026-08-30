/**
 * Razonador — deterministic rule engine.
 *
 * Takes the consultante's complete number map (date numbers + both name
 * profiles), compares them and emits findings in Spanish. Text content and
 * configuration live in reglas.json; this module only holds the rules.
 */

import reglas from './reglas.json'
import type { NumerologiaResult, PerfilCalculos } from '../types'

export type PerfilId = 'registro' | 'uso'
export type TipoHallazgo = 'refuerzo' | 'conflicto' | 'maestro' | 'reto' | 'coherencia'
export type SeveridadHallazgo = 'ALTA' | 'MEDIA' | 'BAJA'

export interface NumRef {
  rotulo: string
  valor: number
  dimension: string
  perfil?: PerfilId
}

export interface EntradaRazonador {
  refs: NumRef[]
}

export interface Hallazgo {
  tipo: TipoHallazgo
  severidad: SeveridadHallazgo
  numeroA: NumRef
  numeroB?: NumRef
  descripcion: string
}

interface TextoPlantilla {
  plantilla: string
  explicacion?: string
  explicacionUna?: string
  explicacionVarias?: string
}

interface ResumenConector {
  singular: string
  plural: string
  frase: string
}

interface ReglasConfig {
  severidades: Record<SeveridadHallazgo, { etiqueta: string }>
  conflictos: { pares: [number, number][] }
  maestros: number[]
  texts: {
    refuerzo: TextoPlantilla
    conflicto: TextoPlantilla
    maestro: TextoPlantilla
    reto: TextoPlantilla
    retoFuerte: TextoPlantilla
    coherencia: TextoPlantilla
  }
  narrativa: {
    secciones: Record<string, string>
    intros: Record<string, string>
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

const config = reglas as unknown as ReglasConfig

const MAESTROS = new Set(config.maestros)

const PARES_CONFLICTO = new Set(
  config.conflictos.pares.map(([a, b]) => parClave(a, b))
)

const ORDEN_SEVERIDAD: Record<SeveridadHallazgo, number> = { ALTA: 3, MEDIA: 2, BAJA: 1 }

// Name metrics compared across profiles for the 'coherencia' finding.
const COHERENCIA: [string, SeveridadHallazgo][] = [
  ['Expresión', 'MEDIA'],
  ['Deseo del Alma', 'MEDIA'],
  ['Personalidad', 'MEDIA'],
  ['Motivación', 'BAJA'],
  ['Intuición', 'BAJA'],
  ['Tendencia', 'BAJA'],
]

function parClave(a: number, b: number): string {
  const [menor, mayor] = a <= b ? [a, b] : [b, a]
  return `${menor}-${mayor}`
}

export function resolverPlantilla(
  plantilla: string,
  vars: Record<string, string | number>
): string {
  return Object.entries(vars).reduce(
    (texto, [clave, valor]) => texto.replaceAll(`{${clave}}`, String(valor)),
    plantilla
  )
}

function unirRotulos(rotulos: string[]): string {
  const unicos = [...new Set(rotulos)]
  if (unicos.length <= 1) return unicos[0] ?? ''
  if (unicos.length === 2) return `${unicos[0]} y ${unicos[1]}`
  return `${unicos.slice(0, -1).join(', ')} y ${unicos[unicos.length - 1]}`
}

/**
 * Flattens a full NumerologiaResult into a NumRef map: every date-based
 * number (unique, no profile) plus every name-based number of both profiles.
 * Values <= 0 (e.g. intuition with no second given name) are skipped.
 */
export function resultadoARefs(resultado: NumerologiaResult): NumRef[] {
  const refs: NumRef[] = []
  const agregar = (
    rotulo: string,
    valor: number,
    dimension: string,
    perfil?: PerfilId
  ) => {
    if (valor > 0) {
      refs.push({ rotulo, valor, dimension, perfil })
    }
  }

  // Date-based numbers: unique, shared by both profiles.
  agregar('Vida', resultado.vida, 'camino')
  agregar('Cumpleaños', resultado.cumpleanos, 'don')
  agregar('Ciclo 1', resultado.ciclos.primero, 'ciclo')
  agregar('Ciclo 2', resultado.ciclos.segundo, 'ciclo')
  agregar('Ciclo 3', resultado.ciclos.tercero, 'ciclo')
  agregar('Año Personal', resultado.personalYear, 'año')

  for (const [rotulo, valor] of [
    ['Reto 1', resultado.retos.subChallenge1],
    ['Reto 2', resultado.retos.subChallenge2],
    ['Reto 3', resultado.retos.challenge3],
    ['Reto Final', resultado.retos.mainChallenge],
  ] as const) {
    agregar(rotulo, valor, 'reto')
  }

  agregar('Energía del Día', resultado.energias.dayEnergy.reducedValue, 'energia')
  agregar('Energía del Mes', resultado.energias.monthEnergy.reducedValue, 'energia')
  agregar('Energía del Año', resultado.energias.yearEnergy.reducedValue, 'energia')

  agregar('Año Personal (Ciclos)', resultado.ciclosPersonales.personalYear.reducedValue, 'ciclo')
  resultado.ciclosPersonales.personalPeriods.forEach((periodo, i) => {
    agregar(`Período ${i + 1}`, periodo.value.reducedValue, 'ciclo')
  })

  for (let i = 1; i <= 7; i++) {
    const ciclo = resultado.fibonacci[`cycle${i}` as keyof typeof resultado.fibonacci]
    agregar('Ciclo Fibonacci ' + i, (ciclo as { reducedValue: number }).reducedValue, 'ciclo')
  }

  // Name-based numbers: one set per profile, with a clear rotulo suffix.
  const agregarPerfil = (perfil: PerfilCalculos, id: PerfilId) => {
    const sufijo = id === 'registro' ? 'Registro' : 'Uso diario'
    const nombre = (base: string) => `${base} (${sufijo})`
    agregar(nombre('Expresión'), perfil.expresion, 'nombre', id)
    agregar(nombre('Deseo del Alma'), perfil.deseoAlma, 'nombre', id)
    agregar(nombre('Personalidad'), perfil.personalidad, 'nombre', id)
    agregar(nombre('Motivación'), perfil.motivacion, 'nombre', id)
    agregar(nombre('Intuición'), perfil.intuicion, 'nombre', id)
    agregar(nombre('Tendencia'), perfil.tendencia, 'nombre', id)
    agregar(nombre('Gematría'), perfil.gematria.synthesis.finalValue, 'nombre', id)
  }
  agregarPerfil(resultado.registro, 'registro')
  agregarPerfil(resultado.uso, 'uso')

  return refs
}

function detectarRefuerzos(refs: NumRef[]): Hallazgo[] {
  const agrupados = new Map<number, NumRef[]>()
  for (const r of refs) {
    if (MAESTROS.has(r.valor)) continue
    const grupo = agrupados.get(r.valor) ?? []
    grupo.push(r)
    agrupados.set(r.valor, grupo)
  }

  const hallazgos: Hallazgo[] = []
  for (const [valor, apariciones] of agrupados) {
    const dimensiones = new Set(apariciones.map((a) => a.dimension))
    if (dimensiones.size < 2) continue
    const rotulos = unirRotulos(apariciones.map((a) => a.rotulo))
    hallazgos.push({
      tipo: 'refuerzo',
      severidad: dimensiones.size >= 3 ? 'ALTA' : 'MEDIA',
      numeroA: { ...apariciones[0], rotulo: rotulos },
      descripcion: resolverPlantilla(config.texts.refuerzo.plantilla, {
        valor,
        rotulos,
        explicacion: config.texts.refuerzo.explicacion ?? '',
      }),
    })
  }
  return hallazgos
}

function detectarConflictos(refs: NumRef[]): Hallazgo[] {
  const porPar = new Map<string, Hallazgo>()
  const involucra = (r: NumRef) => r.dimension === 'camino' || r.dimension === 'nombre'
  for (let i = 0; i < refs.length; i++) {
    for (let j = i + 1; j < refs.length; j++) {
      const a = refs[i]
      const b = refs[j]
      const clave = parClave(a.valor, b.valor)
      if (!PARES_CONFLICTO.has(clave)) continue
      const severidad: SeveridadHallazgo =
        involucra(a) || involucra(b) ? 'ALTA' : 'MEDIA'
      const previo = porPar.get(clave)
      if (!previo || ORDEN_SEVERIDAD[severidad] > ORDEN_SEVERIDAD[previo.severidad]) {
        porPar.set(clave, {
          tipo: 'conflicto',
          severidad,
          numeroA: a,
          numeroB: b,
          descripcion: resolverPlantilla(config.texts.conflicto.plantilla, {
            rotuloA: a.rotulo,
            valorA: a.valor,
            rotuloB: b.rotulo,
            valorB: b.valor,
            explicacion: config.texts.conflicto.explicacion ?? '',
          }),
        })
      }
    }
  }
  return [...porPar.values()]
}

function detectarMaestros(refs: NumRef[]): Hallazgo[] {
  const agrupados = new Map<number, NumRef[]>()
  for (const r of refs) {
    if (!MAESTROS.has(r.valor)) continue
    const grupo = agrupados.get(r.valor) ?? []
    grupo.push(r)
    agrupados.set(r.valor, grupo)
  }

  const hallazgos: Hallazgo[] = []
  for (const [valor, apariciones] of agrupados) {
    const dimensiones = new Set(apariciones.map((a) => a.dimension))
    const severidad: SeveridadHallazgo = dimensiones.size >= 2 ? 'ALTA' : 'MEDIA'
    const rotulos = unirRotulos(apariciones.map((a) => a.rotulo))
    hallazgos.push({
      tipo: 'maestro',
      severidad,
      numeroA: { ...apariciones[0], rotulo: rotulos },
      descripcion: resolverPlantilla(config.texts.maestro.plantilla, {
        valor,
        rotulos,
        explicacion:
          (severidad === 'ALTA'
            ? config.texts.maestro.explicacionVarias
            : config.texts.maestro.explicacionUna) ?? '',
      }),
    })
  }
  return hallazgos
}

function detectarRetos(refs: NumRef[]): Hallazgo[] {
  const refsNombreRegistro = refs.filter(
    (r) =>
      r.perfil === 'registro' &&
      (r.rotulo.startsWith('Personalidad') || r.rotulo.startsWith('Expresión'))
  )
  const hallazgos: Hallazgo[] = []
  for (const reto of refs) {
    if (reto.dimension !== 'reto') continue
    const coincidencia = refsNombreRegistro.find((r) => r.valor === reto.valor)
    if (coincidencia) {
      hallazgos.push({
        tipo: 'reto',
        severidad: 'ALTA',
        numeroA: reto,
        numeroB: coincidencia,
        descripcion: resolverPlantilla(config.texts.reto.plantilla, {
          rotuloA: reto.rotulo,
          valor: reto.valor,
          rotuloB: coincidencia.rotulo,
          explicacion: config.texts.reto.explicacion ?? '',
        }),
      })
    } else if (reto.valor >= 7) {
      hallazgos.push({
        tipo: 'reto',
        severidad: 'MEDIA',
        numeroA: reto,
        descripcion: resolverPlantilla(config.texts.retoFuerte.plantilla, {
          rotuloA: reto.rotulo,
          valor: reto.valor,
          explicacion: config.texts.retoFuerte.explicacion ?? '',
        }),
      })
    }
  }
  return hallazgos
}

function detectarCoherencia(refs: NumRef[]): Hallazgo[] {
  const hallazgos: Hallazgo[] = []
  for (const [base, severidad] of COHERENCIA) {
    const a = refs.find((r) => r.perfil === 'registro' && r.rotulo.startsWith(base))
    const b = refs.find((r) => r.perfil === 'uso' && r.rotulo.startsWith(base))
    if (!a || !b || a.valor === b.valor) continue
    hallazgos.push({
      tipo: 'coherencia',
      severidad,
      numeroA: a,
      numeroB: b,
      descripcion: resolverPlantilla(config.texts.coherencia.plantilla, {
        rotuloA: a.rotulo,
        valorA: a.valor,
        rotuloB: b.rotulo,
        valorB: b.valor,
        explicacion: config.texts.coherencia.explicacion ?? '',
      }),
    })
  }
  return hallazgos
}

/**
 * Runs all comparison rules over the consultante's numbers and returns the
 * findings sorted by severity (ALTA first, ties keep insertion order).
 */
export function razonar(input: EntradaRazonador): Hallazgo[] {
  const { refs } = input
  const hallazgos = [
    ...detectarRefuerzos(refs),
    ...detectarConflictos(refs),
    ...detectarMaestros(refs),
    ...detectarRetos(refs),
    ...detectarCoherencia(refs),
  ]
  return hallazgos.sort((a, b) => ORDEN_SEVERIDAD[b.severidad] - ORDEN_SEVERIDAD[a.severidad])
}