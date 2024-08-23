import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faSun,
  faMoon,
  faUser,
  faSignInAlt,
  faSearch,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.svg'
import './NavBar.css'

export const NavBar = ({ toggleSidebar, toggleDarkMode, isDarkMode }) => {
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const handleAccountClick = () => {
    if (user) {
      toggleSidebar('right')
    } else {
      window.location.href = '/login'
    }
  }

  const handleAdminClick = () => {
    if (user) {
      toggleSidebar('left')
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1070)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isAdminOrEmployee =
    user && (user.role === 'administrador' || user.role === 'empleado')

  const Title = () => (
    <h6 className="title">
      {isMobile ? (
        <></>
      ) : (
        <>
          ARCHIVO HISTORICO
          <br />
          SANTIAGO DEL ESTERO
        </>
      )}
    </h6>
  )

  return (
    <header className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <nav className="navbar">
        <div className="first-row">
          <div className="logo-container">
            <Link to="/">
              <img src={logo} alt="Logo" className="logo" />
            </Link>
            <Link to="/">
              <Title />
            </Link>
          </div>

          <div className="spacer"></div>

          <div className="nav-links">
            {isAdminOrEmployee && (
              <button onClick={handleAdminClick} className="nav-button">
                <FontAwesomeIcon icon={faCog} />
                {!isMobile && <span className="nav-text">Administración</span>}
              </button>
            )}
            <button
              onClick={() => (window.location.href = '/institucional')}
              className="nav-button"
            >
              <FontAwesomeIcon icon={faBuilding} />
              {!isMobile && <span className="nav-text">Institucional</span>}
            </button>
            <Link to="/buscador" className="nav-button">
              {' '}
              {/* Cambio aquí */}
              <FontAwesomeIcon icon={faSearch} />
              {!isMobile && <span className="nav-text">Buscar</span>}
            </Link>
            <button onClick={toggleDarkMode} className="nav-button">
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
              {!isMobile && (
                <span className="nav-text">
                  {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
                </span>
              )}
            </button>
            <button onClick={handleAccountClick} className="nav-button">
              <FontAwesomeIcon icon={user ? faUser : faSignInAlt} />
              <span className="nav-text">
                {user ? 'Cuenta' : 'Iniciar sesión'}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

NavBar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired
}
