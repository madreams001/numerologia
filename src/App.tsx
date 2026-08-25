import { useState } from 'react'
import { calculateLifePath, calculateBirthday, calculateLifeCycles, calculatePersonalYear, calculateExpression, calculateSoulUrge, calculatePersonality, calculateMotivation, calculateIntuition, calculateTendency, isMasterNumber } from './modules/numerologia/calculations'
import './App.css'

interface FormData {
  nombre: string
  fechaNacimiento: string
  horaNacimiento: string
  lugarNacimiento: string
}

interface NumerologiaResult {
  vida: number
  cumpleanos: number
  ciclos: {
    primero: number
    segundo: number
    tercero: number
  }
  personalYear: number
  expresion: number
  deseoAlma: number
  personalidad: number
  motivacion: number
  intuicion: number
  tendencia: number
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    fechaNacimiento: '',
    horaNacimiento: '',
    lugarNacimiento: ''
  })
  const [resultado, setResultado] = useState<NumerologiaResult | null>(null)
  const [activeTab, setActiveTab] = useState<'numerologia' | 'astrologia' | 'sinastria'>('numerologia')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calcularNumerologia = () => {
    if (!formData.nombre || !formData.fechaNacimiento) {
      alert('Por favor, ingresa tu nombre y fecha de nacimiento.')
      return
    }

    const fecha = new Date(formData.fechaNacimiento)
    const anioActual = new Date().getFullYear()

    const ciclos = calculateLifeCycles(fecha)
    const result: NumerologiaResult = {
      vida: calculateLifePath(fecha),
      cumpleanos: calculateBirthday(fecha),
      ciclos: { primero: ciclos.first, segundo: ciclos.second, tercero: ciclos.third },
      personalYear: calculatePersonalYear(fecha, anioActual),
      expresion: calculateExpression(formData.nombre),
      deseoAlma: calculateSoulUrge(formData.nombre),
      personalidad: calculatePersonality(formData.nombre),
      motivacion: calculateMotivation(formData.nombre),
      intuicion: calculateIntuition(formData.nombre),
      tendencia: calculateTendency(formData.nombre)
    }

    setResultado(result)
  }

  const formatearNumero = (num: number): string => {
    if (isMasterNumber(num)) {
      return `${num} (Maestro)`
    }
    return num.toString()
  }

  return (
    <div className="app">
      <header className="header">
        <h1>✨ Numerología y Astrología</h1>
        <p>Descubre los secretos de tus números</p>
      </header>

      <main className="main">
        <section className="formulario">
          <h2>Ingresa tus datos</h2>
          
          <div className="campo">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: María García López"
            />
          </div>

          <div className="campo">
            <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="horaNacimiento">Hora de Nacimiento (opcional)</label>
            <input
              type="time"
              id="horaNacimiento"
              name="horaNacimiento"
              value={formData.horaNacimiento}
              onChange={handleInputChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="lugarNacimiento">Lugar de Nacimiento</label>
            <input
              type="text"
              id="lugarNacimiento"
              name="lugarNacimiento"
              value={formData.lugarNacimiento}
              onChange={handleInputChange}
              placeholder="Ej: Buenos Aires, Argentina"
            />
          </div>

          <button onClick={calcularNumerologia} className="boton-calcular">
            Calcular Numerología
          </button>
        </section>

        {resultado && (
          <section className="resultados">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'numerologia' ? 'active' : ''}`}
                onClick={() => setActiveTab('numerologia')}
              >
                Numerología
              </button>
              <button 
                className={`tab ${activeTab === 'astrologia' ? 'active' : ''}`}
                onClick={() => setActiveTab('astrologia')}
              >
                Astrología
              </button>
              <button 
                className={`tab ${activeTab === 'sinastria' ? 'active' : ''}`}
                onClick={() => setActiveTab('sinastria')}
              >
                Sinastria
              </button>
            </div>

            {activeTab === 'numerologia' && (
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
              </div>
            )}

            {activeTab === 'astrologia' && (
              <div className="resultado-astrologia">
                <h3>Mapa Astral</h3>
                <p>Próximamente: cálculos astrológicos completos</p>
              </div>
            )}

            {activeTab === 'sinastria' && (
              <div className="resultado-sinastria">
                <h3>Sinastria</h3>
                <p>Próximamente: análisis de compatibilidad</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App
