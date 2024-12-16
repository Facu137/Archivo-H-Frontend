// src/routes/VerArchivo/VerArchivo.jsx
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PdfViewer from './PdfViewer'
import ImageViewer from './ImageViewer'

const supportedImageTypes = ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'tif', 'avif']
const supportedFileTypes = ['pdf', ...supportedImageTypes]

export const VerArchivo = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const fileUrl = queryParams.get('file')
  const initialFileType = queryParams.get('type')
  const [fileType, setFileType] = useState(initialFileType)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const detectFileType = async (url) => {
      try {
        setIsLoading(true)
        setError(null)

        // If we have a type from the URL, validate it
        if (initialFileType) {
          const type = initialFileType.toLowerCase()
          if (supportedFileTypes.includes(type)) {
            setFileType(type)
            setIsLoading(false)
            return
          }
        }

        // Extract extension from URL
        const fileExtension = url.split('.').pop().toLowerCase()

        // Validate file existence and type
        const response = await fetch(url, { method: 'HEAD' })
        if (!response.ok) {
          throw new Error('No se pudo acceder al archivo')
        }

        const contentType = response.headers.get('content-type')

        // Handle AVIF specifically
        if (fileExtension === 'avif' || contentType === 'image/avif') {
          setFileType('avif')
        }
        // Handle other image types
        else if (contentType.startsWith('image/')) {
          const ext = fileExtension || contentType.split('/')[1]
          if (supportedImageTypes.includes(ext)) {
            setFileType(ext)
          } else {
            throw new Error('Formato de imagen no soportado')
          }
        }
        // Handle PDF
        else if (contentType === 'application/pdf') {
          setFileType('pdf')
        } else {
          throw new Error('Tipo de archivo no soportado')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (fileUrl) {
      detectFileType(fileUrl)
    }
  }, [fileUrl, initialFileType])

  if (isLoading) {
    return <div className="text-center p-4">Cargando archivo...</div>
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>
  }

  if (!fileUrl || !fileType) {
    return (
      <div className="alert alert-warning m-4">
        No se ha proporcionado ningún archivo.
      </div>
    )
  }

  return (
    <div>
      {fileType === 'pdf' && <PdfViewer fileUrl={fileUrl} />}
      {supportedImageTypes.includes(fileType) && (
        <ImageViewer fileUrl={fileUrl} />
      )}
      {fileType && !supportedFileTypes.includes(fileType) && (
        <div className="alert alert-warning m-4">
          Extensión de archivo no compatible: {fileType}
        </div>
      )}
    </div>
  )
}
