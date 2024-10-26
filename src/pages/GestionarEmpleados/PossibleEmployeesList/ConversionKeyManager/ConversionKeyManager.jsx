// src/pages/GestionarEmpleados/PossibleEmployeesList/ConversionKeyManager/ConversionKeyManager.jsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { useNotification } from '../../../../hooks/useNotification'
import { useNetwork } from '../../../../context/NetworkContext'
import ToggleSwitch from '../../../../components/ToggleSwitch/ToggleSwitch'
import searchEmployeeImage from '../../../../assets/topaz-inaguracion-AH.avif'
import './ConversionKeyManager.css'

const ConversionKeyManager = () => {
  const { user, token } = useAuth()
  const [conversionKey, setConversionKey] = useState('')
  const [isSearchEnabled, setIsSearchEnabled] = useState(false)
  const [newConversionKey, setNewConversionKey] = useState('')
  const [error, setError] = useState(null) // Estado para el mensaje de error
  const showNotification = useNotification()
  const isOnline = useNetwork()

  useEffect(() => {
    let ignore = false // Para evitar actualizaciones de estado en componentes desmontados

    const fetchKeyAndStatus = async () => {
      try {
        const [keyResponse, statusResponse] = await Promise.all([
          window.axiosInstance.get(`/admin/get-conversion-key/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          window.axiosInstance.get(`/admin/get-search-status/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        ])

        if (!ignore) {
          setConversionKey(keyResponse.data.claveConversion)
          setIsSearchEnabled(
            Boolean(statusResponse.data.habilitarBusquedaEmpleados)
          )
        }
      } catch (error) {
        // Maneja el error aquí. Puedes mostrar una notificación o establecer un estado de error.
        showNotification('Error al obtener la configuración', 'error')
        setError(error.message) // Guardar el error en el estado
        console.error('Error fetching key and status:', error)
      }
    }

    if (user && user.rol === 'administrador' && isOnline) {
      // Verifica si hay conexión
      fetchKeyAndStatus()
    }

    return () => {
      ignore = true // Limpieza para evitar memory leaks
    }
  }, [user, token, showNotification, isOnline]) // Añade user, token y isOnline como dependencias

  useEffect(() => {
    setNewConversionKey(conversionKey)
  }, [conversionKey])

  const handleSearchEnabledChange = async () => {
    if (!isOnline) {
      showNotification(
        'No hay conexión a internet. No se pueden guardar los cambios.',
        'error'
      )
      return
    }

    const newIsEnabled = !isSearchEnabled
    setIsSearchEnabled(newIsEnabled)

    try {
      await window.axiosInstance.put(
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
    if (!isOnline) {
      showNotification(
        'No hay conexión a internet. No se pueden guardar los cambios.',
        'error'
      )
      return
    }

    try {
      await window.axiosInstance.put(
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

  if (error) {
    return <div className="error-message">Error: {error}</div>
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
