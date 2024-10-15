import React from 'react'
import './ResultsContainer.css'
import ResultCard from './ResultCard'
import PropTypes from 'prop-types'

const ResultsContainer = ({ results, onEdit, onDelete }) => {
  return (
    <div id="results-container">
      {results.map((result) => (
        <ResultCard
          key={result.documento_id}
          result={result}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

ResultsContainer.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      documento_id: PropTypes.number.isRequired
      // ... otras propiedades de result ...
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ResultsContainer
