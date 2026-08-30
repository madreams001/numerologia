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
    nombres: '',
    apellidos: '',
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
    if (!formData.nombres || !formData.apellidos || !formData.fechaNacimiento) {
      alert('Por favor, ingresa tus nombres, apellidos y fecha de nacimiento.')
      return
    }

    // Parse fecha in local time at noon to avoid UTC midnight shifting the day
    // (e.g. "1969-02-07" parsed as UTC rolls back to day 6 in UTC-3 zones)
    const [y, m, d] = formData.fechaNacimiento.split('-').map(Number)
    const fecha = new Date(y, m - 1, d, 12)
    const anioActual = new Date().getFullYear()
    const hoy = new Date()

    const ciclos = calculateLifeCycles(fecha)
    const nombreCompleto = [formData.nombres, formData.apellidos].filter(Boolean).join(' ')
    const result: NumerologiaResult = {
      vida: calculateLifePath(fecha),
      cumpleanos: calculateBirthday(fecha),
      ciclos: { primero: ciclos.first, segundo: ciclos.second, tercero: ciclos.third },
      personalYear: calculatePersonalYear(fecha, anioActual),
      expresion: calculateExpression(nombreCompleto),
      deseoAlma: calculateSoulUrge(nombreCompleto),
      personalidad: calculatePersonality(nombreCompleto),
      motivacion: calculateMotivation(formData.nombres),
      intuicion: calculateIntuition(formData.nombres),
      tendencia: calculateTendency(formData.apellidos),
      retos: calculateChallenges(fecha),
      energias: getDateEnergies(fecha),
      ciclosPersonales: calculatePersonalCycles(fecha, formData.nombres),
      fibonacci: calculateFibonacciCycle(fecha, hoy),
      gematria: calculateGematria(nombreCompleto)
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
