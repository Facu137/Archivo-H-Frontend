// src/pages/Buscador/Buscador.jsx
import React from 'react'
import SearchContainer from './SearchContainer'
import { useAuth } from '../../context/AuthContext'
import { Container } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'
import { archivoService } from '../../services/archivo.service'

const Buscador = () => {
  const { token } = useAuth()
  const { isDarkMode } = useTheme()

  const handleSearch = (results) => {
    console.log('Resultados de la búsqueda:', results)
  }

  const handleEdit = async (documentoId) => {
    try {
      console.log(`Editando: ${documentoId}`)
    } catch (error) {
      console.error('Error al editar el documento:', error)
    }
  }

  const handleDelete = async (documentoId) => {
    try {
      await archivoService.eliminarArchivo(documentoId)
      console.log('Documento eliminado con éxito')
    } catch (error) {
      console.error('Error al eliminar el documento:', error)
    }
  }

  return (
    <Container
      fluid
      className={`min-vh-100 py-4 ${isDarkMode ? 'bg-dark text-light' : ''}`}
    >
      <Container className={isDarkMode ? 'text-light' : 'text-dark'}>
        <h1 className="mb-4">Búsqueda de Archivos Historicos</h1>
        <SearchContainer
          onSearch={handleSearch}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>
    </Container>
  )
}

export default Buscador
