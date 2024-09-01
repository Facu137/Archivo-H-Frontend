// src/components/RightSidebar/RightSidebar.jsx
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FaSignOutAlt, FaEdit } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../../api/axiosConfig'
import UserCard from '../UserCard/UserCard'
import './RightSidebar.css'

const RightSidebar = ({ isOpen, onClose }) => {
  const { user, logout, token } = useAuth() // Obtiene el token del contexto
  const navigate = useNavigate()
  const [userData, setUserData] = useState(user)

  const handleLogout = () => {
    logout()
    onClose()
    navigate('/')
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUserData(response.data)
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error)
        // Puedes mostrar una notificación de error si lo deseas
      }
    }

    if (isOpen && token) {
      // Solo llama a fetchUserData si isOpen es true y token existe
      fetchUserData()
    }
  }, [isOpen, token]) // Incluye 'token' en el array de dependencias

  if (!user) {
    return null
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`right-sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <UserCard user={userData} className="user-card" />
        {userData.rol === 'empleado' && (
          <div className="employee-card">
            <div className="employee-card-content">
              <div className="employee-info-item">
                <strong>Estado:</strong>
                <span>
                  {userData.activo
                    ? 'Empleado Habilitado'
                    : 'Empleado Sin Habilitar'}
                </span>
              </div>
              {/* Mostrar los permisos solo si hay al menos uno habilitado */}
              {Object.values(userData.permisos).some(
                (habilitado) => habilitado
              ) && (
                <>
                  <div className="employee-info">
                    {/* Mapeo de nombres de permisos */}
                    {[
                      { backend: 'crear', frontend: 'Crear Archivos' },
                      { backend: 'editar', frontend: 'Editar Archivos' },
                      { backend: 'eliminar', frontend: 'Eliminar Archivos' },
                      { backend: 'descargar', frontend: 'Descargar Archivos' },
                      {
                        backend: 'verArchivosPrivados',
                        frontend: 'Ver Archivos Ocultos'
                      }
                    ].map(({ backend, frontend }) => {
                      // Verificar si el permiso está habilitado antes de renderizar
                      if (userData.permisos[backend]) {
                        return (
                          <div key={backend} className="employee-info-item">
                            <strong>{frontend}:</strong>
                            <span>Habilitado</span>
                          </div>
                        )
                      }
                      // No se retorna nada si el permiso no está habilitado
                      return null
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <Link to="/editar-usuario" className="nav-button">
          <FaEdit />
          <span className="nav-text">Editar Detalles</span>
        </Link>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Cerrar Sesión
        </button>
      </div>
    </>
  )
}

RightSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default RightSidebar
