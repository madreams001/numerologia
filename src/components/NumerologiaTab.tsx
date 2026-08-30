import { Fragment, useMemo } from 'react'
import { isMasterNumber } from '../modules/numerologia/calculations'
import type { NumerologiaResult, PerfilCalculos } from '../modules/numerologia/types'
import { analizarConsulta } from '../modules/numerologia/razonador'
import {
  getLifePathInterpretation,
  getBirthdayInterpretation,
  getLifeCycleInterpretation,
  getPersonalYearInterpretation,
  getExpressionInterpretation,
  getSoulUrgeInterpretation,
  getPersonalityInterpretation,
  getMotivationInterpretation,
  getIntuitionInterpretation,
  getTendencyInterpretation,
  getChallengeInterpretation,
  getPersonalCycleInterpretation,
  getFibonacciCycleInterpretation,
  getDateEnergyInterpretation,
  getGematriaInterpretation,
} from '../modules/numerologia/interpretations'

interface InterpretacionProps {
  texto?: string
}

function InterpretacionTexto({ texto }: InterpretacionProps) {
  if (!texto) {
    return null
  }
  return <p className="interpretacion">{texto}</p>
}

interface NumeroConInterpretacionProps {
  etiqueta: string
  valor: string
  interpretacion?: string
}

function NumeroConInterpretacion({
  etiqueta,
  valor,
  interpretacion,
}: NumeroConInterpretacionProps) {
  return (
    <div className="numero-item">
      <div className="numero-item-contenido">
        <div className="numero-item-fila">
          <span className="etiqueta">{etiqueta}</span>
          <span className="valor">{valor}</span>
        </div>
        <InterpretacionTexto texto={interpretacion} />
      </div>
    </div>
  )
}

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

interface PerfilNumerosProps {
  titulo: string
  perfil: PerfilCalculos
}

