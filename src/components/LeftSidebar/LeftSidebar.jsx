// src/components/LeftSidebar/LeftSidebar.jsx
import React from 'react'
import {
  FaEdit,
  FaFile,
  FaTrash,
  FaHistory,
  FaUserFriends,
  FaHome
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import './LeftSidebar.css'

const LeftSidebar = () => {
  const { user } = useAuth()

  if (!user || (user.role !== 'empleado' && user.role !== 'administrador')) {
    return null
  }

  return (
    <div className="left-sidebar">
      {user.role === 'empleado' && (
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
      {user.role === 'adminstrador' && (
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
  )
}

export default LeftSidebar
