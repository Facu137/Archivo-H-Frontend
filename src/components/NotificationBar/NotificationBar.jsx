// src/components/NotificationBar/NotificationBar.jsx
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FaTimes } from 'react-icons/fa'
import './NotificationBar.css'

const NotificationBar = ({ message, type, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className={`notification-bar ${type}`}>
      <p>{message}</p>
      <button onClick={handleClose} className="close-button">
        <FaTimes />
      </button>
    </div>
  )
}

NotificationBar.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number
}

export default NotificationBar
