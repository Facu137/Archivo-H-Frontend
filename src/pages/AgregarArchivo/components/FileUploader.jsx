import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

const FileUploader = ({ loading, onFileChange }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Seleccionar Archivos</Form.Label>
      <Form.Control
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={onFileChange}
        disabled={loading.upload || loading.convert}
      />
      <Form.Text className="text-muted">
        Puede seleccionar múltiples archivos de imagen o PDF
      </Form.Text>
    </Form.Group>
  )
}

FileUploader.propTypes = {
  loading: PropTypes.shape({
    upload: PropTypes.bool.isRequired,
    convert: PropTypes.bool.isRequired
  }).isRequired,
  onFileChange: PropTypes.func.isRequired
}

export default FileUploader
