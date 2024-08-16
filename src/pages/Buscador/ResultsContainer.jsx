import React from 'react'
import './ResultsContainer.css'
import ResultCard from './ResultCard'

const ResultsContainer = ({ results }) => {
  return (
    <div id="results-container">
      {results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </div>
  )
}

export default ResultsContainer
