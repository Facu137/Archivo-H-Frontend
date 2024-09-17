// src/pages/GestionarEmpleados/ConversionKeyManager/ConversionKeyManager.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import axiosInstance from '../../../api/axiosConfig'
import { useNotification } from '../../../hooks/useNotification'
import ToggleSwitch from '../../../components/ToggleSwitch/ToggleSwitch'
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
    <div className="conversion-key-manager">
      <div className="search-toggle">
        <label>Búsqueda de nuevos empleados:</label>
        <ToggleSwitch
          isOn={Boolean(isSearchEnabled)}
          handleToggle={handleSearchEnabledChange}
          onColor="#4BD865"
        />
        <span className="search-status">
          {isSearchEnabled ? 'Habilitada' : 'Deshabilitada'}
        </span>
      </div>

      <div className="conversion-key-input">
        <label htmlFor="conversionKey">
          Clave para recibir nuevos empleados:
        </label>
        <input
          type="text"
          id="conversionKey"
          value={newConversionKey}
          onChange={handleConversionKeyChange}
          disabled={!isSearchEnabled}
        />
        <button onClick={handleSaveConversionKey} disabled={!isSearchEnabled}>
          Guardar
        </button>
      </div>
    </div>
  )
}

export default ConversionKeyManager
