// src/routes/VerArchivo/VerArchivo.jsx
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PdfViewer from './PdfViewer' // Ruta actualizada
import ImageViewer from './ImageViewer' // Ruta actualizada

export const VerArchivo = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const fileUrl = queryParams.get('file')
  const initialFileType = queryParams.get('type')
  const [fileType, setFileType] = useState(initialFileType)

  useEffect(() => {
    if (fileUrl && !initialFileType) {
      const fileExtension = fileUrl.split('.').pop().toLowerCase()
      setFileType(fileExtension)
    }
  }, [fileUrl, initialFileType])

  return (
    <div>
      {fileType === 'pdf' && <PdfViewer fileUrl={fileUrl} />}
      {['jpg', 'jpeg', 'png', 'gif', 'tiff', 'tif'].includes(fileType) && (
        <ImageViewer fileUrl={fileUrl} />
      )}
      {!fileType && <p>No se ha proporcionado ningún archivo.</p>}
      {fileType &&
        !['pdf', 'jpg', 'jpeg', 'png', 'gif', 'tiff', 'tif'].includes(
          fileType
        ) && <p>Extensión de archivo no compatible.</p>}
    </div>
  )
}
