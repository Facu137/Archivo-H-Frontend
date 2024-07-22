// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    // Verificar si hay usuario almacenado en el localStorage y token
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)
      } catch (error) {
        console.error('Error parsing user data from localStorage', error)
        setUser(null)
        setToken(null)
      }
    } else {
      console.warn('No user data found in localStorage')
      setUser(null)
      setToken(null)
    }
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setToken(token)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
