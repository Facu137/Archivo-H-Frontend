// src\hooks\useNotification.jsx
import React, { useContext, createContext } from 'react'
import PropTypes from 'prop-types'

const NotificationContext = createContext()

export const NotificationProvider = ({ children, showNotification }) => (
  <NotificationContext.Provider value={showNotification}>
    {children}
  </NotificationContext.Provider>
)

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
  showNotification: PropTypes.func.isRequired
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context
}
