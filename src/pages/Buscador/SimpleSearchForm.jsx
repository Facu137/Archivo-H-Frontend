import React, { useState } from 'react'
import './SimpleSearchForm.css'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const SimpleSearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 100
  const { token } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    try {
      const response = await axios.get('http://localhost:3000/api/general', {
        params: {
          search: searchTerm,
          page,
          pageSize
        },
        headers: headers
      })

      onSearch(response.data)
      setPage(1)
    } catch (error) {
      console.error('Error al hacer la búsqueda:', error)
      if (error.response && error.response.status === 401) {
        console.log('Token inválido')
        // Lógica para manejar el error 401 (redirigir al login, mostrar un mensaje, etc.)
      }
    }
  }

  return (
    <form id="simple-search-form" onSubmit={handleSubmit}>
      <div className="search-bar-container">
        <input
          type="text"
          id="simple-search-input"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-icon"></span>
      </div>
      <button type="submit">Buscar</button>
    </form>
  )
}

export default SimpleSearchForm
