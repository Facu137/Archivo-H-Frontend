// src/pages/GestionarEmpleados/ConversionKeyManager/ConversionKeyManager.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import axiosInstance from '../../../../api/axiosConfig'
import { useNotification } from '../../../../hooks/useNotification'
import ToggleSwitch from '../../../../components/ToggleSwitch/ToggleSwitch'
import searchEmployeeImage from '../../../../assets/topaz-inaguracion-AH.avif'
import './ConversionKeyManager.css'

const ConversionKeyManager = () => {
  const { user, token } = useAuth()
  const [conversionKey, setConversionKey] = useState('')
  const [isSearchEnabled, setIsSearchEnabled] = useState(false)
  const [newConversionKey, setNewConversionKey] = useState('')
  const showNotification = useNotification()

  useEffect(() => {
    const fetchConversionKey = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/get-conversion-key/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        setConversionKey(response.data.claveConversion)
      } catch (error) {
        console.error('Error al obtener la clave de conversión:', error)
        showNotification('Error al obtener la clave de conversión', 'error')
      }
    }

    const fetchSearchStatus = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/get-search-status/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        // Convertimos explícitamente a booleano
        setIsSearchEnabled(Boolean(response.data.habilitarBusquedaEmpleados))
      } catch (error) {
        console.error('Error al obtener el estado de la búsqueda:', error)
        showNotification('Error al obtener el estado de la búsqueda', 'error')
      }
    }

    if (user && user.rol === 'administrador') {
      fetchConversionKey()
      fetchSearchStatus()
    }
  }, [token, user, showNotification])

  useEffect(() => {
    setNewConversionKey(conversionKey)
  }, [conversionKey])

  const handleSearchEnabledChange = async () => {
    const newIsEnabled = !isSearchEnabled
    setIsSearchEnabled(newIsEnabled)

    try {
      await axiosInstance.put(
        '/admin/update-search-new-employees',
        {
          personaId: user.id,
          habilitarBusquedaEmpleados: newIsEnabled
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      showNotification(
        `Búsqueda de nuevos empleados ${newIsEnabled ? 'activada' : 'desactivada'}`,
        'success'
      )
    } catch (error) {
      console.error('Error al actualizar el estado de la búsqueda:', error)
      showNotification('Error al actualizar el estado de la búsqueda', 'error')
      // Revertimos el cambio en caso de error
      setIsSearchEnabled(!newIsEnabled)
    }
  }

  const handleConversionKeyChange = (event) => {
    setNewConversionKey(event.target.value)
  }

  const handleSaveConversionKey = async () => {
    try {
      await axiosInstance.put(
        '/admin/update-conversion-key',
        {
          personaId: user.id,
          claveConversion: newConversionKey
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setConversionKey(newConversionKey)
      showNotification('Clave de conversión actualizada con éxito', 'success')
    } catch (error) {
      console.error('Error al actualizar la clave de conversión:', error)
      showNotification('Error al actualizar la clave de conversión', 'error')
    }
  }

  return (
    <div className="conversion-key-manager-container">
      <div className="card-config description-card">
        <h3>Configurar Búsqueda de Nuevos Empleados</h3> {/* Título primero */}
        <img
          src={searchEmployeeImage}
          alt="Búsqueda de Empleados"
          className="search-image"
        />{' '}
        {/* Luego la imagen */}
        <p>
          Habilita la búsqueda de nuevos empleados para que los usuarios puedan
          solicitar unirse al equipo.
        </p>
        <p>
          Define una clave secreta que los usuarios deberán ingresar para enviar
          su solicitud.
        </p>
      </div>
      <div className="card-config settings-card">
        <div className="search-config">
          <h3 className="card-title">Habilitar Búsqueda</h3>
          <div className="search-toggle">
            {/* Toggle y span juntos */}
            <label>
              haz click para habilitar o deshabilitar la búsqueda de nuevos
              empleados:
            </label>
            <div>
              <ToggleSwitch
                isOn={Boolean(isSearchEnabled)}
                handleToggle={handleSearchEnabledChange}
                onColor="#4BD865"
              />
              <span className="search-status">
                {isSearchEnabled ? 'Habilitada' : 'Deshabilitada'}
              </span>
            </div>
          </div>
        </div>
        <div className="conversion-key-config">
          <h3 className="card-title">Clave para nuevos empleados</h3>
          <div className="conversion-key-input">
            <label htmlFor="conversionKey">
              Cambiar la clave para que los usuarios puedan solicitar ser nuevos
              empleados:
            </label>
            <input
              type="text"
              id="conversionKey"
              value={newConversionKey}
              onChange={handleConversionKeyChange}
              disabled={!isSearchEnabled}
            />
            <button
              onClick={handleSaveConversionKey}
              disabled={!isSearchEnabled}
            >
              Guardar Nueva Clave {/* Nuevo texto del botón */}
            </button>{' '}
            {/* Botón debajo del input */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversionKeyManager
