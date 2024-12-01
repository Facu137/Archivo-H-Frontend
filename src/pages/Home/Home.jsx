// src/pages/Home/Home.jsx
import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import entrada from '../../assets/entrada.avif'
import { FaSearch } from 'react-icons/fa'

export const Home = () => {
  const { isDarkMode } = useTheme()
  const navigate = useNavigate()

  const handleSearchClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    navigate('/buscador')
  }

  return (
    <div className={isDarkMode ? 'bg-dark text-white' : 'bg-light text-dark'}>
      {/* Hero Section */}
      <div
        className="position-relative vh-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: `url(${entrada})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Container className="position-relative">
          <Row className="justify-content-center">
            <Col xs={12} className="text-center">
              <div
                className="mx-auto p-4"
                style={{
                  backgroundColor: isDarkMode
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'rgba(255, 255, 255, 0.7)',
                  border: isDarkMode ? '2px solid white' : '3px solid black',
                  maxWidth: '800px'
                }}
              >
                <h1
                  className={`fw-bold mb-0 ${
                    isDarkMode ? 'text-white' : 'text-dark'
                  }`}
                >
                  PATRIMONIO
                  <br />
                  HISTÓRICO Y
                  <br />
                  CULTURAL
                </h1>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Quotes Section */}
      <Container className="py-5">
        <Row className="justify-content-center g-4">
          <Col xs={12} md={6}>
            <Card
              className={`h-100 shadow ${
                isDarkMode
                  ? 'bg-dark text-white border-secondary'
                  : 'bg-white border-dark'
              }`}
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                transition: 'all 0.3s ease'
              }}
            >
              <Card.Body className="d-flex flex-column">
                <div className="flex-grow-1">
                  <div className="position-relative">
                    <span
                      className={`fs-1 ${
                        isDarkMode ? 'text-secondary' : 'text-dark opacity-25'
                      }`}
                      style={{
                        position: 'absolute',
                        left: '-0.5rem',
                        top: '-0.5rem',
                        lineHeight: '1'
                      }}
                    >
                      &ldquo;
                    </span>
                    <Card.Text
                      className={`fs-5 fst-italic ps-4 pe-4 ${
                        isDarkMode ? 'text-light' : 'text-dark'
                      }`}
                    >
                      Un archivo con fondos no organizados y no descritos, es un
                      archivo mudo, ciego, inservible, que oculta información y
                      reduce, por no decir impide, la investigación.
                      <span
                        className={`fs-1 ${
                          isDarkMode ? 'text-secondary' : 'text-dark opacity-25'
                        }`}
                        style={{
                          position: 'absolute',
                          right: '-0.5rem',
                          bottom: '-1rem',
                          lineHeight: '1'
                        }}
                      >
                        &rdquo;
                      </span>
                    </Card.Text>
                  </div>
                </div>
                <footer
                  className={`blockquote-footer text-end mt-4 mb-2 me-3 ${
                    isDarkMode
                      ? 'text-light opacity-75'
                      : 'text-dark opacity-25'
                  }`}
                  style={{ borderRadius: '0.5rem' }}
                >
                  <cite title="Autor" className={`fs-6 fw-semibold text-white`}>
                    Juan Manuel Viaña
                  </cite>
                </footer>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card
              className={`h-100 shadow ${
                isDarkMode
                  ? 'bg-dark text-white border-secondary'
                  : 'bg-white border-dark'
              }`}
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                transition: 'all 0.3s ease'
              }}
            >
              <Card.Body className="d-flex flex-column">
                <div className="flex-grow-1">
                  <div className="position-relative">
                    <span
                      className={`fs-1 ${
                        isDarkMode ? 'text-secondary' : 'text-dark opacity-25'
                      }`}
                      style={{
                        position: 'absolute',
                        left: '-0.5rem',
                        top: '-0.5rem',
                        lineHeight: '1'
                      }}
                    >
                      &ldquo;
                    </span>
                    <Card.Text
                      className={`fs-5 fst-italic ps-4 pe-4 ${
                        isDarkMode ? 'text-light' : 'text-dark'
                      }`}
                    >
                      La Historia no puede resolverse sin acudir a los archivos.
                      No es suficiente un conocimiento superficial o aproximado,
                      por lo tanto es obligatorio consultar e interpretar los
                      documentos de la época del lugar que se pretende
                      investigar.
                      <span
                        className={`fs-1 ${
                          isDarkMode ? 'text-secondary' : 'text-dark opacity-25'
                        }`}
                        style={{
                          position: 'absolute',
                          right: '-0.5rem',
                          bottom: '-1rem',
                          lineHeight: '1'
                        }}
                      >
                        &rdquo;
                      </span>
                    </Card.Text>
                  </div>
                </div>
                <footer
                  className={`blockquote-footer text-end mt-4 mb-2 me-3 ${
                    isDarkMode
                      ? 'text-light opacity-75'
                      : 'text-dark opacity-25'
                  }`}
                  style={{ borderRadius: '0.5rem' }}
                >
                  <cite title="Autor" className={`fs-6 fw-semibold text-white`}>
                    Juan Manuel Viaña
                  </cite>
                </footer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Search Section */}
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col xs={12} md={8} lg={6}>
            <h2 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
              Explora Nuestra Historia
            </h2>
            <p className={`mb-4 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
              Descubre documentos históricos, fotografías y más en nuestro
              archivo digital.
            </p>
            <Button
              size="lg"
              variant={isDarkMode ? 'outline-light' : 'outline-dark'}
              onClick={handleSearchClick}
              className="d-inline-flex align-items-center gap-2"
            >
              <FaSearch /> Comenzar Búsqueda
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
