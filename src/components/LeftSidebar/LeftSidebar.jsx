// src/components/RightSidebar/RightSidebar.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import {
  FaEdit,
  FaFile,
  FaTrash,
  FaHistory,
  FaUserFriends,
  FaHome,
  FaBars
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './LeftSidebar.css'

const LeftSidebar = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  if (!user) {
    return null
  }

  return (
    <>
      <button className="open-sidebar-button" onClick={toggleSidebar}>
        <FaBars />
      </button>
      {isOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      <div className={`left-sidebar ${isOpen ? 'open' : ''}`}>
      {user.role === 'Empleado' && (
          <div className="sidebar-section">
          <h3>Archivos</h3>
          <ul>
            <li>
            <FaFile /> <Link to="/agregar-archivo">Agregar Archivo</Link>
            </li>
            <li>
            <FaEdit /> <Link to="/editar-archivo">Editar o Eliminar Archivo</Link>
            </li>
            <li>
              <FaHistory />{' '}
              <Link to="/historial-archivos">
                  Historial de Archivos Modificados
                </Link>
            </li>
            <li>
            <FaTrash /> <Link to="/archivos-eliminados">Archivos Eliminados</Link>
            </li>
          </ul>
        </div>
        )}
        {user.role === 'admin' && (
          <div className="sidebar-section">
            <h3>Administración</h3>
            <ul>
              <li>
              <FaUserFriends />
              <Link to="/gestionar-empleados">Gestionar Empleados</Link>
              </li>
              <li>
              <FaHome />
              <Link to="/editar-portada">Editar Portada e Institucional</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default LeftSidebar
