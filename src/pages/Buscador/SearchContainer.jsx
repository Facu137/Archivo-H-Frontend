import React, { useState } from 'react'
import './SearchContainer.css'
import AdvancedSearchForm from './AdvancedSearchForm'
import SimpleSearchForm from './SimpleSearchForm'
import ResultsContainer from './ResultsContainer'
import PropTypes from 'prop-types'

const SearchContainer = ({ onSearch, onEdit, onDelete }) => {
  const [searchType, setSearchType] = useState('simple')
  const [searchResults, setSearchResults] = useState([])
  const [visibleResults, setVisibleResults] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [currentSearchTerm, setCurrentSearchTerm] = useState('')

  const handleSearch = (data) => {
    setSearchResults(data.results)
    setTotalCount(data.totalCount)
    setCurrentPage(data.page)
    setVisibleResults(data.pageSize)
  }

  const handleSimpleSearch = (data) => {
    setCurrentSearchTerm(data.search)
    handleSearch(data)
  }

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1)

    // Realiza una nueva petición al backend con la nueva página
    onSearch({
      search: currentSearchTerm,
      page: currentPage + 1,
      pageSize: 100
    })
  }

  return (
    <div className="search-container">
      <div className="search-type-buttons">
        <input
          type="radio"
          id="simple-search"
          name="search-type"
          checked={searchType === 'simple'}
          onChange={() => setSearchType('simple')}
        />
        <label htmlFor="simple-search">Simple</label>
        <input
          type="radio"
          id="advanced-search"
          name="search-type"
          checked={searchType === 'advanced'}
          onChange={() => setSearchType('advanced')}
        />
        <label htmlFor="advanced-search">Avanzada</label>
      </div>
      {searchType === 'simple' ? (
        <SimpleSearchForm onSearch={handleSimpleSearch} />
      ) : (
        <AdvancedSearchForm onSearch={handleSearch} />
      )}

      {/* Mostrar solo las tarjetas visibles */}
      <ResultsContainer
        results={searchResults.slice(0, visibleResults)}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* Botón "Cargar más" */}
      {visibleResults < totalCount && (
        <button onClick={handleLoadMore}>Cargar más</button>
      )}
    </div>
  )
}

SearchContainer.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default SearchContainer
