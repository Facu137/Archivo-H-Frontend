import React, { useState, useEffect } from 'react'
import './AdvancedSearchForm.css'
import axios from 'axios'

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
          { label: 'Legajo', id: 'Legajo' },
          { label: 'Legajo bis', id: 'Legajo bis' },
          { label: 'Expediente', id: 'Expediente' },
          { label: 'Expediente bis', id: 'Expediente bis' },
          { label: 'Departamento Antiguo', id: 'Dpto. Antiguo' },
          { label: 'Departamento Actual', id: 'Dpto. Actual' },
          { label: 'Lugar', id: 'Lugar' },
          { label: 'Dia', id: 'Dia' },
          { label: 'Mes', id: 'Mes' },
          { label: 'Año', id: 'Año' },
          { label: 'Titular', id: 'Titular' },
          { label: 'Carátula', id: 'Caratula' },
          { label: 'Propiedad', id: 'Propiedad' },
          { label: 'Fojas', id: 'Fojas' }
        ]
        break
      case 'notarial':
        campos = [
          { label: 'Escribano', id: 'Escribano' },
          { label: 'Registro', id: 'Registro' },
          { label: 'Protocolo', id: 'Protocolo' },
          { label: 'Mes inicio', id: 'Mes inicio' },
          { label: 'Mes fin', id: 'Mes fin' },
          { label: 'Dia', id: 'Dia' },
          { label: 'Mes', id: 'Mes' },
          { label: 'Año', id: 'Año' },
          { label: 'Escritura Nº', id: 'Escritura N°' },
          { label: 'Iniciador', id: 'Iniciador' },
          { label: 'Extracto', id: 'Extracto' },
          { label: 'Negocio Jurídico', id: 'Negocio juridico' },
          { label: 'Folio', id: 'Folio' }
        ]
        break
      case 'correspondencia':
      case 'leyesdecretos': // Mismos campos para correspondencia y leyesdecretos
        campos = [
          { label: 'Legajo', id: 'Legajo' },
          { label: 'Legajo bis', id: 'Legajo bis' },
          { label: 'Expediente', id: 'Expediente' },
          { label: 'Expediente bis', id: 'Expediente bis' },
          { label: 'Dia', id: 'Dia' },
          { label: 'Mes', id: 'Mes' },
          { label: 'Año', id: 'Año' },
          { label: 'Emisor', id: 'Emisor' },
          { label: 'Destinatario', id: 'Destinatario' },
          { label: 'Asunto', id: 'Asunto' },
          { label: 'Fojas', id: 'Fojas' }
        ]
        break
      case 'gobierno':
      case 'tierrasfiscales': // Mismos campos para gobierno y tierrasfiscales
      case 'tribunales': // Mismos campos para tribunales
        campos = [
          { label: 'Legajo', id: 'Legajo' },
          { label: 'Legajo bis', id: 'Legajo bis' },
          { label: 'Expediente', id: 'Expediente' },
          { label: 'Expediente bis', id: 'Expediente bis' },
          { label: 'Dia', id: 'Dia' },
          { label: 'Mes', id: 'Mes' },
          { label: 'Año', id: 'Año' },
          { label: 'Iniciador', id: 'Iniciador' },
          { label: 'Carátula', id: 'Caratula' },
          { label: 'Tema', id: 'Tema' },
          { label: 'Folios', id: 'Folios' }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('http://localhost:3000/api/general', {
        params: {
          search: JSON.stringify(camposBusqueda)
        }
      })
      onSearch(response.data)
    } catch (error) {
      console.error('Error al hacer la búsqueda:', error)
    }
  }

  return (
    <form id="advanced-search-form" onSubmit={handleSubmit}>
      <label htmlFor="categoria">Categoría:</label>
      <select
        id="categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value.toLowerCase())}
      >
        <option value="mensura">Mensura</option>
        <option value="notarial">Notarial</option>
        <option value="correspondencia">Correspondencia</option>
        <option value="leyesdecretos">Leyes Decretos</option>
        <option value="gobierno">Gobierno</option>
        <option value="tierrasfiscales">Tierras Fiscales</option>
        <option value="tribunales">Tribunales</option>
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
