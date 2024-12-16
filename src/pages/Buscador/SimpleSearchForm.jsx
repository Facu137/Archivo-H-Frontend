// src/pages/Buscador/SimpleSearchForm.jsx
import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Form, InputGroup, Button, Spinner } from 'react-bootstrap'
import { FaSearch, FaTimes } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import { archivoService } from '../../services/archivo.service'

const SimpleSearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 100
  const { isDarkMode } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      const response = await archivoService.busquedaGeneral({
        search: searchTerm,
        page,
        pageSize
      })

      onSearch(response.data)
      setPage(page + 1)
    } catch (error) {
      console.error('Error en la búsqueda:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    setPage(1)
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Buscar en el archivo histórico..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={isDarkMode ? 'bg-dark text-light' : ''}
        />
        {searchTerm && (
          <Button
            variant={isDarkMode ? 'outline-light' : 'outline-secondary'}
            onClick={handleClear}
          >
            <FaTimes />
          </Button>
        )}
        <Button
          type="submit"
          variant={isDarkMode ? 'outline-light' : 'primary'}
          disabled={isLoading || !searchTerm.trim()}
        >
          {isLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <FaSearch />
          )}
        </Button>
      </InputGroup>
    </Form>
  )
}

SimpleSearchForm.propTypes = {
  onSearch: PropTypes.func.isRequired
}

export default SimpleSearchForm
