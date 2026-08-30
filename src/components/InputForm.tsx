export interface FormData {
  nombresRegistro: string
  apellidosRegistro: string
  nombresUso: string
  apellidosUso: string
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

      <div className="seccion-formulario">
        <h3>Registro Civil</h3>
        <p className="ayuda-formulario">
          Tu nombre de nacimiento, tal como figura en el acta / DNI.
        </p>

        <div className="campo">
          <label htmlFor="nombresRegistro">Nombres</label>
          <input
            type="text"
            id="nombresRegistro"
            name="nombresRegistro"
            value={formData.nombresRegistro}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="Ej: María José"
          />
        </div>

        <div className="campo">
          <label htmlFor="apellidosRegistro">Apellidos</label>
          <input
            type="text"
            id="apellidosRegistro"
            name="apellidosRegistro"
            value={formData.apellidosRegistro}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="Ej: García López"
          />
        </div>
      </div>

      <div className="seccion-formulario">
        <h3>Uso diario</h3>
        <p className="ayuda-formulario">
          Cómo te llaman y cómo te presentás (puede ser un diminutivo o un nombre distinto).
        </p>

        <div className="campo">
          <label htmlFor="nombresUso">Nombres</label>
          <input
            type="text"
            id="nombresUso"
            name="nombresUso"
            value={formData.nombresUso}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="Ej: María"
          />
        </div>

        <div className="campo">
          <label htmlFor="apellidosUso">Apellidos</label>
          <input
            type="text"
            id="apellidosUso"
            name="apellidosUso"
            value={formData.apellidosUso}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder="Ej: García"
          />
        </div>
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
