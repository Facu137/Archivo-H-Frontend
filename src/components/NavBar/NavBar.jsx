// src/components/NavBar/NavBar.jsx
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const navbarToggler = useRef(null)

  const closeNavbar = () => {
    if (window.innerWidth < 992) {
      // Bootstrap lg breakpoint
      navbarToggler.current?.click()
    }
  }

  const handleAccountClick = () => {
    closeNavbar()
    if (user) {
      toggleSidebar('right')
    } else {
      navigate('/login')
    }
  }

  const handleAdminClick = () => {
    closeNavbar()
    if (user) {
      toggleSidebar('left')
    }
  }

  const handleDarkModeClick = () => {
    closeNavbar()
    toggleDarkMode()
  }

  const isAdminOrEmployee =
    user && (user.rol === 'administrador' || user.rol === 'empleado')

  return (
    <nav
      className={`navbar navbar-expand-lg sticky-top ${
        isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'
      }`}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          onClick={closeNavbar}
        >
          <img src={logo} alt="Logo" className="navbar-logo" />
          <h6>
            ARCHIVO HISTORICO
            <br />
            SANTIAGO DEL ESTERO
          </h6>
        </Link>

        <button
          ref={navbarToggler}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAdminOrEmployee && (
              <li className="nav-item">
                <button onClick={handleAdminClick} className="nav-link">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  <span>Administración</span>
                </button>
              </li>
            )}
            <li className="nav-item">
              <Link
                to="/institucional"
                className="nav-link"
                onClick={closeNavbar}
              >
                <FontAwesomeIcon icon={faBuilding} className="me-2" />
                <span>Institucional</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/buscador" className="nav-link" onClick={closeNavbar}>
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                <span>Buscar</span>
              </Link>
            </li>
            <li className="nav-item">
              <button onClick={handleDarkModeClick} className="nav-link">
                <FontAwesomeIcon
                  icon={isDarkMode ? faSun : faMoon}
                  className="me-2"
                />
                <span>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
              </button>
            </li>
            <li className="nav-item">
              <button onClick={handleAccountClick} className="nav-link">
                <FontAwesomeIcon
                  icon={user ? faUser : faSignInAlt}
                  className="me-2"
                />
                <span>{user ? 'Mi Cuenta' : 'Iniciar sesión'}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

NavBar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired
}

export default NavBar
