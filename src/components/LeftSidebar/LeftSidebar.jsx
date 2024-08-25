// src/components/RightSidebar/RightSidebar.jsx
import React, { useState } from 'react'
import {
  FaEdit,
  FaFile,
  FaTrash,
  FaHistory,
  FaUserFriends,
  FaCog
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './LeftSidebar.css'

const LeftSidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()

  if (!user || (user.rol !== 'empleado' && user.rol !== 'administrador')) {
    return null
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`left-sidebar ${isOpen ? 'open' : ''}`}>
        <button className="left-close-button" onClick={onClose}>
          ×
        </button>
        <div className="left-sidebar-content">
          <div className="sidebar-section">
          <h3>Archivos</h3>
          <ul>
            <li>
              <FaFile /> <a href="/agregar-archivo">Agregar Archivo</a>
            </li>
            <li>
              <FaEdit /> <a href="/editar-archivo">Editar o Eliminar Archivo</a>
            </li>
            <li>
              <FaHistory />{' '}
              <a href="/historial-archivos">
                Historial de Archivos Modificados
              </a>
            </li>
            <li>
              <FaTrash /> <a href="/archivos-eliminados">Archivos Eliminados</a>
            </li>
          </ul>
        </div>
        )}
        {user.role === 'admin' && (
          <div className="sidebar-section">
            <h3>Administración</h3>
            <ul>
              <li>
                <FaUserFriends />{' '}
                <a href="/gestionar-empleados">Gestionar Empleados</a>
              </li>
              <li>
                <FaHome />{' '}
                <a href="/editar-portada">Editar Portada e Institucional</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

LeftSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default LeftSidebar
