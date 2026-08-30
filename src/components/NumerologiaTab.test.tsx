import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { NumerologiaTab } from './NumerologiaTab'
import {
  calculateChallenges,
  getDateEnergies,
  calculatePersonalCycles,
  calculateFibonacciCycle,
  calculateGematria,
} from '../modules/numerologia/calculations'
import type { NumerologiaResult } from '../modules/numerologia/types'

function construirResultado(): NumerologiaResult {
  const fecha = new Date(1990, 2, 15, 12)
  const hoy = new Date(2026, 7, 29, 12)
  const nombre = 'MARIA'
  return {
    vida: 1,
    cumpleanos: 6,
    ciclos: { primero: 9, segundo: 7, tercero: 7 },
    personalYear: 5,
    retos: calculateChallenges(fecha),
    energias: getDateEnergies(fecha),
    ciclosPersonales: calculatePersonalCycles(fecha, nombre),
    fibonacci: calculateFibonacciCycle(fecha, hoy),
    registro: {
      nombreCompleto: 'MARIA GARCIA',
      expresion: 7,
      deseoAlma: 3,
      personalidad: 4,
      motivacion: 3,
      intuicion: 0,
      tendencia: 4,
      gematria: calculateGematria('MARIA GARCIA'),
    },
    uso: {
      nombreCompleto: 'MARIA',
      expresion: 5,
      deseoAlma: 2,
      personalidad: 3,
      motivacion: 2,
      intuicion: 0,
      tendencia: 1,
      gematria: calculateGematria('MARIA'),
    },
  }
}

function obtenerSeccion(titulo: string): HTMLElement {
  const heading = screen.getByRole('heading', { name: titulo })
  const seccion = heading.closest('section')
  if (!seccion) {
    throw new Error(`No se encontró una <section> contenedora de "${titulo}"`)
  }
  return seccion
}

describe('NumerologiaTab', () => {
  it('muestra los números clásicos', () => {
    render(<NumerologiaTab resultado={construirResultado()} />)
    expect(screen.getByText('Número de Vida:')).toBeTruthy()
    expect(screen.getByText('Número de Cumpleaños:')).toBeTruthy()
    expect(screen.getByText('Ciclos de Vida:')).toBeTruthy()
  })

  it('muestra los números de reto', () => {
    render(<NumerologiaTab resultado={construirResultado()} />)
    const seccion = obtenerSeccion('Números de Reto')
    expect(within(seccion).getByText('Reto 1 (Mes − Día):')).toBeTruthy()
    expect(within(seccion).getByText('Reto 2 (Día − Año):')).toBeTruthy()
    expect(within(seccion).getByText('Reto 3 (Mes − Año):')).toBeTruthy()
    expect(within(seccion).getByText('Reto Final:')).toBeTruthy()
  })

  it('muestra los ciclos personales con sus 3 períodos y el activo marcado', () => {
    render(<NumerologiaTab resultado={construirResultado()} />)
    const seccion = obtenerSeccion('Ciclos Personales')
    expect(within(seccion).getByText('Período 1')).toBeTruthy()
    expect(within(seccion).getByText('Período 2')).toBeTruthy()
    expect(within(seccion).getByText('Período 3')).toBeTruthy()
    expect(within(seccion).getByText('Mes Personal Actual:')).toBeTruthy()
    expect(within(seccion).getAllByText('Activo').length).toBeGreaterThanOrEqual(1)
  })

  it('muestra los 7 ciclos de Fibonacci', () => {
    render(<NumerologiaTab resultado={construirResultado()} />)
    const seccion = obtenerSeccion('Ciclo de Fibonacci')
    for (let i = 1; i <= 7; i++) {
      const titulo = within(seccion).queryByText(new RegExp(`Ciclo ${i} ·`))
      expect(titulo).toBeTruthy()
    }
  })

  it('muestra las energías de la fecha', () => {
    render(<NumerologiaTab resultado={construirResultado()} />)
    const seccion = obtenerSeccion('Energías de la Fecha')
    expect(within(seccion).getByText('Día:')).toBeTruthy()
    expect(within(seccion).getByText('Mes:')).toBeTruthy()
    expect(within(seccion).getByText('Año:')).toBeTruthy()
  })

  it('muestra ambos perfiles de nombre (Registro Civil y Uso diario)', () => {
    render(<NumerologiaTab resultado={construirResultado()} />)
    const seccion = obtenerSeccion('Comparación por Nombre')
    expect(within(seccion).getByText('Registro Civil')).toBeTruthy()
    expect(within(seccion).getByText('Uso diario')).toBeTruthy()
    expect(within(seccion).getByText('MARIA GARCIA')).toBeTruthy()
    expect(within(seccion).getByText('MARIA')).toBeTruthy()
    expect(within(seccion).getAllByText('Expresión:')).toHaveLength(2)
    expect(within(seccion).getAllByText('Deseo del Alma:')).toHaveLength(2)
    expect(within(seccion).getAllByText('Personalidad:')).toHaveLength(2)
    expect(within(seccion).getAllByText('Motivación:')).toHaveLength(2)
    expect(within(seccion).getAllByText('Tendencia:')).toHaveLength(2)
    expect(within(seccion).getAllByText('Gematría:')).toHaveLength(2)
  })

  it('muestra los números de cada perfil por separado', () => {
    render(<NumerologiaTab resultado={construirResultado()} />)
    const seccion = obtenerSeccion('Comparación por Nombre')
    // Registro: Expresión 7, Deseo 3, Personalidad 4
    expect(within(seccion).getAllByText('7').length).toBeGreaterThanOrEqual(1)
    expect(within(seccion).getAllByText('3').length).toBeGreaterThanOrEqual(1)
    // Uso: Expresión 5, Deseo 2, Personalidad 3
    expect(within(seccion).getAllByText('5').length).toBeGreaterThanOrEqual(1)
    expect(within(seccion).getAllByText('2').length).toBeGreaterThanOrEqual(1)
  })

  it('muestra texto interpretativo del número de vida y de los retos', () => {
    render(<NumerologiaTab resultado={construirResultado()} />)
    expect(screen.getByText(/Eres un líder nato con una fuerte individualidad/)).toBeTruthy()
    expect(screen.getByText(/Reto Final:/)).toBeTruthy()
    expect(screen.getAllByText(/El reto es/i).length).toBeGreaterThan(0)
  })
})
