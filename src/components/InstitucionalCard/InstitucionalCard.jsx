import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ImageGallery from 'react-image-gallery' // Importa el componente de la galería
import 'react-image-gallery/styles/css/image-gallery.css' // Importa los estilos
import './InstitucionalCard.css'

const InstitucionalCard = ({ title, text, images }) => {
  const [setLoadedImages] = useState([])

  const handleImageLoad = (index) => {
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, index])
  }

  // Crear un array de objetos para react-image-gallery
  const galleryImages = images.map((image) => ({
    original: image,
    thumbnail: image // Aunque pasamos la miniatura, no se mostrará
  }))

  return (
    <div className="institucional-card">
      <div className="institucional-card-content">
        {galleryImages.length > 0 && (
          <div className="institucional-card-gallery">
            <ImageGallery
              items={galleryImages}
              showThumbnails={false} // Desactivar miniaturas
              showFullscreenButton={true} // Botón para pantalla completa
              showPlayButton={true} // Botón para reproducir la galería
              lazyLoad={true} // Cargar imágenes perezosamente
              onImageLoad={handleImageLoad}
            />
          </div>
        )}
        <div className="institucional-card-text">
          {title && <h2>{title}</h2>}
          {text && <p>{text}</p>}
        </div>
      </div>
    </div>
  )
}

InstitucionalCard.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string)
}

export default InstitucionalCard
