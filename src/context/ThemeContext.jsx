// src/context/ThemeContext.jsx
import { createContext, useContext } from 'react'
import PropTypes from 'prop-types'

const ThemeContext = createContext()

export const ThemeProvider = ({ children, isDarkMode, toggleDarkMode }) => {
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de ThemeProvider')
  }
  return context
}
