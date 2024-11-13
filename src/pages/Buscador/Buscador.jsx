// src/pages/Buscador/Buscador.jsx
import React from 'react'
import axios from 'axios'
import SearchContainer from './SearchContainer'
import './Buscador.css'
import { useAuth } from '../../context/AuthContext'

const Buscador = () => {
  const { token } = useAuth()

  const handleSearch = (results) => {
    // Aquí puedes actualizar el estado global si es necesario
    // o realizar alguna acción con los resultados
    console.log('Resultados de la búsqueda:', results)
  }

  const handleEdit = async (documentoId) => {
    try {
      // Aquí puedes implementar la lógica para editar el documento
      // Por ejemplo, abrir un modal o redirigir a una página de edición
      console.log(`Editando: ${documentoId}`)
    } catch (error) {
      console.error('Error al editar el documento:', error)
    }
  }

  const handleDelete = async (documentoId) => {
    try {
      await axios.delete(`http://localhost:3000/api/documents/${documentoId}`, {
        // Usa axios directamente
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // Realiza alguna acción después de eliminar el documento, como actualizar la lista
    } catch (error) {
      console.error('Error al eliminar el documento:', error)
    }
  }

  return (
    <div className="buscador-container">
      <h1>Búsqueda</h1>
      <SearchContainer
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default Buscador
