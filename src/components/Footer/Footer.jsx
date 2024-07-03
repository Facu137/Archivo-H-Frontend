import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src="/building.jpg" alt="Logo" />
        </div>

        <div className="footer-links">
          <ul>
            <li><a href="#">Acerca de Nosotros</a></li>
            <li><a href="#">Servicios</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <ul>
            <li><a href="#"><i class="fab fa-facebook-f"></i> Facebook</a></li>
            <li><a href="#"><i class="fab fa-twitter"></i> Twitter</a></li>
            <li><a href="#"><i class="fab fa-instagram"></i> Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-copyright">
        <p>&copy; 2024 Todos los derechos reservados. <a href="#">NOMBRE DE LA EMPRESA</a></p>
      </div>
    </footer>
  );
};
