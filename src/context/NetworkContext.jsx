// src/context/NetworkContext.jsx
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback
} from 'react'
import PropTypes from 'prop-types'

const NetworkContext = createContext()

export const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastOnlineTime, setLastOnlineTime] = useState(Date.now())
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0)

  const checkConnectivity = useCallback(() => {
    return navigator.onLine
  }, [])

  const handleOnline = useCallback(() => {
    if (checkConnectivity()) {
      setIsOnline(true)
      setLastOnlineTime(Date.now())
      setReconnectionAttempts(0)
    }
  }, [checkConnectivity])

  const handleOffline = () => {
    setIsOnline(false)
    setReconnectionAttempts((prev) => prev + 1)
  }

  // Verificar conectividad periódicamente
  useEffect(() => {
    const checkStatus = () => {
      const online = checkConnectivity()
      if (online) {
        handleOnline()
      } else {
        handleOffline()
      }
    }

    // Verificar estado inicial
    checkStatus()

    const interval = setInterval(checkStatus, 5000) // Verificar cada 5 segundos

    return () => clearInterval(interval)
  }, [checkConnectivity, handleOnline])

  // Listeners de eventos online/offline
  useEffect(() => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [handleOnline])

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        lastOnlineTime,
        reconnectionAttempts,
        checkConnectivity
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

NetworkProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useNetwork = () => useContext(NetworkContext)
