import React from 'react'
import './ContactDev.css'

const ContactDev = () => {
  return (
    <div className="contact-dev-container">
      <h2>Contacto Desarrolladores</h2>
      <p>
        Aquí puedes encontrar la información de contacto de los desarrolladores:
      </p>
      <ul>
        <li>
          <a
            href="https://github.com/tu-usuario-github"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </li>
        {/* Agrega más enlaces a otros perfiles o medios de contacto */}
      </ul>
    </div>
  )
}

export default ContactDev
