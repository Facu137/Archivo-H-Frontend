import imageCompression from 'browser-image-compression'
import UTIF from 'utif'

/**
 * Convierte un archivo TIFF a un objeto Blob
 * @param {File} file - Archivo de imagen TIFF
 * @returns {Promise<Blob>} - Blob con la imagen convertida
 */
const convertTiffToBlob = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        console.log('Procesando archivo TIFF:', file.name)
        const buffer = e.target.result
        console.log('Buffer leído:', buffer.byteLength, 'bytes')

        const ifds = UTIF.decode(buffer)
        console.log('IFDs decodificados:', ifds)

        if (!ifds || ifds.length === 0) {
          throw new Error('No se pudo decodificar el archivo TIFF')
        }

        const firstPage = ifds[0]
        console.log('Primera página TIFF:', firstPage)

        // Intentar obtener las dimensiones de diferentes propiedades
        const width = firstPage.width || firstPage.Width || firstPage.t256?.[0]
        const height =
          firstPage.height || firstPage.Height || firstPage.t257?.[0]

        console.log('Dimensiones detectadas:', { width, height })

        if (!width || !height) {
          throw new Error(`Dimensiones de imagen inválidas: ${width}x${height}`)
        }

        // Decodificar la imagen TIFF
        console.log('Decodificando imagen...')
        UTIF.decodeImage(buffer, firstPage)

        console.log('Convirtiendo a RGBA8...')
        const rgba = UTIF.toRGBA8(firstPage)
        console.log('Datos RGBA:', {
          length: rgba?.length,
          expectedLength: width * height * 4
        })

        if (!rgba || rgba.length === 0) {
          throw new Error('No se pudieron obtener los datos RGBA de la imagen')
        }

        // Crear un canvas con las dimensiones correctas
        console.log('Creando canvas...')
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        // Crear ImageData y establecer los datos RGBA
        console.log('Creando ImageData...')
        const imageData = new ImageData(
          new Uint8ClampedArray(rgba),
          width,
          height
        )

        // Verificar que los datos de la imagen son válidos
        if (imageData.data.length !== width * height * 4) {
          throw new Error(
            `Datos de imagen inconsistentes. Esperado: ${width * height * 4}, Actual: ${
              imageData.data.length
            }`
          )
        }

        ctx.putImageData(imageData, 0, 0)

        // Convertir el canvas a blob con calidad máxima
        console.log('Convirtiendo a PNG...')
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('No se pudo crear el blob de la imagen'))
              return
            }
            console.log('Conversión exitosa:', blob.size, 'bytes')
            resolve(blob)
          },
          'image/png',
          1.0
        )
      } catch (error) {
        console.error('Error detallado al procesar archivo TIFF:', error)
        reject(error)
      }
    }
    reader.onerror = (error) => {
      console.error('Error al leer archivo TIFF:', error)
      reject(error)
    }
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Comprime y optimiza una imagen para uso web
 * @param {File} file - Archivo de imagen original
 * @returns {Promise<File>} - Archivo comprimido en formato WebP
 */
export const convertToWebp = async (file) => {
  // Si es PDF, retornamos el archivo original
  if (file.type === 'application/pdf') {
    return file
  }

  let imageToProcess = file

  // Si es TIFF, primero lo convertimos a un formato que browser-image-compression pueda manejar
  if (
    file.type === 'image/tiff' ||
    file.name.toLowerCase().endsWith('.tiff') ||
    file.name.toLowerCase().endsWith('.tif')
  ) {
    const blob = await convertTiffToBlob(file)
    imageToProcess = new File([blob], file.name, { type: 'image/png' })
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.8,
    alwaysKeepResolution: true
  }

  try {
    const compressedFile = await imageCompression(imageToProcess, options)

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
