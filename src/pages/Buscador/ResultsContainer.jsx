// src/pages/Buscador/ResultsContainer.jsx
import React from 'react'
import ResultCard from './ResultCard'
import PropTypes from 'prop-types'
import { Container, Alert, Spinner } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'

const ResultsContainer = ({ results, onEdit, onDelete, isLoading, error }) => {
  const { isDarkMode } = useTheme()

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center py-5">
        <Spinner
          animation="border"
          variant={isDarkMode ? 'light' : 'primary'}
        />
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-3">
        <Alert variant="danger">
          Error al cargar los resultados: {error.message}
        </Alert>
      </Container>
    )
  }

  if (!results || results.length === 0) {
    return (
      <Container className="py-3">
        <Alert variant={isDarkMode ? 'dark' : 'light'} className="text-center">
          No se encontraron resultados
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className={`m-0 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
          {results.length} {results.length === 1 ? 'resultado' : 'resultados'}{' '}
          encontrados
        </h6>
      </div>
      <div className="d-flex flex-column gap-3">
        {results.map((result) => (
          <ResultCard
            key={result.documento_id}
            result={result}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </Container>
  )
}

ResultsContainer.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      documento_id: PropTypes.number.isRequired,
      tipo_documento: PropTypes.string.isRequired,
      anio: PropTypes.number,
      mes: PropTypes.number,
      dia: PropTypes.number,
      caratula_asunto_extracto: PropTypes.string.isRequired,
      tema: PropTypes.string,
      folios: PropTypes.number.isRequired,
      persona_rol: PropTypes.string.isRequired,
      persona_nombre: PropTypes.string.isRequired,
      persona_tipo: PropTypes.string.isRequired,
      departamento_nombre: PropTypes.string.isRequired,
      imagen_url: PropTypes.string,
      legajo_numero: PropTypes.string,
      expediente_numero: PropTypes.string,
      mensura_lugar: PropTypes.string,
      mensura_propiedad: PropTypes.string,
      notarial_registro: PropTypes.string,
      notarial_protocolo: PropTypes.string
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.object
}

export default ResultsContainer
