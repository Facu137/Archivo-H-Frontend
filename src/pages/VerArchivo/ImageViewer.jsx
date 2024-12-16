import React, { useEffect, useState, useRef } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import {
  Card,
  Container,
  Form,
  Row,
  Col,
  Button,
  ButtonGroup,
  InputGroup
} from 'react-bootstrap'
import { BiZoomIn, BiZoomOut, BiReset } from 'react-icons/bi'
import { MdInvertColors } from 'react-icons/md'
import { BsBrightnessHigh, BsSearch } from 'react-icons/bs'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'
import './ImageViewer.css'

const ImageViewer = ({ fileUrl, imageList }) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isNegative, setIsNegative] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const transformComponentRef = useRef(null)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    if (fileUrl) {
      setImageSrc(fileUrl)
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

  const handleZoomChange = (value) => {
    if (transformComponentRef.current) {
      const newZoom = parseFloat(value)
      setZoomLevel(newZoom)
      transformComponentRef.current.zoomTo(newZoom)
    }
  }

  const handleZoomIn = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.zoomIn()
      setZoomLevel((prev) => Math.min(prev + 0.25, 5))
    }
  }

  const handleZoomOut = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.zoomOut()
      setZoomLevel((prev) => Math.max(prev - 0.25, 1))
    }
  }

  const handleReset = () => {
    if (transformComponentRef.current) {
      transformComponentRef.current.resetTransform()
      setZoomLevel(1)
      setBrightness(100)
      setIsNegative(0)
    }
  }

  const handleImageSearch = (e) => {
    e.preventDefault()
    const number = parseInt(searchQuery)
    if (number > 0 && number <= imageList.length) {
      setCurrentImageIndex(number - 1)
    }
  }

  return (
    <Container fluid className="py-3">
      <Row>
        <Col md={3}>
          <Card className={isDarkMode ? 'bg-dark text-light' : 'bg-light'}>
            <Card.Body>
              <h5 className="mb-3">Navegación de Imágenes</h5>
              <p className="text-center mb-3">
                Total de imágenes: {imageList?.length || 0}
              </p>

              <Form onSubmit={handleImageSearch} className="mb-3">
                <InputGroup>
                  <Form.Control
                    type="number"
                    placeholder="Buscar por número..."
                    min="1"
                    max={imageList?.length || 1}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                    type="submit"
                  >
                    <BsSearch />
                  </Button>
                </InputGroup>
              </Form>

              <div className="thumbnails-container">
                {imageList?.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <span className="thumbnail-number">{index + 1}</span>
                    <img src={img} alt={`Imagen ${index + 1}`} />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Card className={isDarkMode ? 'bg-dark text-light' : 'bg-light'}>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={12} className="d-flex align-items-center flex-wrap">
                  <Form.Group className="d-flex align-items-center me-3 mb-2">
                    <Form.Label className="me-2 mb-0">Zoom:</Form.Label>
                    <Form.Range
                      value={zoomLevel}
                      onChange={(e) => handleZoomChange(e.target.value)}
                      min={1}
                      max={5}
                      step={0.1}
                      className="me-2"
                      style={{ width: '150px' }}
                    />
                    <span className="ms-2">
                      {(zoomLevel * 100).toFixed(0)}%
                    </span>
                  </Form.Group>

                  <Form.Group className="d-flex align-items-center me-3 mb-2">
                    <MdInvertColors className="me-2" />
                    <Form.Range
                      value={isNegative}
                      onChange={(e) =>
                        setIsNegative(parseFloat(e.target.value))
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      style={{ width: '100px' }}
                    />
                  </Form.Group>

                  <Form.Group className="d-flex align-items-center mb-2">
                    <BsBrightnessHigh className="me-2" />
                    <Form.Range
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      min={50}
                      max={150}
                      step={1}
                      style={{ width: '100px' }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="image-viewer-container">
                <TransformWrapper
                  ref={transformComponentRef}
                  initialScale={1}
                  minScale={1}
                  maxScale={5}
                  wheel={{ smoothStep: 0.05 }}
                  centerOnInit={true}
                  limitToBounds={true}
                  panning={{ activationKeys: [], velocityDisabled: true }}
                  doubleClick={{ mode: 'reset' }}
                  onInit={(ref) => {
                    setTimeout(() => {
                      if (ref) {
                        ref.centerView()
                        // Ajustar el zoom inicial para que la imagen se vea completa
                        const wrapper =
                          document.querySelector('.transform-wrapper')
                        const img = wrapper?.querySelector('img')
                        if (img && wrapper) {
                          const scale = Math.min(
                            wrapper.clientWidth / img.naturalWidth,
                            wrapper.clientHeight / img.naturalHeight
                          )
                          ref.zoomTo(scale)
                          setZoomLevel(scale)
                        }
                      }
                    }, 100)
                  }}
                >
                  <TransformComponent
                    wrapperClass="transform-wrapper"
                    contentClass="transform-content"
                  >
                    <div className="image-container">
                      {imageSrc ? (
                        <>
                          <img
                            src={imageSrc}
                            alt="Documento"
                            style={{
                              filter: `invert(${isNegative * 100}%) brightness(${brightness}%)`,
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain'
                            }}
                          />
                          <div className="watermark-diagonal">
                            Archivo Histórico de Santiago del Estero
                          </div>
                        </>
                      ) : (
                        <p>Cargando imagen...</p>
                      )}
                    </div>
                  </TransformComponent>
                </TransformWrapper>
              </div>

              <Row className="mt-3">
                <Col className="d-flex justify-content-center">
                  <ButtonGroup>
                    <Button
                      variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                      onClick={handleZoomIn}
                      title="Acercar"
                    >
                      <BiZoomIn />
                    </Button>
                    <Button
                      variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                      onClick={handleZoomOut}
                      title="Alejar"
                    >
                      <BiZoomOut />
                    </Button>
                    <Button
                      variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                      onClick={handleReset}
                      title="Restablecer"
                    >
                      <BiReset />
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

ImageViewer.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  imageList: PropTypes.arrayOf(PropTypes.string)
}

ImageViewer.defaultProps = {
  imageList: []
}

export default ImageViewer
