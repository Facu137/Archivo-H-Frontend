// src/components/Footer/Footer.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { FaMapMarkerAlt, FaPhone, FaFacebookF } from 'react-icons/fa'
import logo from '../../assets/logo.svg'
import './Footer.css'

export const Footer = ({ isDarkMode }) => {
  return (
    <footer
      className={`footer py-5 ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}
    >
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="d-flex align-items-center">
              <img
                src={logo}
                alt="Logo"
                className="footer-logo me-3"
                style={{ height: '50px' }}
              />
              <h5 className="mb-0 text-start text-uppercase footer-brand fw-bold">
                Archivo Histórico Santiago del Estero
              </h5>
            </div>
            <p className="mt-3 text-start">
              Fundado el 26 de Agosto de 1910, el Archivo General de Santiago
              del Estero preserva y gestiona documentos históricos fundamentales
              para nuestra provincia.
            </p>
          </div>

          <div className="col-lg-4 mb-4 mb-lg-0">
            <div
              className={`contact-info ${isDarkMode ? 'text-light' : 'text-dark'}`}
            >
              <h5 className="mb-3 fw-bold">Información de Contacto</h5>
              <div className="d-flex align-items-center mb-2">
                <FaMapMarkerAlt className="me-2" />
                <p className="mb-0">
                  Mitre 127, Santiago del Estero, Argentina
                </p>
              </div>
              <div className="d-flex align-items-center mb-2">
                <FaPhone className="me-2" />
                <p className="mb-0">(0385) 428 8472</p>
              </div>
              <div className="d-flex align-items-center">
                <FaFacebookF className="me-2" />
                <a
                  href="https://www.facebook.com/profile.php?id=100070518997083"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isDarkMode ? 'text-light' : 'text-dark'}`}
                >
                  Síguenos en Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <h5 className="mb-3 fw-bold">Ubicación</h5>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3544.0538989204447!2d-64.26168392396726!3d-27.786827876137036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x943b523c3c8af9e3%3A0x8f5a2f4aa3f73e65!2sMitre%20127%2C%20Santiago%20del%20Estero!5e0!3m2!1ses!2sar!4v1701878046457!5m2!1ses!2sar"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <hr className={`${isDarkMode ? 'border-light' : 'border-dark'}`} />
            <p className="text-center mb-0">
              &copy; {new Date().getFullYear()} Archivo Histórico de Santiago
              del Estero. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  isDarkMode: PropTypes.bool.isRequired
}

export default Footer
