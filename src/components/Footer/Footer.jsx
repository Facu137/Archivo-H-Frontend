// src/components/Footer/Footer.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaMapMarkerAlt, FaPhone, FaFacebookF } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './Footer.css'

export const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`footer ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="footer-container">
        <div className="footer-cards">
          <div className="footer-card">
            <FaMapMarkerAlt className="footer-icon" />
            <h3>Dirección</h3>
            <p>Mitre 127, Santiago del Estero, Argentina</p>
          </div>
          <div className="footer-card">
            <FaPhone className="footer-icon" />
            <h3>Contacto</h3>
            <p>(0385) 428 8472</p>
          </div>
          <div className="footer-card">
            <FaFacebookF className="footer-icon" />
            <h3>Facebook</h3>
            <p>
              <a
                href="https://www.facebook.com/profile.php?id=100070518997083"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visitanos
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        © {new Date().getFullYear()} Archivo Histórico de Santiago del Estero.
        Todos los derechos reservados.
        <Link to="/desarrolladores" className="contact-button">
          Contacto
        </Link>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
}

export default Footer
