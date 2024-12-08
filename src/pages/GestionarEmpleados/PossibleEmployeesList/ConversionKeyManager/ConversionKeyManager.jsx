// src/pages/GestionarEmpleados/PossibleEmployeesList/ConversionKeyManager/ConversionKeyManager.jsx
import React, { useEffect, useState, useCallback } from 'react'
import { Form, Card, Button, InputGroup } from 'react-bootstrap'
import { useAuth } from '../../../../context/AuthContext'
import { useNotification } from '../../../../hooks/useNotification'
import { useNetwork } from '../../../../context/NetworkContext'
import { useTheme } from '../../../../context/ThemeContext'
import searchEmployeeImage from '../../../../assets/topaz-inaguracion-AH.avif'
import { empleadosService } from '../../../../services/empleados.service'
import './ConversionKeyManager.css'

const ConversionKeyManager = () => {
  const { user } = useAuth()
  const { isDarkMode } = useTheme()
  const { isOnline } = useNetwork()
  const showNotification = useNotification()
  const [conversionKey, setConversionKey] = useState('')
  const [isSearchEnabled, setIsSearchEnabled] = useState(false)
  const [newConversionKey, setNewConversionKey] = useState('')
  const [error, setError] = useState(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const fetchKeyAndStatus = useCallback(async () => {
    if (!isOnline) {
      return
    }
    try {
      const [keyResponse, statusResponse] = await Promise.all([
        empleadosService.obtenerClaveConversion(user.id),
        empleadosService.obtenerEstadoBusqueda(user.id)
      ])
      setConversionKey(keyResponse.data.claveConversion)
      setNewConversionKey(keyResponse.data.claveConversion)
      setIsSearchEnabled(
        Boolean(statusResponse.data.habilitarBusquedaEmpleados)
      )
      setError(null)
    } catch (error) {
      showNotification('Error al obtener la configuración', 'error')
      setError(error.message)
      console.error('Error fetching key and status:', error)
    }
  }, [user, isOnline, showNotification])

  useEffect(() => {
    if (user?.rol === 'administrador' && isOnline && isInitialLoad) {
      setIsInitialLoad(false)
      fetchKeyAndStatus()
    }
  }, [user, isOnline, isInitialLoad, fetchKeyAndStatus])

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
      await empleadosService.actualizarEstadoBusqueda(user.id, newIsEnabled)
      setIsSearchEnabled(newIsEnabled)
      showNotification(
        `Búsqueda de nuevos empleados ${newIsEnabled ? 'activada' : 'desactivada'}`,
        'success'
      )
    } catch (error) {
      console.error('Error al actualizar el estado de la búsqueda:', error)
      showNotification('Error al actualizar el estado de la búsqueda', 'error')
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
      await empleadosService.actualizarClaveConversion(
        user.id,
        newConversionKey
      )
      setConversionKey(newConversionKey)
      showNotification('Clave de conversión actualizada con éxito', 'success')
    } catch (error) {
      console.error('Error al actualizar la clave de conversión:', error)
      showNotification('Error al actualizar la clave de conversión', 'error')
      setNewConversionKey(conversionKey)
    }
  }

  if (error) {
    return (
      <Card
        className={`border-0 shadow-sm ${
          isDarkMode ? 'bg-dark text-light' : 'bg-light'
        }`}
      >
        <Card.Body>
          <div className="text-center">
            <p className="text-danger">Error: {error}</p>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card
      className={`border-0 shadow-sm ${
        isDarkMode ? 'bg-dark text-light' : 'bg-light'
      }`}
    >
      <Card.Body>
        <div className="d-flex flex-column gap-4">
          <div className="text-center">
            <img
              src={searchEmployeeImage}
              alt="Buscar Empleados"
              className="img-fluid rounded-3 mb-3"
              style={{ objectFit: 'cover' }}
            />
            <h4 className={`h5 ${isDarkMode ? 'text-light' : ''}`}>
              Configuración de Búsqueda
            </h4>
          </div>

          <Form.Group>
            <Form.Label className={isDarkMode ? 'text-light' : ''}>
              Habilitar búsqueda de nuevos empleados
            </Form.Label>
            <Form.Check
              type="switch"
              id="search-enabled-switch"
              checked={isSearchEnabled}
              onChange={handleSearchEnabledChange}
              label={isSearchEnabled ? 'Activado' : 'Desactivado'}
              className={isDarkMode ? 'text-light' : ''}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={isDarkMode ? 'text-light' : ''}>
              Clave de conversión
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={newConversionKey}
                onChange={handleConversionKeyChange}
                disabled={!isSearchEnabled}
                placeholder="Ingrese la clave de conversión"
                className={
                  isDarkMode ? 'bg-dark text-light border-secondary' : ''
                }
              />
              <Button
                variant={isDarkMode ? 'outline-light' : 'primary'}
                onClick={handleSaveConversionKey}
                disabled={!isSearchEnabled}
                className="save-button"
              >
                Guardar
              </Button>
            </InputGroup>
            <Form.Text className={isDarkMode ? 'text-light' : 'text-muted'}>
              Esta clave será utilizada por los usuarios para convertirse en
              empleados.
            </Form.Text>
          </Form.Group>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ConversionKeyManager
