// src/components/NetworkStatus.jsx
import React, { useState, useEffect } from 'react'
import './NetworkStatus.css' // Crea este archivo CSS para los estilos

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    !isOnline && ( // Mostrar solo cuando está offline
      <div className="network-status-bar">
        <p className="no-connection">Sin conexión a Internet.</p>
      </div>
    )
  )
}

export default NetworkStatus
