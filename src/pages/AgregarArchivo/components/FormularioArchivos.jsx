import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row,
  Col,
  Button,
  Card,
  CloseButton,
  Spinner
} from 'react-bootstrap'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import { convertToWebp, generatePreview } from '../../../utils/imageConverter'

const FormularioArchivos = ({ onFilesChange }) => {
  const [originalFiles, setOriginalFiles] = useState([])
  const [convertedFiles, setConvertedFiles] = useState([])
  const [previews, setPreviews] = useState({
    original: [],
    converted: []
  })
  const [dimensions, setDimensions] = useState({
    original: [],
    converted: []
  })
  const [lightbox, setLightbox] = useState({
    open: false,
    index: 0,
    images: []
  })
  const [loading, setLoading] = useState({
    upload: false,
    convert: false
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    // Limpiar URLs de vista previa al desmontar
    return () => {
      previews.original.forEach((preview) => {
        if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
      })
      previews.converted.forEach((preview) => {
        if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
      })
    }
  }, [previews])

  const getDimensions = (file) => {
    return new Promise((resolve) => {
      if (file.type === 'application/pdf') {
        resolve({
          width: '-',
          height: '-',
          size: (file.size / 1024).toFixed(2) // KB
        })
        return
      }

      const img = new Image()
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: (file.size / 1024).toFixed(2) // KB
        })
        URL.revokeObjectURL(img.src) // Limpiar URL
      }
      img.onerror = () => {
        resolve({
          width: '-',
          height: '-',
          size: (file.size / 1024).toFixed(2) // KB
        })
        URL.revokeObjectURL(img.src) // Limpiar URL
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const isFileDuplicate = (newFile, existingFiles) => {
    return existingFiles.some(
      (file) => file.name === newFile.name && file.size === newFile.size
    )
  }

  const handleFileChange = async (e) => {
    try {
      setLoading((prev) => ({ ...prev, upload: true }))
      setError(null)
      const files = Array.from(e.target.files)

      // Filtrar duplicados
      const uniqueFiles = files.filter(
        (file) => !isFileDuplicate(file, originalFiles)
      )

      if (uniqueFiles.length === 0) {
        setError('Los archivos seleccionados ya han sido agregados')
        return
      }

      // Generar vistas previas y obtener dimensiones para archivos originales
      const newPreviews = await Promise.all(
        uniqueFiles.map((file) => generatePreview(file))
      )
      const newDimensions = await Promise.all(uniqueFiles.map(getDimensions))

      setOriginalFiles((prev) => [...prev, ...uniqueFiles])
      setPreviews((prev) => ({
        ...prev,
        original: [...prev.original, ...newPreviews]
      }))
      setDimensions((prev) => ({
        ...prev,
        original: [...prev.original, ...newDimensions]
      }))

      // Notificar al componente padre
      onFilesChange([...originalFiles, ...uniqueFiles])
    } catch (err) {
      setError('Error al cargar los archivos: ' + err.message)
      console.error('Error al cargar archivos:', err)
    } finally {
      setLoading((prev) => ({ ...prev, upload: false }))
    }
  }

  const handleConvert = async () => {
    try {
      setLoading((prev) => ({ ...prev, convert: true }))
      setError(null)

      // Convertir todos los archivos originales que no tengan una versión convertida
      const unconvertedFiles = originalFiles.filter((originalFile) => {
        // Buscar si ya existe una versión convertida de este archivo
        return !convertedFiles.some(
          (convertedFile) =>
            convertedFile.name ===
            originalFile.name.replace(/\.[^/.]+$/, '.webp')
        )
      })

      if (unconvertedFiles.length === 0) {
        throw new Error('No hay archivos nuevos para convertir')
      }

      const newConverted = await Promise.all(
        unconvertedFiles.map(async (file) => {
          try {
            return await convertToWebp(file)
          } catch (err) {
            console.error(`Error al convertir ${file.name}:`, err)
            return null
          }
        })
      )

      // Filtrar archivos que fallaron en la conversión
      const successfulConversions = newConverted.filter(Boolean)

      if (successfulConversions.length === 0) {
        throw new Error('No se pudo convertir ningún archivo')
      }

      // Generar vistas previas y dimensiones para archivos convertidos
      const newPreviews = await Promise.all(
        successfulConversions.map((file) => generatePreview(file))
      )
      const newDimensions = await Promise.all(
        successfulConversions.map(getDimensions)
      )

      setConvertedFiles((prev) => [...prev, ...successfulConversions])
      setPreviews((prev) => ({
        ...prev,
        converted: [...prev.converted, ...newPreviews]
      }))
      setDimensions((prev) => ({
        ...prev,
        converted: [...prev.converted, ...newDimensions]
      }))

      // Notificar al componente padre con todos los archivos convertidos
      onFilesChange([...convertedFiles, ...successfulConversions])
    } catch (err) {
      setError('Error al convertir los archivos: ' + err.message)
      console.error('Error al convertir archivos:', err)
    } finally {
      setLoading((prev) => ({ ...prev, convert: false }))
    }
  }

  const removeFile = (index, type) => {
    try {
      if (type === 'original') {
        // Si eliminamos un archivo original, también eliminamos su versión convertida
        setOriginalFiles((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => ({
          ...prev,
          original: prev.original.filter((_, i) => i !== index)
        }))
        setDimensions((prev) => ({
          ...prev,
          original: prev.original.filter((_, i) => i !== index)
        }))

        // Eliminar también el archivo convertido correspondiente
        setConvertedFiles((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => ({
          ...prev,
          converted: prev.converted.filter((_, i) => i !== index)
        }))
        setDimensions((prev) => ({
          ...prev,
          converted: prev.converted.filter((_, i) => i !== index)
        }))
      } else {
        // Si eliminamos un archivo convertido, solo eliminamos ese
        setConvertedFiles((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => ({
          ...prev,
          converted: prev.converted.filter((_, i) => i !== index)
        }))
        setDimensions((prev) => ({
          ...prev,
          converted: prev.converted.filter((_, i) => i !== index)
        }))
      }
    } catch (err) {
      setError('Error al eliminar el archivo: ' + err.message)
      console.error('Error al eliminar archivo:', err)
    }
  }

  const removeAllFiles = (type) => {
    try {
      if (type === 'original') {
        // Borrar solo los archivos originales, manteniendo los convertidos
        setOriginalFiles([])
        setPreviews((prev) => ({ ...prev, original: [] }))
        setDimensions((prev) => ({ ...prev, original: [] }))
      } else {
        // Borrar solo archivos convertidos
        setConvertedFiles([])
        setPreviews((prev) => ({ ...prev, converted: [] }))
        setDimensions((prev) => ({ ...prev, converted: [] }))
      }
    } catch (err) {
      setError('Error al eliminar los archivos: ' + err.message)
      console.error('Error al eliminar archivos:', err)
    }
  }

  const openLightbox = (index, images) => {
    setLightbox({
      open: true,
      index,
      images: images.map((url) => ({ src: url }))
    })
  }

  const renderPreviews = (files, previewUrls, dims, title, type) => (
    <div className="mb-4">
      <h5 className="d-flex align-items-center">
        {title}
        {type === 'original' && loading.upload && (
          <Spinner
            animation="border"
            size="sm"
            className="ms-2"
            variant="primary"
          />
        )}
        {type === 'converted' && loading.convert && (
          <Spinner
            animation="border"
            size="sm"
            className="ms-2"
            variant="primary"
          />
        )}
      </h5>
      <Row xs={2} sm={3} md={4} lg={5} className="g-2">
        {files.map((file, idx) => (
          <Col key={`${file.name}-${idx}`}>
            <Card style={{ height: '100%' }}>
              <div className="position-relative">
                <CloseButton
                  className="position-absolute top-0 end-0 m-1"
                  onClick={() => removeFile(idx, type)}
                  style={{ zIndex: 1 }}
                />
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
                    style={{
                      objectFit: 'cover',
                      height: '120px',
                      cursor: 'pointer'
                    }}
                    onClick={() => openLightbox(idx, previewUrls)}
                  />
                )}
              </div>
              <Card.Body className="p-2">
                <Card.Title className="fs-6 text-truncate" title={file.name}>
                  {file.name}
                </Card.Title>
                <Card.Text className="text-muted small mb-0">
                  {dims[idx]?.width}x{dims[idx]?.height}px
                </Card.Text>
                <Card.Text className="text-muted small">
                  {dims[idx]?.size} KB
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
          disabled={loading.upload || loading.convert}
        />
        <Form.Text className="text-muted">
          Puede seleccionar múltiples archivos de imagen o PDF
        </Form.Text>
      </Form.Group>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {originalFiles.length > 0 && (
        <>
          {renderPreviews(
            originalFiles,
            previews.original,
            dimensions.original,
            'Archivos Originales',
            'original'
          )}

          <div className="d-flex gap-2 mb-3">
            <Button
              variant="primary"
              onClick={handleConvert}
              disabled={
                loading.upload ||
                loading.convert ||
                originalFiles.length === 0 ||
                originalFiles.length === convertedFiles.length
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
              ) : convertedFiles.length > 0 ? (
                'Convertir Archivos Restantes'
              ) : (
                'Convertir Imagenes'
              )}
            </Button>
            <Button
              variant="danger"
              onClick={() => removeAllFiles('original')}
              disabled={
                loading.upload || loading.convert || originalFiles.length === 0
              }
            >
              Quitar Todos los Originales
            </Button>
          </div>
        </>
      )}

      {convertedFiles.length > 0 && (
        <>
          {renderPreviews(
            convertedFiles,
            previews.converted,
            dimensions.converted,
            'Archivos Convertidos',
            'converted'
          )}
          <Button
            variant="danger"
            onClick={() => removeAllFiles('converted')}
            className="mb-3"
            disabled={loading.convert}
          >
            Quitar Todos los Convertidos
          </Button>
        </>
      )}

      <div className="alert alert-info mt-3 mb-0 p-2 d-flex">
        <div className="col-6">Archivos originales: {originalFiles.length}</div>
        <div className="col-6">
          Archivos convertidos: {convertedFiles.length}
        </div>
      </div>

      <Lightbox
        open={lightbox.open}
        close={() => setLightbox({ ...lightbox, open: false })}
        index={lightbox.index}
        slides={lightbox.images}
        plugins={[Thumbnails, Zoom, Fullscreen]}
        thumbnails={{
          position: 'start',
          width: 50,
          height: 70,
          border: 1,
          borderRadius: 0,
          showToggle: true
        }}
        zoom={{
          scrollToZoom: true
        }}
      />
    </div>
  )
}

FormularioArchivos.propTypes = {
  onFilesChange: PropTypes.func.isRequired
}

export default FormularioArchivos
