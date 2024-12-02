// src/pages/Buscador/SimpleSearchForm.jsx
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { Form, InputGroup, Button, Spinner } from 'react-bootstrap'
import { FaSearch, FaTimes } from 'react-icons/fa'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'

const SimpleSearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const pageSize = 100
  const { token } = useAuth()
  const { isDarkMode } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    try {
      const response = await axios.get('http://localhost:3000/api/general', {
        params: {
          search: searchTerm,
          page,
          pageSize
        },
        headers
      })

      onSearch(response.data)
      setPage(1)
    } catch (error) {
      console.error('Error al hacer la búsqueda:', error)
      if (error.response && error.response.status === 401) {
        console.log('Token inválido')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <Form onSubmit={handleSubmit} className="search-form">
      <InputGroup size="lg" className="mb-3 shadow-sm">
        <Form.Control
          type="text"
          placeholder="Ingrese su búsqueda aquí..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Término de búsqueda"
          className={`
            ${isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-white'}
            border-end-0
            ${searchTerm ? 'pe-5' : ''}
          `}
          style={{
            transition: 'all 0.3s ease',
            fontSize: '1.1rem'
          }}
          disabled={isLoading}
        />
        {searchTerm && (
          <Button
            variant="link"
            onClick={handleClear}
            className="position-absolute end-0 z-1 border-0 bg-transparent"
            style={{ right: '70px', zIndex: 10, padding: '12px' }}
          >
            <FaTimes className={isDarkMode ? 'text-light' : 'text-secondary'} />
          </Button>
        )}
        <Button
          variant={isDarkMode ? 'light' : 'primary'}
          type="submit"
          className="d-flex align-items-center gap-2 px-4"
          style={{ transition: 'all 0.3s ease' }}
          disabled={!searchTerm.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <FaSearch />
              <span>Buscar</span>
            </>
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
