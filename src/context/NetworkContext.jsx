// src/context/NetworkContext.jsx
import { createContext, useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'

const NetworkContext = createContext()

export const NetworkProvider = ({ children }) => {
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
    <NetworkContext.Provider value={isOnline}>
      {children}
    </NetworkContext.Provider>
  )
}
NetworkProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useNetwork = () => useContext(NetworkContext)
