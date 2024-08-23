import React, { useState } from 'react'
import SearchContainer from './SearchContainer'
import ResultsContainer from './ResultsContainer'
import './Buscador.css'
import axiosInstance from '../../api/axiosConfig' // Asegúrate de que la ruta sea correcta
import { useAuth } from '../../context/AuthContext'

const Buscador = () => {
  const [searchResults, setSearchResults] = useState([])
  const { token } = useAuth()

  const handleSearch = (results) => {
    setSearchResults(results)
  }

  const handleEdit = async (documento_id) => {
    try {
      // Aquí puedes implementar la lógica para editar el documento
      // Por ejemplo, abrir un modal o redirigir a una página de edición
      console.log(`Editando: ${documento_id}`)
    } catch (error) {
      console.error('Error al editar el documento:', error)
    }
  }

  const handleDelete = async (documento_id) => {
    try {
      await axiosInstance.delete(`/documents/${documento_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // Actualizar los resultados de búsqueda después de eliminar
      setSearchResults((prevResults) =>
        prevResults.filter((result) => result.documento_id !== documento_id)
      )
    } catch (error) {
      console.error('Error al eliminar el documento:', error)
    }
  }

  return (
    <div className="buscador-container">
      <h1>Búsqueda</h1>
      <SearchContainer onSearch={handleSearch} />
      <ResultsContainer
        results={searchResults}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default Buscador
