import { useState } from 'react'
import { calculateLifePath, calculateBirthday, calculateLifeCycles, calculatePersonalYear, calculateExpression, calculateSoulUrge, calculatePersonality, calculateMotivation, calculateIntuition, calculateTendency } from './modules/numerologia/calculations'
import { InputForm } from './components/InputForm'
import type { FormData } from './components/InputForm'
import { ResultsTabs } from './components/ResultsTabs'
import type { TabId } from './components/ResultsTabs'
import { NumerologiaTab } from './components/NumerologiaTab'
import { AstrologiaTab } from './components/AstrologiaTab'
import { SinastriaTab } from './components/SinastriaTab'
import './App.css'

interface NumerologiaResult {
  vida: number
  cumpleanos: number
  ciclos: { primero: number; segundo: number; tercero: number }
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
  const [activeTab, setActiveTab] = useState<TabId>('numerologia')

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
