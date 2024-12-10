/**
 * Convierte una imagen a formato AVIF
 * @param {File} file - Archivo de imagen original
 * @returns {Promise<File>} - Archivo convertido a AVIF
 */
export const convertToAVIF = async (file) => {
  // Si es PDF, retornamos el archivo original
  if (file.type === 'application/pdf') {
    return file
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const img = new Image()
        img.src = e.target.result

        await new Promise((resolve) => {
          img.onload = resolve
        })

        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)

        const blob = await new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob), 'image/avif', 0.065)
        })

        // Crear un nuevo archivo con el mismo nombre pero extensión .avif
        const fileName = file.name.replace(/\.[^/.]+$/, '.avif')
        const convertedFile = new File([blob], fileName, {
          type: 'image/avif',
          lastModified: new Date().getTime()
        })

        resolve(convertedFile)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
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
