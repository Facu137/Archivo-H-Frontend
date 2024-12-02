// src/pages/GestionarEmpleados/PossibleEmployeesList/ConversionKeyManager/ConversionKeyManager.jsx
import React, { useEffect, useState } from 'react'
import { Form, Card, Button, InputGroup } from 'react-bootstrap'
import { useAuth } from '../../../../context/AuthContext'
import { useNotification } from '../../../../hooks/useNotification'
import { useNetwork } from '../../../../context/NetworkContext'
import { useTheme } from '../../../../context/ThemeContext'
import searchEmployeeImage from '../../../../assets/topaz-inaguracion-AH.avif'
import './ConversionKeyManager.css'

const ConversionKeyManager = () => {
  const { user, token } = useAuth()
  const { isDarkMode } = useTheme()
  const [conversionKey, setConversionKey] = useState('')
  const [isSearchEnabled, setIsSearchEnabled] = useState(false)
  const [newConversionKey, setNewConversionKey] = useState('')
  const [error, setError] = useState(null)
  const showNotification = useNotification()
  const isOnline = useNetwork()

  useEffect(() => {
    let ignore = false

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
        showNotification('Error al obtener la configuración', 'error')
        setError(error.message)
        console.error('Error fetching key and status:', error)
      }
    }

    if (user && user.rol === 'administrador' && isOnline) {
      fetchKeyAndStatus()
    }

    return () => {
      ignore = true
    }
  }, [user, token, showNotification, isOnline])

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
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="conversion-key-manager min-vh-100 py-5">
      <div className="container px-4">
        <div className="row justify-content-center g-4">
          <div className="col-12 col-lg-8">
            <Card
              className={`border-0 shadow mb-4 ${
                isDarkMode ? 'bg-dark text-light' : 'bg-light'
              }`}
            >
              <Card.Header
                className={`border-bottom py-3 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}
              >
                <div className="text-center mb-4">
                  <img
                    src={searchEmployeeImage}
                    alt="Búsqueda de Empleados"
                    className="search-image rounded-3 mb-3"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                  <h3 className="h3 mb-2">Configurar Búsqueda de Empleados</h3>
                  <p
                    className={`${isDarkMode ? 'text-light-emphasis' : 'text-muted'} mb-0`}
                  >
                    Gestiona la búsqueda de nuevos empleados y configura la
                    clave de acceso
                  </p>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h4 className="mb-3 h5">Estado de Búsqueda</h4>
                  <div
                    className={`p-4 rounded-3 ${
                      isDarkMode
                        ? 'bg-dark-subtle border border-secondary'
                        : 'bg-light-subtle border'
                    }`}
                  >
                    <Form.Check
                      type="switch"
                      id="search-enabled"
                      label={
                        <span
                          className={isDarkMode ? 'text-light' : 'text-dark'}
                        >
                          Búsqueda de empleados{' '}
                          <span
                            className={`badge ${isSearchEnabled ? 'bg-success' : 'bg-secondary'}`}
                          >
                            {isSearchEnabled ? 'Habilitada' : 'Deshabilitada'}
                          </span>
                        </span>
                      }
                      checked={isSearchEnabled}
                      onChange={handleSearchEnabledChange}
                      className="mb-0 form-switch-lg"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 h5">Clave de Conversión</h4>
                  <div
                    className={`p-4 rounded-3 ${
                      isDarkMode
                        ? 'bg-dark-subtle border border-secondary'
                        : 'bg-light-subtle border'
                    }`}
                  >
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="text"
                        value={newConversionKey}
                        onChange={handleConversionKeyChange}
                        disabled={!isSearchEnabled}
                        placeholder="Ingrese la clave de conversión"
                        className={
                          isDarkMode
                            ? 'bg-dark text-light border-secondary'
                            : ''
                        }
                      />
                      <Button
                        variant={isDarkMode ? 'light' : 'primary'}
                        onClick={handleSaveConversionKey}
                        disabled={!isSearchEnabled}
                      >
                        Guardar Cambios
                      </Button>
                    </InputGroup>
                    <small className={isDarkMode ? 'text-light' : 'text-muted'}>
                      Esta clave será requerida para que los usuarios puedan
                      solicitar unirse como empleados.
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversionKeyManager
