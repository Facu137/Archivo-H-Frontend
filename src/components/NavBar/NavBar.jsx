// src\components\NavBar\NavBar.jsx
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
  faCog,
  faBars
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.svg'
import './NavBar.css'

export const NavBar = ({ toggleSidebar, toggleDarkMode, isDarkMode }) => {
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [showSearchRow, setShowSearchRow] = useState(false)

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
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isAdminOrEmployee =
    user && (user.role === 'administrador' || user.role === 'empleado')

  const Title = () => (
    <h1 className="title">
      {isMobile ? (
        <></>
      ) : (
        <>
          ARCHIVO HISTORICO
          <br />
          SANTIAGO DEL ESTERO
        </>
      )}
    </h1>
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
                <FontAwesomeIcon icon={faBars} />
                {!isMobile && <span className="nav-text">Administración</span>}
              </button>
            )}
            <Link to="/institucional" className="nav-button">
              <FontAwesomeIcon icon={faBuilding} />
              {!isMobile && <span className="nav-text">Institucional</span>}
            </Link>
            <button
              onClick={() => setShowSearchRow(!showSearchRow)}
              className="nav-button"
            >
              <FontAwesomeIcon icon={faSearch} />
              {!isMobile && <span className="nav-text">Buscar</span>}
            </button>
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
        {showSearchRow && (
          <div className="search-row">
            <input type="text" placeholder="Buscar" id="search-input" />
            <button type="submit" className="search-button">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <button className="advanced-search-button">
              <FontAwesomeIcon icon={faCog} />
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}

NavBar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired
}

export default NavBar
