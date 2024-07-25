import React from 'react'
import './NavBar.css'
import PropTypes from 'prop-types'
import logo from '../../assets/logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faBuilding,
  faSun,
  faMoon,
  faUser,
  faSignInAlt,
  faSearch,
  faCog
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../../context/AuthContext'

export const NavBar = ({ toggleSidebar, toggleDarkMode, isDarkMode }) => {
  const { user } = useAuth()

  const handleAccountClick = () => {
    if (user) {
      toggleSidebar()
    } else {
      window.location.href = '/login'
    }
  }

  return (
    <header className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className="top-section">
        <div className="logo-title-container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <h2 className="archivo-historico-text">ARCHIVO HISTORICO SANTIAGO DEL ESTERO</h2>
        </div>
      </div>
      <div className="bottom-section">
        <div className="search-container">
          <input type="text" placeholder="Buscar" className="search-input" />
          <button type="submit" className="search-button">
            <FontAwesomeIcon icon={faSearch} />
            <span className="nav-text"></span>
          </button>
          <button className="advanced-search-button">
            <FontAwesomeIcon icon={faCog} />
            <span className="nav-text"></span>
          </button>
        </div>
        <div className="nav-buttons-container">
          <button
            onClick={() => (window.location.href = '/')}
            className="nav-button"
          >
            <FontAwesomeIcon icon={faHome} />
            <span className="nav-text">Inicio</span>
          </button>
          <button
            onClick={() => (window.location.href = '/institucional')}
            className="nav-button"
          >
            <FontAwesomeIcon icon={faBuilding} />
            <span className="nav-text">Institucional</span>
          </button>
          <button onClick={toggleDarkMode} className="nav-button">
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            <span className="nav-text">
              {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </span>
          </button>
          <button onClick={handleAccountClick} className="nav-button">
            <FontAwesomeIcon icon={user ? faUser : faSignInAlt} />
            <span className="nav-text">
              {user ? 'Cuenta' : 'Iniciar sesión'}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

NavBar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired
}
