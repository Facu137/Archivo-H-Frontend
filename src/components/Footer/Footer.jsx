import React from 'react';
import './Footer.css';
import buildingImage from '../../assets/logo.png';
import '@fortawesome/fontawesome-free/css/all.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={buildingImage} alt="Logo" />
        </div>

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
            <a href="https://www.facebook.com/profile.php?id=100070518997083">
              <i className="fab fa-facebook-f"></i> Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};