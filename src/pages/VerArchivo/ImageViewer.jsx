import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, ButtonGroup, Card } from 'react-bootstrap'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { BiZoomIn, BiZoomOut, BiReset, BiArrowBack } from 'react-icons/bi'
import { MdInvertColors } from 'react-icons/md'
import Tiff from 'tiff.js'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import ResultCard from '../Buscador/ResultCard'
import './ImageViewer.css'

const ImageViewer = ({ fileUrl, fileMetadata }) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [isNegative, setIsNegative] = useState(false)
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (fileUrl) {
      const fileExtension = fileUrl.split('.').pop().toLowerCase()
      if (fileExtension === 'tiff' || fileExtension === 'tif') {
        fetch(fileUrl)
          .then((response) => response.arrayBuffer())
          .then((buffer) => {
            const tiff = new Tiff({ buffer })
            const canvas = tiff.toCanvas()
            setImageSrc(canvas.toDataURL())
          })
          .catch((error) => {
            console.error('Error al cargar el archivo TIFF', error)
          })
      } else {
        setImageSrc(fileUrl)
      }
    }
  }, [fileUrl])

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault()
    const handleKeyDown = (e) => {
      if (
        e.key === 'PrintScreen' ||
        (e.ctrlKey && (e.key === 'p' || e.key === 's')) ||
        (e.metaKey && (e.key === 'p' || e.key === 's'))
      ) {
        e.preventDefault()
        alert('La captura de pantalla se encuentra deshabilitada')
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleBackClick = () => {
    navigate(-1)
  }

  return (
    <Container
      fluid
      className={`py-3 ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant={isDarkMode ? 'outline-light' : 'outline-dark'}
          onClick={handleBackClick}
        >
          <BiArrowBack /> Volver a la búsqueda
        </Button>
      </div>

      {fileMetadata && (
        <div className="mb-3">
          <ResultCard result={fileMetadata} />
        </div>
      )}

      <Card className={isDarkMode ? 'bg-dark text-light' : 'bg-light'}>
        <Card.Body>
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={5}
            wheel={{ disabled: false }}
            pinch={{ disabled: false }}
            pan={{ disabled: false }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="text-center mb-3">
                  <ButtonGroup>
                    <Button
                      variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                      onClick={() => zoomIn()}
                    >
                      <BiZoomIn /> Acercar
                    </Button>
                    <Button
                      variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                      onClick={() => zoomOut()}
                    >
                      <BiZoomOut /> Alejar
                    </Button>
                    <Button
                      variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                      onClick={() => resetTransform()}
                    >
                      <BiReset /> Restablecer
                    </Button>
                    <Button
                      variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                      onClick={() => setIsNegative(!isNegative)}
                    >
                      <MdInvertColors /> {isNegative ? 'Normal' : 'Negativo'}
                    </Button>
                  </ButtonGroup>
                </div>
                <TransformComponent>
                  <div
                    className={`image-container ${isNegative ? 'negative' : ''}`}
                  >
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt="Documento"
                        style={{
                          filter: isNegative ? 'invert(100%)' : 'none',
                          maxWidth: '100%',
                          height: 'auto'
                        }}
                      />
                    ) : (
                      <p>Cargando imagen...</p>
                    )}
                    {imageSrc && (
                      <div className="watermark">
                        Archivo Histórico de Santiago Del Estero
                      </div>
                    )}
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </Card.Body>
      </Card>
    </Container>
  )
}

ImageViewer.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  fileMetadata: PropTypes.object
}

export default ImageViewer
