import imageCompression from 'browser-image-compression'

/**
 * Comprime y optimiza una imagen para uso web
 * @param {File} file - Archivo de imagen original
 * @returns {Promise<File>} - Archivo comprimido en formato WebP
 */
export const convertToAVIF = async (file) => {
  // Si es PDF, retornamos el archivo original
  if (file.type === 'application/pdf') {
    return file
  }

  const options = {
    maxSizeMB: 1, // Tamaño máximo en MB
    maxWidthOrHeight: 2048, // Dimensión máxima
    useWebWorker: true, // Usar Web Worker para mejor rendimiento
    fileType: 'image/webp', // Convertir a WebP para mejor compresión y calidad
    initialQuality: 0.8, // Calidad inicial
    alwaysKeepResolution: true // Mantener resolución si es menor que maxWidthOrHeight
  }

  try {
    const compressedFile = await imageCompression(file, options)

    // Renombrar el archivo manteniendo el nombre original pero cambiando la extensión
    const fileName = file.name.replace(/\.[^/.]+$/, '.webp')
    return new File([compressedFile], fileName, {
      type: 'image/webp',
      lastModified: new Date().getTime()
    })
  } catch (error) {
    console.error('Error al comprimir la imagen:', error)
    throw error
  }
}

/**
 * Genera una vista previa del archivo
 * @param {File} file - Archivo a previsualizar
 * @returns {Promise<string>} - URL de la vista previa
 */
export const generatePreview = (file) => {
  return new Promise((resolve, reject) => {
    if (file.type === 'application/pdf') {
      resolve(URL.createObjectURL(file))
    } else {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    }
  })
}
