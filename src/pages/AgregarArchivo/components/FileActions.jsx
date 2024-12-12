import React from 'react'
import PropTypes from 'prop-types'
import { Button, Spinner } from 'react-bootstrap'

const FileActions = ({
  loading,
  originalFilesCount,
  convertedFilesCount,
  onConvert,
  onRemoveAll
}) => {
  return (
    <div className="d-flex gap-2 mb-3">
      <Button
        variant="primary"
        onClick={onConvert}
        disabled={
          loading.upload ||
          loading.convert ||
          originalFilesCount === 0 ||
          originalFilesCount === convertedFilesCount
        }
      >
        {loading.convert ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            Convirtiendo...
          </>
        ) : convertedFilesCount > 0 ? (
          'Convertir Archivos Restantes'
        ) : (
          'Convertir Imagenes'
        )}
      </Button>
      <Button
        variant="danger"
        onClick={() => onRemoveAll('original')}
        disabled={loading.upload || loading.convert || originalFilesCount === 0}
      >
        Borrar Originales
      </Button>
      <Button
        variant="danger"
        onClick={() => onRemoveAll('converted')}
        disabled={
          loading.upload || loading.convert || convertedFilesCount === 0
        }
      >
        Borrar Convertidos
      </Button>
    </div>
  )
}

FileActions.propTypes = {
  loading: PropTypes.shape({
    upload: PropTypes.bool.isRequired,
    convert: PropTypes.bool.isRequired
  }).isRequired,
  originalFilesCount: PropTypes.number.isRequired,
  convertedFilesCount: PropTypes.number.isRequired,
  onConvert: PropTypes.func.isRequired,
  onRemoveAll: PropTypes.func.isRequired
}

export default FileActions
