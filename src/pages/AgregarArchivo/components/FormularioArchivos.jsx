import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Card } from 'react-bootstrap'
import { convertToAVIF, generatePreview } from '../../../utils/imageConverter'

const FormularioArchivos = ({ onFilesChange }) => {
  const [originalFiles, setOriginalFiles] = useState([])
  const [convertedFiles, setConvertedFiles] = useState([])
  const [previews, setPreviews] = useState({
    original: [],
    converted: []
  })

  useEffect(() => {
    // Limpiar URLs de vista previa al desmontar
    return () => {
      previews.original.forEach((preview) => {
        if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
      })
      previews.converted.forEach((preview) => {
        if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
      })
    }
  }, [previews])

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files)
    setOriginalFiles(files)

    // Generar vistas previas para archivos originales
    const newPreviews = await Promise.all(
      files.map((file) => generatePreview(file))
    )
    setPreviews((prev) => ({ ...prev, original: newPreviews }))

    // Notificar al componente padre
    onFilesChange(files)
  }

  const handleConvert = async () => {
    try {
      // Convertir archivos a AVIF
      const converted = await Promise.all(
        originalFiles.map((file) => convertToAVIF(file))
      )
      setConvertedFiles(converted)

      // Generar vistas previas para archivos convertidos
      const newPreviews = await Promise.all(
        converted.map((file) => generatePreview(file))
      )
      setPreviews((prev) => ({ ...prev, converted: newPreviews }))

      // Notificar al componente padre con los archivos convertidos
      onFilesChange(converted)
    } catch (error) {
      console.error('Error al convertir archivos:', error)
    }
  }

  const renderPreviews = (files, previewUrls, title) => (
    <div className="mb-4">
      <h5>{title}</h5>
      <Row xs={1} md={2} lg={3} className="g-4">
        {files.map((file, idx) => (
          <Col key={`${file.name}-${idx}`}>
            <Card>
              {file.type === 'application/pdf' ? (
                <div className="ratio ratio-16x9">
                  <iframe
                    src={previewUrls[idx]}
                    title={file.name}
                    allowFullScreen
                  />
                </div>
              ) : (
                <Card.Img
                  variant="top"
                  src={previewUrls[idx]}
                  alt={file.name}
                  style={{ objectFit: 'cover', height: '200px' }}
                />
              )}
              <Card.Body>
                <Card.Title className="fs-6">{file.name}</Card.Title>
                <Card.Text className="text-muted">
                  {(file.size / 1024).toFixed(2)} KB
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )

  return (
    <div className="mb-4">
      <h4 className="mb-3">Archivos</h4>
      <Form.Group className="mb-3">
        <Form.Label>Seleccionar Archivos</Form.Label>
        <Form.Control
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
        <Form.Text className="text-muted">
          Puede seleccionar múltiples archivos de imagen o PDF
        </Form.Text>
      </Form.Group>

      {originalFiles.length > 0 && (
        <>
          {renderPreviews(
            originalFiles,
            previews.original,
            'Archivos Originales'
          )}

          <Button
            variant="primary"
            onClick={handleConvert}
            className="mb-3"
            disabled={convertedFiles.length > 0}
          >
            Convertir a AVIF
          </Button>

          {convertedFiles.length > 0 &&
            renderPreviews(
              convertedFiles,
              previews.converted,
              'Archivos Convertidos'
            )}
        </>
      )}
    </div>
  )
}

FormularioArchivos.propTypes = {
  onFilesChange: PropTypes.func.isRequired
}

export default FormularioArchivos
