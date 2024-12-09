// src/components/NetworkStatus.jsx
import React from 'react'
import { useNetwork } from '../../context/NetworkContext'
import { useTheme } from '../../context/ThemeContext'
import { Alert } from 'react-bootstrap'
import { BiWifiOff } from 'react-icons/bi'
import './NetworkStatus.css'

const NetworkStatus = () => {
  const { isOnline } = useNetwork()
  const { isDarkMode } = useTheme()

  if (isOnline) return null // No mostrar nada si hay conexión

  return (
    <div className="network-status-container">
      <Alert
        variant={isDarkMode ? 'dark' : 'danger'}
        className={`d-flex align-items-center m-0 py-2 px-3 rounded-0 ${
          isDarkMode ? 'bg-dark border-secondary' : ''
        }`}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1050,
          opacity: 0.95
        }}
      >
        <div
          className={`d-flex align-items-center justify-content-center w-100 ${
            isDarkMode ? 'text-pink' : 'text-danger'
          }`}
        >
          <BiWifiOff
            className="me-2"
            size={20}
            style={{ color: isDarkMode ? '#ff69b4' : 'inherit' }}
          />
          <span className="d-none d-sm-inline fw-bold">
            Sin conexión a Internet
          </span>
          <span className="d-none d-md-inline ms-2">
            - Verifica tu conexión a Internet
          </span>
        </div>
      </Alert>
    </div>
  )
}

export default NetworkStatus
