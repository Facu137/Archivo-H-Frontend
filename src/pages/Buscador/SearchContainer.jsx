// src/pages/Buscador/SearchContainer.jsx
import React, { useState } from 'react'
import AdvancedSearchForm from './AdvancedSearchForm'
import SimpleSearchForm from './SimpleSearchForm'
import ResultsContainer from './ResultsContainer'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Card } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'

const SearchContainer = ({ onSearch, onEdit, onDelete }) => {
  const [searchType, setSearchType] = useState('simple')
  const [searchResults, setSearchResults] = useState([])
  const [visibleResults, setVisibleResults] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [currentSearchTerm, setCurrentSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isDarkMode } = useTheme()

  const handleSearch = async (data) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = data
      setSearchResults(response.results)
      setTotalCount(response.totalCount)
      setCurrentPage(response.page)
      setVisibleResults(response.pageSize)
    } catch (err) {
      setError(err)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSimpleSearch = async (data) => {
    setCurrentSearchTerm(data.search)
    await handleSearch(data)
  }

  const handleLoadMore = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      const response = await onSearch({
        search: currentSearchTerm,
        page: nextPage,
        pageSize: 100
      })
      setSearchResults([...searchResults, ...response.results])
      setVisibleResults((prev) => prev + response.pageSize)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className={`p-4 ${isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-light'}`}
    >
      <Card.Body>
        <div className="mb-4">
          <ButtonGroup className="w-100 mb-4">
            <Button
              variant={
                searchType === 'simple'
                  ? 'primary'
                  : isDarkMode
                    ? 'outline-light'
                    : 'outline-primary'
              }
              active={searchType === 'simple'}
              onClick={() => setSearchType('simple')}
              className="w-50"
            >
              Búsqueda Simple
            </Button>
            <Button
              variant={
                searchType === 'advanced'
                  ? 'primary'
                  : isDarkMode
                    ? 'outline-light'
                    : 'outline-primary'
              }
              active={searchType === 'advanced'}
              onClick={() => setSearchType('advanced')}
              className="w-50"
            >
              Búsqueda Avanzada
            </Button>
          </ButtonGroup>

          {searchType === 'simple' ? (
            <SimpleSearchForm onSearch={handleSimpleSearch} />
          ) : (
            <AdvancedSearchForm onSearch={handleSearch} />
          )}
        </div>

        <ResultsContainer
          results={searchResults.slice(0, visibleResults)}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
          error={error}
        />

        {!isLoading && !error && visibleResults < totalCount && (
          <div className="text-center mt-4">
            <Button
              variant={isDarkMode ? 'light' : 'primary'}
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Cargar más resultados'}
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

SearchContainer.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default SearchContainer
