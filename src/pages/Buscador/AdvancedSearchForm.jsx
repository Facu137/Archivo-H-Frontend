import React, { useState, useEffect } from 'react'
import './AdvancedSearchForm.css'

const AdvancedSearchForm = ({ onSearch }) => {
  const [categoria, setCategoria] = useState('mensura')
  const [camposBusqueda, setCamposBusqueda] = useState({})

  useEffect(() => {
    mostrarCamposBusqueda(categoria)
  }, [categoria])

  const mostrarCamposBusqueda = (categoria) => {
    let campos = []
    switch (categoria) {
      case 'mensura':
        campos = [
          { label: 'Legajo', id: 'legajo' },
          { label: 'Legajo bis', id: 'legajo_bis' },
          { label: 'Expediente', id: 'expediente' },
          { label: 'Expediente bis', id: 'expediente_bis' },
          { label: 'Departamento Antiguo', id: 'depto_antiguo' },
          { label: 'Departamento Actual', id: 'depto_actual' },
          { label: 'Lugar', id: 'lugar' },
          { label: 'Dia', id: 'dia' },
          { label: 'Mes', id: 'mes' },
          { label: 'Año', id: 'ano' },
          { label: 'Titular', id: 'titular' },
          { label: 'Carátula', id: 'caratula' },
          { label: 'Propiedad', id: 'propiedad' },
          { label: 'Fojas', id: 'fojas' }
        ]
        break
      case 'notarial':
        campos = [
          { label: 'Escribano', id: 'escribano' },
          { label: 'Registro', id: 'registro' },
          { label: 'Protocolo', id: 'protocolo' },
          { label: 'Mes-inicio', id: 'mes_inicio' },
          { label: 'Mes-fin', id: 'mes_fin' },
          { label: 'Dia', id: 'dia' },
          { label: 'Mes', id: 'mes' },
          { label: 'Año', id: 'ano' },
          { label: 'Escritura Nº', id: 'escritura_num' },
          { label: 'Iniciador', id: 'iniciador' },
          { label: 'Extracto', id: 'extracto' },
          { label: 'Negocio-Jurídico', id: 'negocio_juridico' },
          { label: 'Folio', id: 'folio' }
        ]
        break
      case 'correspondencia':
      case 'leyesdecretos': // Mismos campos para correspondencia y leyesdecretos
        campos = [
          { label: 'Legajo', id: 'legajo' },
          { label: 'Legajo bis', id: 'legajo_bis' },
          { label: 'Expediente', id: 'expediente' },
          { label: 'Expediente bis', id: 'expediente_bis' },
          { label: 'Dia', id: 'dia' },
          { label: 'Mes', id: 'mes' },
          { label: 'Año', id: 'ano' },
          { label: 'Emisor', id: 'emisor' },
          { label: 'Destinatario', id: 'destinatario' },
          { label: 'Asunto', id: 'asunto' },
          { label: 'Fojas', id: 'fojas' }
        ]
        break
      case 'gobierno':
      case 'tierrasfiscales': // Mismos campos para gobierno y tierrasfiscales
      case 'tribunales': // Mismos campos para tribunales
        campos = [
          { label: 'Legajo', id: 'legajo' },
          { label: 'Legajo bis', id: 'legajo_bis' },
          { label: 'Expediente', id: 'expediente' },
          { label: 'Expediente bis', id: 'expediente_bis' },
          { label: 'Dia', id: 'dia' },
          { label: 'Mes', id: 'mes' },
          { label: 'Año', id: 'ano' },
          { label: 'Iniciador', id: 'iniciador' },
          { label: 'Carátula', id: 'caratula' },
          { label: 'Tema', id: 'tema' },
          { label: 'Folios', id: 'folios' }
        ]
        break
    }

    const nuevosCampos = {}
    campos.forEach((campo) => {
      nuevosCampos[campo.id] = ''
    })
    setCamposBusqueda(nuevosCampos)
  }

  const handleChange = (e) => {
    setCamposBusqueda({
      ...camposBusqueda,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch('', camposBusqueda)
  }

  return (
    <form id="advanced-search-form" onSubmit={handleSubmit}>
      <label htmlFor="categoria">Categoría:</label>
      <select
        id="categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      >
        <option value="mensura">Mensura</option>
        {/* ... otras opciones */}
      </select>
      <div id="campos-busqueda">
        {Object.keys(camposBusqueda).map((key) => (
          <input
            key={key}
            type="text"
            id={key}
            placeholder={key}
            value={camposBusqueda[key]}
            onChange={handleChange}
          />
        ))}
      </div>
      <button type="submit">Buscar</button>
    </form>
  )
}

export default AdvancedSearchForm
