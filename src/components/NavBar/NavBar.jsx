// src/components/NavBar/NavBar.jsx
import React from 'react';
import './NavBar.css';
import PropTypes from 'prop-types';
import logo from '../../assets/logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBuilding,
  faSun,
  faMoon,
  faUser,
  faSignInAlt,
  faSearch,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

export const NavBar = ({ toggleSidebar, toggleDarkMode, isDarkMode }) => {
  const { user } = useAuth();

  const handleAccountClick = () => {
    if (user) {
      toggleSidebar();
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <header className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <nav>
        <div className="angry-grid">
          <div id="item-0" className="logo">
            <div className="logo-container">
              <img src={logo} alt="Logo" />
            </div>
          </div>
          <div id="item-1" className="title-container">
            <span className="logo-title">ARCHIVO HISTORICO SANTIAGO DEL ESTERO</span>
          </div>
          <div id="item-2" className="navbar-container">
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
          <div id="item-3" className="search-container">
            <input type="text" placeholder="Buscar" className="search-input" />
            <button type="submit" className="search-button">
              <FontAwesomeIcon icon={faSearch} />
              <span className="nav-text">Buscar</span>
            </button>
            <button className="advanced-search-button">
              <FontAwesomeIcon icon={faCog} />
              <span className="nav-text">Búsqueda Avanzada</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

NavBar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired
};

export default NavBar;
