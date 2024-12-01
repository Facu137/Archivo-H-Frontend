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

  const checkConnectivity = useCallback(async () => {
    try {
      const response = await fetch('/api/health-check', {
        method: 'HEAD',
        cache: 'no-store'
      })
      return response.ok
    } catch (error) {
      return false
    }
  }, [])

  const handleOnline = useCallback(async () => {
    const isReallyOnline = await checkConnectivity()
    if (isReallyOnline) {
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
    const interval = setInterval(async () => {
      if (!isOnline) {
        const isConnected = await checkConnectivity()
        if (isConnected) {
          handleOnline()
        }
      }
    }, 30000) // Verificar cada 30 segundos cuando está offline

    return () => clearInterval(interval)
  }, [isOnline, checkConnectivity, handleOnline])

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
