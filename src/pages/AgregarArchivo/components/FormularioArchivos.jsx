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
      // Limpiar URLs del lightbox
      if (lightbox.images) {
        lightbox.images.forEach((image) => {
          if (image?.src?.startsWith('blob:')) URL.revokeObjectURL(image.src)
        })
      }
    }
  }, [previews, lightbox.images])

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
        // Si es un PDF, verificar si ya existe algún archivo convertido que comience con el nombre del PDF
        if (originalFile.type === 'application/pdf') {
          const pdfBaseName = originalFile.name.replace(/\.pdf$/i, '')
          return !convertedFiles.some((convertedFile) =>
            convertedFile.name.startsWith(pdfBaseName + '_pag')
          )
        }
        // Para otros tipos de archivos, mantener la verificación original
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

      // Aplanar el array de arrays de archivos convertidos
      const allConvertedFiles = newConverted
        .filter(Boolean)
        .reduce((acc, curr) => acc.concat(curr), [])

      if (allConvertedFiles.length === 0) {
        throw new Error('No se pudo convertir ningún archivo')
      }

      const newPreviews = await Promise.all(
        allConvertedFiles.map((file) => generatePreview(file))
      )
      const newDimensions = await Promise.all(
        allConvertedFiles.map(getDimensions)
      )

      setConvertedFiles((prev) => [...prev, ...allConvertedFiles])
      setPreviews((prev) => ({
        ...prev,
        converted: [...prev.converted, ...newPreviews]
      }))
      setDimensions((prev) => ({
        ...prev,
        converted: [...prev.converted, ...newDimensions]
      }))

      onFilesChange([...convertedFiles, ...allConvertedFiles])
    } catch (err) {
      console.error('Error al convertir archivos:', err)
      setError(err.message)
    } finally {
      setLoading((prev) => ({ ...prev, convert: false }))
    }
  }

  const removeFile = (index, type) => {
    try {
      if (type === 'original') {
        // Revocar URL de vista previa antes de eliminar
        const previewUrl = previews.original[index]
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)

        setOriginalFiles((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => ({
          ...prev,
          original: prev.original.filter((_, i) => i !== index)
        }))
        setDimensions((prev) => ({
          ...prev,
          original: prev.original.filter((_, i) => i !== index)
        }))
        // Cerrar el lightbox si está abierto
        setLightbox((prev) => ({ ...prev, open: false }))
      } else {
        // Revocar URL de vista previa antes de eliminar
        const previewUrl = previews.converted[index]
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)

        setConvertedFiles((prev) => prev.filter((_, i) => i !== index))
        setPreviews((prev) => ({
          ...prev,
          converted: prev.converted.filter((_, i) => i !== index)
        }))
        setDimensions((prev) => ({
          ...prev,
          converted: prev.converted.filter((_, i) => i !== index)
        }))
        // Cerrar el lightbox si está abierto
        setLightbox((prev) => ({ ...prev, open: false }))
      }
    } catch (err) {
      setError('Error al eliminar el archivo: ' + err.message)
      console.error('Error al eliminar archivo:', err)
    }
  }

  const removeAllFiles = (type) => {
    try {
      if (type === 'original') {
        // Revocar URLs de vista previa antes de eliminar
        previews.original.forEach((preview) => {
          if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
        })
        setOriginalFiles([])
        setPreviews((prev) => ({ ...prev, original: [] }))
        setDimensions((prev) => ({ ...prev, original: [] }))
        // Cerrar el lightbox si está abierto
        setLightbox((prev) => ({ ...prev, open: false }))
      } else {
        // Revocar URLs de vista previa antes de eliminar
        previews.converted.forEach((preview) => {
          if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
        })
        setConvertedFiles([])
        setPreviews((prev) => ({ ...prev, converted: [] }))
        setDimensions((prev) => ({ ...prev, converted: [] }))
        // Cerrar el lightbox si está abierto
        setLightbox((prev) => ({ ...prev, open: false }))
      }
    } catch (err) {
      setError('Error al eliminar los archivos: ' + err.message)
      console.error('Error al eliminar archivos:', err)
    }
  }

  const openLightbox = async (index, images, type = 'original') => {
    try {
      // Desactivar el lightbox mientras se procesan las imágenes
      setLightbox((prev) => ({ ...prev, open: false }))

      // Obtener los archivos correspondientes
      const files = type === 'original' ? originalFiles : convertedFiles

      // Filtrar solo los archivos que pueden ser mostrados en el Lightbox
      const supportedFiles = files.filter((file) => {
        const fileType = file.type.toLowerCase()
        return fileType.startsWith('image/') && !fileType.includes('tiff')
      })

      // Procesar las imágenes
      const lightboxImages = await Promise.all(
        supportedFiles.map(async (file) => {
          try {
            // Crear una nueva URL de blob directamente desde el archivo
            const newUrl = URL.createObjectURL(file)
            return { src: newUrl }
          } catch (error) {
            console.error('Error al procesar imagen para lightbox:', error)
            return null
          }
        })
      )

      // Filtrar imágenes nulas y actualizar el lightbox
      const validImages = lightboxImages.filter(Boolean)
      if (validImages.length === 0) {
        throw new Error('No se pudieron cargar las imágenes')
      }

      setLightbox({
        open: true,
        index: Math.min(index, validImages.length - 1),
        images: validImages
      })
    } catch (error) {
      console.error('Error al abrir lightbox:', error)
      setError('Error al mostrar las imágenes: ' + error.message)
    }
  }

  return (
    <div className="mb-4">
      <h4 className="mb-3">Archivos</h4>

      <FileUploader loading={loading} onFileChange={handleFileChange} />

      {(originalFiles.length > 0 || convertedFiles.length > 0) && (
        <>
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
            </>
          )}

          {convertedFiles.length > 0 && (
            <>
              <FilePreviewGrid
                files={convertedFiles}
                previewUrls={previews.converted}
                dimensions={dimensions.converted}
                title={`Archivos Convertidos (${convertedFiles.length} ${
                  convertedFiles.length === 1 ? 'archivo' : 'archivos'
                })`}
                type="converted"
                loading={loading.convert}
                onRemove={removeFile}
                onPreviewClick={openLightbox}
              />
            </>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <FileActions
            loading={loading}
            originalFilesCount={originalFiles.length}
            convertedFilesCount={convertedFiles.length}
            onConvert={handleConvert}
            onRemoveAll={removeAllFiles}
          />
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
