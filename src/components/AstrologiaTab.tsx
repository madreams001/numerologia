import { useState } from 'react'
import { calculateNatalChart } from '../modules/astrologia/calculations'
import type { NatalChartResult } from '../modules/astrologia/calculations'

interface AstrologiaTabProps {
  fechaNacimiento: string
  horaNacimiento: string
  lugarNacimiento: string
}

// Coordenadas de ciudades principales (fallback). timeZoneOffset está en
// minutos respecto de UTC usando la convención del módulo de astrología:
// negativo = oeste de UTC (p.ej. -180 = UTC-3). Argentina usa UTC-3 fijo todo
// el año desde 2018 (Ley 27.233 eliminó el horario de verano), así que -180 es
// correcto para Córdoba y Buenos Aires (default). Las demás ciudades cargan su
// propio offset sin horario de verano (simplificación razonable para la app).
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

export function AstrologiaTab({ fechaNacimiento, horaNacimiento, lugarNacimiento }: AstrologiaTabProps) {
  const [chart, setChart] = useState<NatalChartResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calcularMapa = async () => {
    if (!fechaNacimiento) {
      setError('Se necesita fecha de nacimiento para el mapa astral.')
      return
    }

    const coords = lugarNacimiento ? resolverCoordenadas(lugarNacimiento) : null
    if (lugarNacimiento && !coords) {
      setError(`No se encontraron coordenadas para "${lugarNacimiento}". Prueba con una ciudad principal (Buenos Aires, Córdoba, Madrid, etc.)`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Parse the date at local noon (same as App.tsx). "1969-02-07" parsed
      // as `new Date("1969-02-07")` becomes UTC midnight, which rolls back to
      // the 6th in UTC-3 zones and shifts the whole chart one day early.
      const [y, m, d] = fechaNacimiento.split('-').map(Number)
      const fecha = new Date(y, m - 1, d, 12)
      const [hora, minuto] = horaNacimiento ? horaNacimiento.split(':').map(Number) : [12, 0]

      const result = await calculateNatalChart({
        year: fecha.getFullYear(),
        month: fecha.getMonth() + 1,
        day: fecha.getDate(),
        hour: hora,
        minute: minuto,
        latitude: coords?.lat ?? -34.6037,
        longitude: coords?.lon ?? -58.3816,
        // Default UTC-3 (Argentina, fixed year-round since 2018); cities
        // above carry their own offset (see timeZoneOffset docs).
        timeZoneOffset: coords?.tz ?? -180
      })

      setChart(result)
    } catch (err) {
      setError(`Error al calcular: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="resultado-astrologia">
      <h3>Mapa Astral</h3>
      
      {!chart && !loading && (
        <div className="astrologia-placeholder">
          <p>Calcula tu carta natal con los datos que ingresaste.</p>
          <button onClick={calcularMapa} className="boton-calcular" disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular Mapa Astral'}
          </button>
          {!lugarNacimiento && (
            <p className="nota">Si no ingresas lugar, se usa Buenos Aires por defecto.</p>
          )}
        </div>
      )}

      {loading && (
        <div className="loading">
          <p>Calculando carta natal...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {chart && (
        <div className="chart-results">
          <div className="chart-section">
            <h4>Ascendente y Medio Cielo</h4>
            <div className="numero-item">
              <span className="etiqueta">Ascendente:</span>
              <span className="valor">{chart.ascendant.sign} {chart.ascendant.decimalDegrees.toFixed(1)}°</span>
            </div>
            <div className="numero-item">
              <span className="etiqueta">Medio Cielo:</span>
              <span className="valor">{chart.mc.sign} {chart.mc.decimalDegrees.toFixed(1)}°</span>
            </div>
          </div>

          <div className="chart-section">
            <h4>Planetas en Signos</h4>
            {chart.planets.map((planet) => (
              <div key={planet.name} className="numero-item">
                <span className="etiqueta">{planet.name}:</span>
                <span className="valor">
                  {planet.sign} {planet.degree}
                  {planet.retrograde ? ' ℞' : ''}
                  {planet.house ? ` (Casa ${planet.house})` : ''}
                </span>
              </div>
            ))}
          </div>

          {chart.aspects.length > 0 && (
            <div className="chart-section">
              <h4>Aspectos Principales</h4>
              {chart.aspects.slice(0, 10).map((aspect, i) => (
                <div key={i} className="numero-item">
                  <span className="etiqueta">{aspect.aspect}:</span>
                  <span className="valor">
                    {aspect.planetA} — {aspect.planetB} (orbe {aspect.orb.toFixed(1)}°)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
