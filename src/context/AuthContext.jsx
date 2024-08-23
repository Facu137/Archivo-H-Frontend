// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import axiosInstance from '../api/axiosConfig'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data from localStorage', error)
        setUser(null)
      }
    }

    if (storedToken) {
      setToken(storedToken)
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

  const updateUser = async (userData) => {
    try {
      const response = await axiosInstance.put('/auth/edit-user', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const updatedUser = response.data.user
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Update user error:', error)
    }
  }

  const addFavorite = async (documento_id) => {
    try {
      await axiosInstance.post(
        '/favorites',
        { documento_id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      // Actualizar el estado del usuario si es necesario
    } catch (error) {
      console.error('Error adding favorite:', error)
    }
  }

  const removeFavorite = async (documento_id) => {
    try {
      await axiosInstance.delete(`/favorites/${documento_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // Actualizar el estado del usuario si es necesario
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        addFavorite,
        removeFavorite
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}
