import React, { useState } from 'react'
import './SearchContainer.css'
import AdvancedSearchForm from './AdvancedSearchForm'
import SimpleSearchForm from './SimpleSearchForm'
import ResultsContainer from './ResultsContainer'

const SearchContainer = () => {
  const [searchType, setSearchType] = useState('simple')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = (results) => {
    setSearchResults(results)
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
        <SimpleSearchForm onSearch={handleSearch} />
      ) : (
        <AdvancedSearchForm onSearch={handleSearch} />
      )}
      <ResultsContainer results={searchResults} />
    </div>
  )
}

export default SearchContainer
