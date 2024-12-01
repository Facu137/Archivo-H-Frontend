import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'
import img1728590488906 from '../../assets/1728590488906.avif'

const NotFound = () => {
  const { isDarkMode } = useTheme()

  return (
    <div
      className="position-relative vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${img1728590488906})`,
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
                className={`fw-bold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-dark'
                }`}
                style={{ fontSize: '4rem' }}
              >
                404
              </h1>
              <h2
                className={`fw-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-dark'
                }`}
              >
                Página No Encontrada
              </h2>
              <Link
                to="/"
                className={`btn ${
                  isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'
                } btn-lg`}
              >
                Volver al Inicio
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default NotFound
