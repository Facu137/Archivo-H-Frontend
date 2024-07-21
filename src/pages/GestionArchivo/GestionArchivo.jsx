// src/pages/GestionArchivo/GestionArchivo.jsx
import './GestionArchivo.css'
export const GestionArchivo = () => {
  return (
    <>
      <h1>Completar informacion del archvio</h1>

      <div className="contenedor-formulario">
        <form id="formulario-archivo">
          <label htmlFor="autor-iniciador">Autor/iniciador:</label>
          <input
            type="text"
            id="autor-iniciador"
            name="autor-iniciador"
            required
          />

          <label htmlFor="carautla">Caratula:</label>
          <input type="text" id="caratula" name="caratula" required />

          <label htmlFor="numero-folios">Numero de folios:</label>
          <input
            type="number"
            id="numero-folios"
            name="numero-folios"
            min="1"
            required
          />

          <label htmlFor="fecha">Fecha:</label>
          <input type="date" id="fecha" name="fecha" required />

          <label htmlFor="tema">Tema:</label>
          <input type="text" id="tema" name="tema" required />

          <label htmlFor="archivo">Seleccionar archivo:</label>
          <input type="file" id="archivo" name="archivo" required />

          <div className="botones">
            <button type="button" id="btn-subir">
              Subir
            </button>
            <button type="button" id="btn-eliminar" disabled>
              Eliminar
            </button>
            <button type="submit" id="btn-guardar">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
