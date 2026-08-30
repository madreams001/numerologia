import { useState } from 'react'
import type { AspectName } from 'kaabalah/astrology'
import type { ChartInput } from '../modules/astrologia/calculations'
import { calcularSinastria } from '../modules/sinastria/calculations'
import type { SinastriaResult, TonoCruce } from '../modules/sinastria/calculations'

// Coordenadas de ciudades principales (fallback). Misma convención que
// AstrologiaTab: timeZoneOffset en minutos UTC, negativo = oeste (Argentina
// usa UTC-3 fijo desde 2018, así que -180 es correcto para Córdoba y BsAs).
const CIUDADES: Record<string, { lat: number; lon: number; tz: number }> = {
  'buenos aires': { lat: -34.6037, lon: -58.3816, tz: -180 },
  'cordoba': { lat: -31.4201, lon: -64.1888, tz: -180 },
  'rosario': { lat: -32.9468, lon: -60.6506, tz: -180 },
  'mendoza': { lat: -32.8895, lon: -68.8458, tz: -180 },
  'santiago': { lat: -33.4489, lon: -70.6693, tz: -240 },
  'lima': { lat: -12.0464, lon: -77.0428, tz: -300 },
  'mexico': { lat: 19.4326, lon: -99.1332, tz: -360 },
  'madrid': { lat: 40.4168, lon: -3.7038, tz: 60 },
  'barcelona': { lat: 41.3874, lon: 2.1686, tz: 60 },
  'medellin': { lat: 6.2476, lon: -75.5658, tz: -300 },
  'bogota': { lat: 4.711, lon: -74.0721, tz: -300 },
  'quito': { lat: -0.1807, lon: -78.4678, tz: -300 },
  'caracas': { lat: 10.4806, lon: -66.9036, tz: -240 },
  'montevideo': { lat: -34.9011, lon: -56.1645, tz: -180 },
}

function resolverCoordenadas(lugar: string): { lat: number; lon: number; tz: number } | null {
  const lower = lugar.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const [ciudad, coords] of Object.entries(CIUDADES)) {
    if (lower.includes(ciudad)) return coords
  }
  return null
}

const ASPECTOS_ES: Record<AspectName, string> = {
  conjunction: 'Conjunción',
  duodecile: 'Duodécil',
  octile: 'Octil',
  sextile: 'Sextil',
  square: 'Cuadrado',
  trine: 'Trígono',
  trioctile: 'Trioctil',
  quincunx: 'Quincunce',
  opposition: 'Oposición',
}

const TONO_LABEL: Record<TonoCruce, string> = {
  armonia: 'Armonía',
  desafio: 'Desafío',
  neutro: 'Neutro',
}

interface DatosPersona {
  nombre: string
  fecha: string
  hora: string
  lugar: string
}

const PERSONA_VACIA: DatosPersona = { nombre: '', fecha: '', hora: '', lugar: '' }