function PerfilNumeros({ titulo, perfil }: PerfilNumerosProps) {
  return (
    <div className="perfil-numeros">
      <h4 className="perfil-titulo">{titulo}</h4>
      <p className="perfil-nombre">{perfil.nombreCompleto}</p>

      <NumeroConInterpretacion
        etiqueta="Expresión:"
        valor={formatearNumero(perfil.expresion)}
        interpretacion={getExpressionInterpretation(perfil.expresion)}
      />

      <NumeroConInterpretacion
        etiqueta="Deseo del Alma:"
        valor={formatearNumero(perfil.deseoAlma)}
        interpretacion={getSoulUrgeInterpretation(perfil.deseoAlma)}
      />

      <NumeroConInterpretacion
        etiqueta="Personalidad:"
        valor={formatearNumero(perfil.personalidad)}
        interpretacion={getPersonalityInterpretation(perfil.personalidad)}
      />

      <NumeroConInterpretacion
        etiqueta="Motivación:"
        valor={formatearNumero(perfil.motivacion)}
        interpretacion={getMotivationInterpretation(perfil.motivacion)}
      />

      {perfil.intuicion > 0 && (
        <NumeroConInterpretacion
          etiqueta="Intuición:"
          valor={formatearNumero(perfil.intuicion)}
          interpretacion={getIntuitionInterpretation(perfil.intuicion)}
        />
      )}

      <NumeroConInterpretacion
        etiqueta="Tendencia:"
        valor={formatearNumero(perfil.tendencia)}
        interpretacion={getTendencyInterpretation(perfil.tendencia)}
      />

      <div className="numero-item">
        <div className="numero-item-contenido">
          <div className="numero-item-fila">
            <span className="etiqueta">Gematría:</span>
            <span className="valor">
              {perfil.gematria.synthesis.finalValue}
            </span>
          </div>
          <InterpretacionTexto
            texto={getGematriaInterpretation(perfil.gematria.synthesis.finalValue)}
          />
        </div>
      </div>
    </div>
  )
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

  const analisis = useMemo(() => analizarConsulta(resultado), [resultado])

  return (
    <div className="resultado-numerologia">
      <h3>Tus Números</h3>

      <NumeroConInterpretacion
        etiqueta="Número de Vida:"
        valor={formatearNumero(resultado.vida)}
        interpretacion={getLifePathInterpretation(resultado.vida)}
      />

      <NumeroConInterpretacion
        etiqueta="Número de Cumpleaños:"
        valor={formatearNumero(resultado.cumpleanos)}
        interpretacion={getBirthdayInterpretation(resultado.cumpleanos)}
      />

      <div className="numero-item">
        <div className="numero-item-contenido">
          <div className="numero-item-fila">
            <span className="etiqueta">Ciclos de Vida:</span>
            <span className="valor">
              {resultado.ciclos.primero} / {resultado.ciclos.segundo} / {resultado.ciclos.tercero}
            </span>
          </div>
          <InterpretacionTexto
            texto={getLifeCycleInterpretation(resultado.ciclos.primero)}
          />
        </div>
      </div>

      <NumeroConInterpretacion
        etiqueta={`Año Personal (${new Date().getFullYear()}):`}
        valor={formatearNumero(resultado.personalYear)}
        interpretacion={getPersonalYearInterpretation(resultado.personalYear)}
      />

      <section className="seccion-numerologia">
        <h4>Comparación por Nombre</h4>
        <div className="grid-perfiles">
          <PerfilNumeros titulo="Registro Civil" perfil={resultado.registro} />
          <PerfilNumeros titulo="Uso diario" perfil={resultado.uso} />
        </div>
      </section>

      <section className="seccion-numerologia">
        <h4>Números de Reto</h4>
        <NumeroConInterpretacion
          etiqueta="Reto 1 (Mes − Día):"
          valor={String(resultado.retos.subChallenge1)}
          interpretacion={getChallengeInterpretation(resultado.retos.subChallenge1)}
        />
        <NumeroConInterpretacion
          etiqueta="Reto 2 (Día − Año):"
          valor={String(resultado.retos.subChallenge2)}
          interpretacion={getChallengeInterpretation(resultado.retos.subChallenge2)}
        />
        <NumeroConInterpretacion
          etiqueta="Reto 3 (Mes − Año):"
          valor={String(resultado.retos.challenge3)}
          interpretacion={getChallengeInterpretation(resultado.retos.challenge3)}
        />
        <NumeroConInterpretacion
          etiqueta="Reto Final:"
          valor={String(resultado.retos.mainChallenge)}
          interpretacion={getChallengeInterpretation(resultado.retos.mainChallenge)}
        />
      </section>

      <section className="seccion-numerologia">
        <h4>Ciclos Personales</h4>
        <NumeroConInterpretacion
          etiqueta="Año Personal:"
          valor={pasosReduccion(ciclosPersonales.personalYear)}
          interpretacion={getPersonalCycleInterpretation(
            ciclosPersonales.personalYear.reducedValue
          )}
        />
        <div className="grid-seccion">
          {ciclosPersonales.personalPeriods.map((periodo, index) => {
            const activo = index === ciclosPersonales.currentPersonalPeriod - 1
            return (
              <div key={index} className={activo ? 'tarjeta-ciclo ciclo-activo' : 'tarjeta-ciclo'}>
                <span className="ciclo-titulo">Período {index + 1}</span>
                <span className="ciclo-valor">{periodo.value.reducedValue}</span>
                <span className="ciclo-interpretacion">
                  {getPersonalCycleInterpretation(periodo.value.reducedValue)}
                </span>
                {activo ? <span className="ciclo-estado">Activo</span> : null}
              </div>
            )
          })}
        </div>
        <NumeroConInterpretacion
          etiqueta="Mes Personal Actual:"
          valor={(() => {
            const mes = ciclosPersonales.personalMonths.find(
              (m) => m.month === ciclosPersonales.currentPersonalMonth
            )
            return mes ? pasosReduccion(mes.value) : String(ciclosPersonales.currentPersonalMonth)
          })()}
          interpretacion={(() => {
            const mes = ciclosPersonales.personalMonths.find(
              (m) => m.month === ciclosPersonales.currentPersonalMonth
            )
            return mes
              ? getPersonalCycleInterpretation(mes.value.reducedValue)
              : undefined
          })()}
        />
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
                <span className="ciclo-interpretacion">
                  {getFibonacciCycleInterpretation(ciclo.reducedValue)}
                </span>
                {activo ? <span className="ciclo-estado">Activo</span> : null}
              </div>
            )
          })}
        </div>
      </section>

      <section className="seccion-numerologia">
        <h4>Energías de la Fecha</h4>
        <NumeroConInterpretacion
          etiqueta="Día:"
          valor={pasosReduccion(resultado.energias.dayEnergy)}
          interpretacion={getDateEnergyInterpretation(
            resultado.energias.dayEnergy.reducedValue
          )}
        />
        <NumeroConInterpretacion
          etiqueta="Mes:"
          valor={pasosReduccion(resultado.energias.monthEnergy)}
          interpretacion={getDateEnergyInterpretation(
            resultado.energias.monthEnergy.reducedValue
          )}
        />
        <NumeroConInterpretacion
          etiqueta="Año:"
          valor={pasosReduccion(resultado.energias.yearEnergy)}
          interpretacion={getDateEnergyInterpretation(
            resultado.energias.yearEnergy.reducedValue
          )}
        />
      </section>

      <section className="seccion-numerologia">
        <h4>Análisis del consultante</h4>
        <p className="analisis-resumen">
          {analisis.resumen.split(/\n\s*\n/).map((parrafo, index) => (
            <Fragment key={index}>
              {index > 0 && <br />}
              {parrafo}
            </Fragment>
          ))}
        </p>
        {analisis.secciones.map((seccion) => (
          <div key={seccion.titulo} className="analisis-bloque">
            <h5 className="analisis-titulo">{seccion.titulo}</h5>
            {seccion.parrafos.map((parrafo, index) => (
              <p key={index} className="analisis-parrafo">
                {parrafo}
              </p>
            ))}
          </div>
        ))}
      </section>
    </div>
  )
}
