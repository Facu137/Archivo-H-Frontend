import imageCompression from 'browser-image-compression'
import UTIF from 'utif'
import * as pdfjsLib from 'pdfjs-dist'

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

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
 * Convierte una página de PDF a un objeto Blob
 * @param {File} file - Archivo PDF original
 * @param {number} pageNumber - Número de página a convertir
 * @param {number} scale - Escala de renderizado (1 = tamaño original)
 * @returns {Promise<Blob>} - Blob con la imagen de la página
 */
const convertPdfPageToBlob = async (file, pageNumber, scale = 2) => {
  try {
    // Crear una nueva copia del buffer para cada página
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale })

    // Crear canvas
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const context = canvas.getContext('2d')

    // Renderizar página
    await page.render({
      canvasContext: context,
      viewport
    }).promise

    // Convertir a blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    })
  } catch (error) {
    console.error('Error al convertir página PDF:', error)
    throw error
  }
}

/**
 * Verifica si un archivo es de tipo TIFF
 * @param {File} file - Archivo a verificar
 * @returns {boolean} - true si es TIFF, false si no
 */
const isTiffFile = (file) => {
  if (!file) return false
  return (
    file.type === 'image/tiff' ||
    (file.name &&
      (file.name.toLowerCase().endsWith('.tiff') ||
        file.name.toLowerCase().endsWith('.tif')))
  )
}

/**
 * Genera una vista previa del archivo
 * @param {File} file - Archivo a previsualizar
 * @returns {Promise<string>} - URL de la vista previa
 */
export const generatePreview = async (file) => {
  try {
    if (!file) {
      throw new Error('Archivo no válido')
    }

    if (file.type === 'application/pdf') {
      return URL.createObjectURL(file)
    }

    if (isTiffFile(file)) {
      const blob = await convertTiffToBlob(file)
      return URL.createObjectURL(blob)
    }

    return URL.createObjectURL(file)
  } catch (error) {
    console.error('Error al generar vista previa:', error)
    throw error
  }
}

/**
 * Convierte un archivo a WebP
 * @param {File} file - Archivo original
 * @returns {Promise<File[]>} - Array de archivos convertidos a WebP
 */
export const convertToWebp = async (file) => {
  try {
    if (!file) {
      throw new Error('Archivo no válido')
    }

    if (file.type === 'application/pdf') {
      // Obtener el número de páginas del PDF
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages
      const convertedPages = []

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const pageBlob = await convertPdfPageToBlob(file, pageNum)
        const pageFile = new File(
          [pageBlob],
          `${file.name.replace('.pdf', '')}_pag${pageNum}.webp`,
          {
            type: 'image/webp'
          }
        )

        // Comprimir la imagen de la página
        const compressedFile = await imageCompression(pageFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 3000,
          useWebWorker: true,
          fileType: 'image/webp'
        })

        convertedPages.push(compressedFile)
      }

      return convertedPages
    } else if (isTiffFile(file)) {
      const blob = await convertTiffToBlob(file)
      const pngFile = new File(
        [blob],
        file.name.replace(/\.(tiff|tif)$/i, '.webp'),
        {
          type: 'image/webp'
        }
      )

      const compressedFile = await imageCompression(pngFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: 3000,
        useWebWorker: true,
        fileType: 'image/webp'
      })

      return [compressedFile]
    } else {
      // Comprimir y convertir a WebP
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 3000,
        useWebWorker: true,
        fileType: 'image/webp'
      })

      // Asegurar que el archivo tenga extensión .webp
      const newFileName = file.name.replace(/\.[^/.]+$/, '.webp')
      const webpFile = new File([compressedFile], newFileName, {
        type: 'image/webp'
      })

      return [webpFile]
    }
  } catch (error) {
    console.error('Error en convertToWebp:', error)
    throw error
  }
}
