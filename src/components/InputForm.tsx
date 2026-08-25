export interface FormData {
  nombre: string
  fechaNacimiento: string
  horaNacimiento: string
  lugarNacimiento: string
}

interface InputFormProps {
  formData: FormData
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
}

export function InputForm({ formData, onChange, onSubmit }: InputFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  return (
    <section className="formulario">
      <h2>Ingresa tus datos</h2>
      
      <div className="campo">
        <label htmlFor="nombre">Nombre Completo</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={onChange}
          onKeyDown={handleKeyDown}
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
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="campo">
        <label htmlFor="horaNacimiento">Hora de Nacimiento (opcional)</label>
        <input
          type="time"
          id="horaNacimiento"
          name="horaNacimiento"
          value={formData.horaNacimiento}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="campo">
        <label htmlFor="lugarNacimiento">Lugar de Nacimiento</label>
        <input
          type="text"
          id="lugarNacimiento"
          name="lugarNacimiento"
          value={formData.lugarNacimiento}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ej: Buenos Aires, Argentina"
        />
      </div>

      <button onClick={onSubmit} className="boton-calcular">
        Calcular
      </button>
    </section>
  )
}
