import { isMasterNumber } from '../modules/numerologia/calculations'
import type { NumerologiaResult } from '../modules/numerologia/types'

interface NumerologiaTabProps {
  resultado: NumerologiaResult
}

function formatearNumero(num: number): string {
  if (isMasterNumber(num)) {
    return `${num} (Maestro)`
  }
  return num.toString()
}

function pasosReduccion(value: { reducedValue: number; reductionSteps: number[] }): string {
  const steps = value.reductionSteps
  if (steps.length > 1) {
    return `${steps.join(' → ')} = ${value.reducedValue}`
  }
  return value.reducedValue.toString()
}

function pasosGematria(info: { originalSum: number; reductionSteps: number[]; finalValue: number }): string {
  if (info.reductionSteps.length > 0) {
    return `${info.originalSum} → ${info.reductionSteps.join(' → ')}`
  }
  return info.originalSum.toString()
}

const LIMITES_FIBONACCI = [0, 1, 2, 3, 5, 8, 13, 21]

function rangoEdad(index: number): { desde: number; hasta: number; hastaTexto: string } {
  const desde = LIMITES_FIBONACCI[index]
  if (index === 6) {
    return { desde, hasta: Number.POSITIVE_INFINITY, hastaTexto: '21+' }
  }
  const hastaExclusivo = LIMITES_FIBONACCI[index + 1]
  return { desde, hasta: hastaExclusivo - 1, hastaTexto: String(hastaExclusivo - 1) }
}

export function NumerologiaTab({ resultado }: NumerologiaTabProps) {
  const { ciclosPersonales, fibonacci } = resultado

  const edadCicloActual =
    ciclosPersonales.currentAge !== undefined ? ciclosPersonales.currentAge : fibonacci.currentAge

  return (
    <div className="resultado-numerologia">
      <h3>Tus Números</h3>

      <div className="numero-item">
        <span className="etiqueta">Número de Vida:</span>
        <span className="valor">{formatearNumero(resultado.vida)}</span>
      </div>

      <div className="numero-item">
        <span className="etiqueta">Número de Cumpleaños:</span>
        <span className="valor">{formatearNumero(resultado.cumpleanos)}</span>
      </div>

      <div className="numero-item">
        <span className="etiqueta">Ciclos de Vida:</span>
        <span className="valor">
          {resultado.ciclos.primero} / {resultado.ciclos.segundo} / {resultado.ciclos.tercero}
        </span>
      </div>

      <div className="numero-item">
        <span className="etiqueta">Año Personal ({new Date().getFullYear()}):</span>
        <span className="valor">{formatearNumero(resultado.personalYear)}</span>
      </div>

      <div className="numero-item">
        <span className="etiqueta">Número de Expresión:</span>
        <span className="valor">{formatearNumero(resultado.expresion)}</span>
      </div>

      <div className="numero-item">
        <span className="etiqueta">Deseo del Alma:</span>
        <span className="valor">{formatearNumero(resultado.deseoAlma)}</span>
      </div>

      <div className="numero-item">
        <span className="etiqueta">Personalidad:</span>
        <span className="valor">{formatearNumero(resultado.personalidad)}</span>
      </div>

      <div className="numero-item">
        <span className="etiqueta">Motivación:</span>
        <span className="valor">{formatearNumero(resultado.motivacion)}</span>
      </div>

      <div className="numero-item">
        <span className="etiqueta">Intuición:</span>
        <span className="valor">{formatearNumero(resultado.intuicion)}</span>
      </div>

      <div className="numero-item">
        <span className="etiqueta">Tendencia:</span>
        <span className="valor">{formatearNumero(resultado.tendencia)}</span>
      </div>

      <section className="seccion-numerologia">
        <h4>Números de Reto</h4>
        <div className="numero-item">
          <span className="etiqueta">Reto Principal:</span>
          <span className="valor">{resultado.retos.mainChallenge}</span>
        </div>
        <div className="numero-item">
          <span className="etiqueta">Reto Secundario 1:</span>
          <span className="valor">{resultado.retos.subChallenge1}</span>
        </div>
        <div className="numero-item">
          <span className="etiqueta">Reto Secundario 2:</span>
          <span className="valor">{resultado.retos.subChallenge2}</span>
        </div>
      </section>

      <section className="seccion-numerologia">
        <h4>Ciclos Personales</h4>
        <div className="numero-item">
          <span className="etiqueta">Año Personal:</span>
          <span className="valor">{pasosReduccion(ciclosPersonales.personalYear)}</span>
        </div>
        <div className="grid-seccion">
          {ciclosPersonales.personalPeriods.map((periodo, index) => {
            const activo = index === ciclosPersonales.currentPersonalPeriod - 1
            return (
              <div key={index} className={activo ? 'tarjeta-ciclo ciclo-activo' : 'tarjeta-ciclo'}>
                <span className="ciclo-titulo">Período {index + 1}</span>
                <span className="ciclo-valor">{periodo.value.reducedValue}</span>
                {activo ? <span className="ciclo-estado">Activo</span> : null}
              </div>
            )
          })}
        </div>
        <div className="numero-item">
          <span className="etiqueta">Mes Personal Actual:</span>
          <span className="valor">
            {(() => {
              const mes = ciclosPersonales.personalMonths.find(
                (m) => m.month === ciclosPersonales.currentPersonalMonth
              )
              return mes ? pasosReduccion(mes.value) : ciclosPersonales.currentPersonalMonth
            })()}
          </span>
        </div>
      </section>

      <section className="seccion-numerologia">
        <h4>Ciclo de Fibonacci</h4>
        <div className="grid-seccion">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => {
            const ciclo = fibonacci[`cycle${n}` as keyof typeof fibonacci] as {
              reducedValue: number
              reductionSteps: number[]
            }
            const rango = rangoEdad(n - 1)
            const activo = edadCicloActual >= rango.desde && edadCicloActual <= rango.hasta
            return (
              <div key={n} className={activo ? 'tarjeta-ciclo ciclo-activo' : 'tarjeta-ciclo'}>
                <span className="ciclo-titulo">
                  Ciclo {n} · {rango.desde}–{rango.hastaTexto} años
                </span>
                <span className="ciclo-valor">{ciclo.reducedValue}</span>
                {activo ? <span className="ciclo-estado">Activo</span> : null}
              </div>
            )
          })}
        </div>
      </section>

      <section className="seccion-numerologia">
        <h4>Energías de la Fecha</h4>
        <div className="numero-item">
          <span className="etiqueta">Día:</span>
          <span className="valor">{pasosReduccion(resultado.energias.dayEnergy)}</span>
        </div>
        <div className="numero-item">
          <span className="etiqueta">Mes:</span>
          <span className="valor">{pasosReduccion(resultado.energias.monthEnergy)}</span>
        </div>
        <div className="numero-item">
          <span className="etiqueta">Año:</span>
          <span className="valor">{pasosReduccion(resultado.energias.yearEnergy)}</span>
        </div>
      </section>

      <section className="seccion-numerologia">
        <h4>Gematría</h4>
        <div className="numero-item">
          <span className="etiqueta">Vocales:</span>
          <span className="valor">{pasosGematria(resultado.gematria.vowels)}</span>
        </div>
        <div className="numero-item">
          <span className="etiqueta">Consonantes:</span>
          <span className="valor">{pasosGematria(resultado.gematria.consonants)}</span>
        </div>
        <div className="numero-item">
          <span className="etiqueta">Síntesis:</span>
          <span className="valor">{pasosGematria(resultado.gematria.synthesis)}</span>
        </div>
      </section>
    </div>
  )
}
