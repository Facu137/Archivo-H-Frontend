// src/pages/ArchivosEliminados/ResultsContainerEliminados.jsx
import React from 'react'
import './ResultsContainerEliminados.css'
import ResultCardEliminados from './ResultCardEliminados'
import PropTypes from 'prop-types'

const ResultsContainerEliminados = ({
  results,
  onDeletePermanently,
  onRestore
}) => {
  return (
    <div className="results-container-eliminados">
      {results.map((result) => (
        <ResultCardEliminados
          key={result.documento_id}
          result={result}
          onDeletePermanently={onDeletePermanently}
          onRestore={onRestore}
        />
      ))}
    </div>
  )
}

ResultsContainerEliminados.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      documento_id: PropTypes.number.isRequired
      // ... otras propiedades de result ...
    })
  ).isRequired,
  onDeletePermanently: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired
}

export default ResultsContainerEliminados
