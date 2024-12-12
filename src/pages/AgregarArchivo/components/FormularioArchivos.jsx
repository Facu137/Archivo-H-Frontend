import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { convertToWebp, generatePreview } from '../../../utils/imageConverter'
import FileUploader from './FileUploader'
import FilePreviewGrid from './FilePreviewGrid'
import FileActions from './FileActions'
import ImageLightbox from './ImageLightbox'

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
        URL.revokeObjectURL(img.src)
      }
      img.onerror = () => {
        resolve({
          width: '-',
          height: '-',
          size: (file.size / 1024).toFixed(2) // KB
        })
        URL.revokeObjectURL(img.src)
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

      const uniqueFiles = files.filter(
        (file) => !isFileDuplicate(file, originalFiles)
      )

      if (uniqueFiles.length === 0) {
        setError('Los archivos seleccionados ya han sido agregados')
        return
      }

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

      const unconvertedFiles = originalFiles.filter((originalFile) => {
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

      const successfulConversions = newConverted.filter(Boolean)

      if (successfulConversions.length === 0) {
        throw new Error('No se pudo convertir ningún archivo')
      }

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
        setOriginalFiles((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => ({
          ...prev,
          original: prev.original.filter((_, i) => i !== index)
        }))
        setDimensions((prev) => ({
          ...prev,
          original: prev.original.filter((_, i) => i !== index)
        }))

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
        setOriginalFiles([])
        setPreviews((prev) => ({ ...prev, original: [] }))
        setDimensions((prev) => ({ ...prev, original: [] }))
      } else {
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

  return (
    <div className="mb-4">
      <h4 className="mb-3">Archivos</h4>

      <FileUploader loading={loading} onFileChange={handleFileChange} />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {originalFiles.length > 0 && (
        <>
          <FilePreviewGrid
            files={originalFiles}
            previewUrls={previews.original}
            dimensions={dimensions.original}
            title="Archivos Originales"
            type="original"
            loading={loading.upload}
            onRemove={removeFile}
            onPreviewClick={openLightbox}
          />

          <FileActions
            loading={loading}
            originalFilesCount={originalFiles.length}
            convertedFilesCount={convertedFiles.length}
            onConvert={handleConvert}
            onRemoveAll={removeAllFiles}
          />

          {convertedFiles.length > 0 && (
            <FilePreviewGrid
              files={convertedFiles}
              previewUrls={previews.converted}
              dimensions={dimensions.converted}
              title="Archivos Convertidos"
              type="converted"
              loading={loading.convert}
              onRemove={removeFile}
              onPreviewClick={openLightbox}
            />
          )}
        </>
      )}

      <ImageLightbox
        open={lightbox.open}
        index={lightbox.index}
        images={lightbox.images}
        onClose={() => setLightbox({ ...lightbox, open: false })}
      />
    </div>
  )
}

FormularioArchivos.propTypes = {
  onFilesChange: PropTypes.func.isRequired
}

export default FormularioArchivos
