import React from 'react';
import './Footer.css';
import buildingImage from '../../assets/logo.png';
import '@fortawesome/fontawesome-free/css/all.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
        <img src={buildingImage} alt="Logo" /> {/* Usa la imagen importada */}  
         </div>

        <div className="footer-links">
        <ul>
            <li>Mitre 127, Santiago del Estero, Argentina</li>
            <li>(0385) 428 8472</li>
          </ul>
        </div>

        <div className="footer-social">
          <ul>
            <li><a href="https://www.facebook.com/profile.php?id=100070518997083"><i class="fab fa-facebook-f"></i> Facebook</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
