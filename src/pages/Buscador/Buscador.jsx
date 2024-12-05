// src/pages/Buscador/Buscador.jsx
import React from 'react'
import axios from 'axios'
import SearchContainer from './SearchContainer'
import { useAuth } from '../../context/AuthContext'
import { Container } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'

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
      await axios.delete(
        `http://localhost:3000/api/deleted/documents/${documentoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    } catch (error) {
      console.error('Error al eliminar el documento:', error)
    }
  }

  return (
    <Container
      fluid
      className={`py-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
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
