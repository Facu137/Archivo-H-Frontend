// src/components/Footer/Footer.jsx
import React from 'react'
import PropTypes from 'prop-types'
import './Footer.css'

export const Footer = ({ isDarkMode }) => {
  return (
    <footer className={`footer ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="footer-container">
        <div className="footer-cards">
          <div className="footer-card">
            <h3>Dirección</h3>
            <p>Mitre 127, Santiago del Estero, Argentina</p>
          </div>
          <div className="footer-card">
            <h3>Contacto</h3>
            <p>(0385) 428 8472</p>
          </div>
          <div className="footer-card">
            <h3>Facebook</h3>
            <p>
              <a href="https://www.facebook.com/profile.php?id=100070518997083">
                <i className="fab fa-facebook-f"></i> Visitanos
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </footer>
  )
}
Footer.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
}

export default Footer