export function SinastriaTab() {
  const [personaA, setPersonaA] = useState<DatosPersona>(PERSONA_VACIA)
  const [personaB, setPersonaB] = useState<DatosPersona>(PERSONA_VACIA)
  const [resultado, setResultado] = useState<SinastriaResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cambiarPersona = (
    setter: React.Dispatch<React.SetStateAction<DatosPersona>>,
    campo: keyof DatosPersona,
    valor: string,
  ) => {
    setter((prev) => ({ ...prev, [campo]: valor }))
    // Si se editan datos tras un cálculo, descartar el resultado viejo.
    setResultado(null)
  }

  const aChartInput = (persona: DatosPersona): ChartInput | null => {
    if (!persona.fecha || !persona.nombre) return null
    const coords = persona.lugar ? resolverCoordenadas(persona.lugar) : null
    if (persona.lugar && !coords) return null
    const [y, m, d] = persona.fecha.split('-').map(Number)
    const [hora, minuto] = persona.hora ? persona.hora.split(':').map(Number) : [12, 0]
    return {
      year: y,
      month: m,
      day: d,
      hour: hora,
      minute: minuto,
      latitude: coords?.lat ?? -34.6037,
      longitude: coords?.lon ?? -58.3816,
      timeZoneOffset: coords?.tz ?? -180,
    }
  }

  const calcular = async () => {
    if (!personaA.nombre.trim() || !personaA.fecha) {
      setError('Completá al menos el nombre y la fecha de la Persona A.')
      return
    }
    if (!personaB.nombre.trim() || !personaB.fecha) {
      setError('Completá al menos el nombre y la fecha de la Persona B.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [ya, ma, da] = personaA.fecha.split('-').map(Number)
      const [yb, mb, db] = personaB.fecha.split('-').map(Number)
      const fechaA = new Date(ya, ma - 1, da, 12)
      const fechaB = new Date(yb, mb - 1, db, 12)

      const chartA = aChartInput(personaA)
      const chartB = aChartInput(personaB)

      const res = await calcularSinastria(
        { nombre: personaA.nombre.trim(), fecha: fechaA, nombreCompleto: personaA.nombre.trim() },
        { nombre: personaB.nombre.trim(), fecha: fechaB, nombreCompleto: personaB.nombre.trim() },
        // Solo pasar los charts si ambos tienen coordenadas resueltas.
        chartA && chartB ? chartA : undefined,
        chartA && chartB ? chartB : undefined,
      )

      setResultado(res)
    } catch (err) {
      setError(`Error al calcular: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="resultado-sinastria">
      <h3>Sinastria</h3>
      <p className="descripcion-sinastria">
        Analiza la compatibilidad entre dos personas cruzando sus números y sus cartas astrales.
      </p>

      {!resultado && !loading && (
        <div className="sinastria-placeholder">
          <div className="sinastria-form">
            {(['A', 'B'] as const).map((letra) => {
              const persona = letra === 'A' ? personaA : personaB
              const setter = letra === 'A' ? setPersonaA : setPersonaB
              const titulo = letra === 'A' ? 'Persona A' : 'Persona B'
              return (
                <fieldset className="seccion-formulario" key={letra}>
                  <legend>{titulo}</legend>
                  <div className="campo">
                    <label htmlFor={`sin-nombre-${letra}`}>Nombre</label>
                    <input
                      id={`sin-nombre-${letra}`}
                      type="text"
                      placeholder="Nombre y apellido"
                      value={persona.nombre}
                      onChange={(e) => cambiarPersona(setter, 'nombre', e.target.value)}
                    />
                  </div>
                  <div className="campo">
                    <label htmlFor={`sin-fecha-${letra}`}>Fecha de nacimiento</label>
                    <input
                      id={`sin-fecha-${letra}`}
                      type="date"
                      value={persona.fecha}
                      onChange={(e) => cambiarPersona(setter, 'fecha', e.target.value)}
                    />
                  </div>
                  <div className="campo">
                    <label htmlFor={`sin-hora-${letra}`}>Hora (opcional)</label>
                    <input
                      id={`sin-hora-${letra}`}
                      type="time"
                      value={persona.hora}
                      onChange={(e) => cambiarPersona(setter, 'hora', e.target.value)}
                    />
                  </div>
                  <div className="campo">
                    <label htmlFor={`sin-lugar-${letra}`}>Lugar (opcional)</label>
                    <input
                      id={`sin-lugar-${letra}`}
                      type="text"
                      placeholder="Ciudad (Buenos Aires, Córdoba, ...)"
                      value={persona.lugar}
                      onChange={(e) => cambiarPersona(setter, 'lugar', e.target.value)}
                    />
                  </div>
                </fieldset>
              )
            })}
          </div>

          <button onClick={calcular} className="boton-calcular" disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular Compatibilidad'}
          </button>
          <p className="nota">
            Si no ingresás lugar, se usa Buenos Aires por defecto y se omite el cruce astrológico.
          </p>
        </div>
      )}

      {loading && (
        <div className="loading">
          <p>Calculando sinastría...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {resultado && (
        <div className="sinastria-results">
          <div className="analisis-resumen">
            Compatibilidad entre <strong>{resultado.personaA.nombre}</strong> y{' '}
            <strong>{resultado.personaB.nombre}</strong>
          </div>

          <div className="chart-section">
            <h4>Cruzamiento Numerológico</h4>
            {resultado.crucesNumerologicos.map((cruce) => (
              <div key={cruce.clave} className={`numero-item tono-${cruce.tono}`}>
                <span className="etiqueta">
                  {cruce.nombreA} ({cruce.valorA}) vs {cruce.nombreB} ({cruce.valorB})
                </span>
                <span className="valor">{TONO_LABEL[cruce.tono]}</span>
              </div>
            ))}
          </div>

          {resultado.crucesAstrologicos && resultado.crucesAstrologicos.length > 0 && (
            <div className="chart-section">
              <h4>Cruzamiento Astrológico</h4>
              {resultado.crucesAstrologicos.slice(0, 20).map((cruce, i) => (
                <div key={i} className={`numero-item tono-${cruce.tono}`}>
                  <span className="etiqueta">
                    {cruce.planetaA} — {cruce.planetaB} ({ASPECTOS_ES[cruce.aspecto] ?? cruce.aspecto},{' '}
                    orbe {cruce.orb.toFixed(1)}°)
                  </span>
                  <span className="valor">{TONO_LABEL[cruce.tono]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
