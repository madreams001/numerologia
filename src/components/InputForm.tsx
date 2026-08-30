export interface FormData {
  nombres: string
  apellidos: string
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
        <label htmlFor="nombres">Nombres</label>
        <input
          type="text"
          id="nombres"
          name="nombres"
          value={formData.nombres}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ej: María José"
        />
      </div>

      <div className="campo">
        <label htmlFor="apellidos">Apellidos</label>
        <input
          type="text"
          id="apellidos"
          name="apellidos"
          value={formData.apellidos}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ej: García López"
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
