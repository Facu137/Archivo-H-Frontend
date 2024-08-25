import React, { useState } from 'react'
import './SimpleSearchForm.css'
import axios from 'axios'

const SimpleSearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.get('http://localhost:3000/api/general', {
        params: {
          search: searchTerm
        }
      })
      onSearch(response.data)
    } catch (error) {
      console.error('Error al hacer la búsqueda:', error)
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
