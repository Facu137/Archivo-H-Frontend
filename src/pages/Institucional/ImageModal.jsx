import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '../../context/ThemeContext'

const ImageModal = ({ image, title, onClose, isOpen }) => {
  const { isDarkMode } = useTheme()
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  if (!isOpen) return null

  const handleImageClick = (e) => {
    e.stopPropagation()
    // Cycle through zoom levels: 1 -> 1.5 -> 2 -> 1
    setZoomLevel((prev) => {
      const newZoom = prev >= 2 ? 1 : prev + 0.5
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 }) // Reset position when zoom is reset
      }
      return newZoom
    })
  }

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      e.stopPropagation()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="modal d-block"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 1050,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
      onClick={handleBackdropClick}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered m-0 mw-100 h-100">
        <div
          className={`modal-content border-0 h-100 ${
            isDarkMode ? 'bg-dark' : 'bg-light'
          }`}
          style={{ backgroundColor: 'transparent' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="modal-header border-0 bg-transparent"
            onClick={onClose}
            style={{ cursor: 'pointer' }}
            title="Haga clic en cualquier parte de esta barra para cerrar el visualizador"
          >
            <div className="d-flex align-items-center">
              <h5
                className={`modal-title text-${isDarkMode ? 'light' : 'dark'} mb-0`}
              >
                {title} {zoomLevel > 1 && `(${zoomLevel}x)`}
              </h5>
              <small
                className={`ms-3 text-${isDarkMode ? 'light' : 'dark'} text-opacity-75`}
              >
                (Clic aquí para cerrar)
              </small>
            </div>
            <button
              type="button"
              className={`btn-close ${isDarkMode ? 'btn-close-white' : ''} p-2`}
              onClick={onClose}
              aria-label="Cerrar visualizador"
              title="Cerrar visualizador"
              style={{
                backgroundColor: isDarkMode
                  ? 'rgba(255,255,255,0.8)'
                  : 'rgba(0,0,0,0.8)',
                padding: '0.75rem',
                borderRadius: '50%',
                opacity: 1
              }}
            ></button>
          </div>
          <div
            className="modal-body d-flex align-items-center justify-content-center p-0"
            style={{ overflow: 'hidden' }}
          >
            <img
              src={image}
              alt={title}
              className="img-fluid"
              loading="lazy"
              style={{
                maxHeight: '90vh',
                objectFit: 'contain',
                cursor: zoomLevel === 1 ? 'zoom-in' : 'grab',
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              onClick={handleImageClick}
              onMouseDown={handleMouseDown}
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

ImageModal.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired
}

export default ImageModal
