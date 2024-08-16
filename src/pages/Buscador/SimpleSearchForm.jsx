import React, { useState } from 'react'
import './SimpleSearchForm.css'

const SimpleSearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm, {})
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
