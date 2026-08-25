import { isMasterNumber } from '../modules/numerologia/calculations'

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

interface NumerologiaTabProps {
  resultado: NumerologiaResult
}

function formatearNumero(num: number): string {
  if (isMasterNumber(num)) {
    return `${num} (Maestro)`
  }
  return num.toString()
}

export function NumerologiaTab({ resultado }: NumerologiaTabProps) {
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
    </div>
  )
}
