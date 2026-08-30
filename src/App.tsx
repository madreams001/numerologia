import { useState } from 'react'
import { calculateLifePath, calculateBirthday, calculateLifeCycles, calculatePersonalYear, calculateExpression, calculateSoulUrge, calculatePersonality, calculateMotivation, calculateIntuition, calculateTendency, calculateChallenges, getDateEnergies, calculatePersonalCycles, calculateFibonacciCycle, calculateGematria } from './modules/numerologia/calculations'
import type { NumerologiaResult } from './modules/numerologia/types'
import { InputForm } from './components/InputForm'
import type { FormData } from './components/InputForm'
import { ResultsTabs } from './components/ResultsTabs'
import type { TabId } from './components/ResultsTabs'
import { NumerologiaTab } from './components/NumerologiaTab'
import { AstrologiaTab } from './components/AstrologiaTab'
import { SinastriaTab } from './components/SinastriaTab'
import './App.css'

function App() {
  const [formData, setFormData] = useState<FormData>({
    nombresRegistro: '',
    apellidosRegistro: '',
    nombresUso: '',
    apellidosUso: '',
    fechaNacimiento: '',
    horaNacimiento: '',
    lugarNacimiento: ''
  })
  const [resultado, setResultado] = useState<NumerologiaResult | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('numerologia')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calcularNumerologia = () => {
    if (
      !formData.nombresRegistro ||
      !formData.apellidosRegistro ||
      !formData.nombresUso ||
      !formData.apellidosUso ||
      !formData.fechaNacimiento
    ) {
      alert(
        'Por favor, ingresa los nombres y apellidos de ambos perfiles (Registro Civil y Uso diario) y la fecha de nacimiento.'
      )
      return
    }

    // Parse fecha in local time at noon to avoid UTC midnight shifting the day
    // (e.g. "1969-02-07" parsed as UTC rolls back to day 6 in UTC-3 zones)
    const [y, m, d] = formData.fechaNacimiento.split('-').map(Number)
    const fecha = new Date(y, m - 1, d, 12)
    const anioActual = new Date().getFullYear()
    const hoy = new Date()

    // Cálculos basados en FECHA: únicos (no dependen del perfil de nombre).
    const ciclos = calculateLifeCycles(fecha)

    // Cálculos basados en NOMBRE: se calculan por separado para cada perfil.
    const nombreCompletoRegistro = [formData.nombresRegistro, formData.apellidosRegistro]
      .filter(Boolean)
      .join(' ')
    const nombreCompletoUso = [formData.nombresUso, formData.apellidosUso]
      .filter(Boolean)
      .join(' ')

    const result: NumerologiaResult = {
      vida: calculateLifePath(fecha),
      cumpleanos: calculateBirthday(fecha),
      ciclos: { primero: ciclos.first, segundo: ciclos.second, tercero: ciclos.third },
      personalYear: calculatePersonalYear(fecha, anioActual),
      retos: calculateChallenges(fecha),
      energias: getDateEnergies(fecha),
      // Primer nombre del perfil de Registro Civil, como referencia del nombre
      // de pila para los ciclos personales (cálculo basado en fecha/nombre).
      ciclosPersonales: calculatePersonalCycles(fecha, formData.nombresRegistro),
      fibonacci: calculateFibonacciCycle(fecha, hoy),
      registro: {
        nombreCompleto: nombreCompletoRegistro,
        expresion: calculateExpression(nombreCompletoRegistro),
        deseoAlma: calculateSoulUrge(nombreCompletoRegistro),
        personalidad: calculatePersonality(nombreCompletoRegistro),
        motivacion: calculateMotivation(formData.nombresRegistro),
        intuicion: calculateIntuition(formData.nombresRegistro),
        tendencia: calculateTendency(formData.apellidosRegistro),
        gematria: calculateGematria(nombreCompletoRegistro)
      },
      uso: {
        nombreCompleto: nombreCompletoUso,
        expresion: calculateExpression(nombreCompletoUso),
        deseoAlma: calculateSoulUrge(nombreCompletoUso),
        personalidad: calculatePersonality(nombreCompletoUso),
        motivacion: calculateMotivation(formData.nombresUso),
        intuicion: calculateIntuition(formData.nombresUso),
        tendencia: calculateTendency(formData.apellidosUso),
        gematria: calculateGematria(nombreCompletoUso)
      }
    }

    setResultado(result)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Numerología y Astrología</h1>
        <p>Descubre los secretos de tus números</p>
      </header>

      <main className="main">
        <InputForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={calcularNumerologia}
        />

        {resultado && (
          <ResultsTabs activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'numerologia' && <NumerologiaTab resultado={resultado} />}
            {activeTab === 'astrologia' && (
              <AstrologiaTab
                fechaNacimiento={formData.fechaNacimiento}
                horaNacimiento={formData.horaNacimiento}
                lugarNacimiento={formData.lugarNacimiento}
              />
            )}
            {activeTab === 'sinastria' && <SinastriaTab />}
          </ResultsTabs>
        )}
      </main>
    </div>
  )
}

export default App
