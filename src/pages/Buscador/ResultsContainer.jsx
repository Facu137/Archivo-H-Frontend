import React from 'react'
import './ResultsContainer.css'
import ResultCard from './ResultCard'

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

export default ResultsContainer
