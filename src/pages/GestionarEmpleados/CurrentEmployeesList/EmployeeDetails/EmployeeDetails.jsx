// src/pages/GestionarEmpleados/CurrentEmployeesList/EmployeeDetails/EmployeeDetails.jsx
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Card, Badge } from 'react-bootstrap'
import { useTheme } from '../../../../context/ThemeContext'

const permissionsMap = [
  { backend: 'permiso_crear', frontend: 'Crear Archivos', icon: '📝' },
  { backend: 'permiso_editar', frontend: 'Editar Archivos', icon: '✏️' },
  { backend: 'permiso_eliminar', frontend: 'Eliminar Archivos', icon: '🗑️' },
  { backend: 'permiso_descargar', frontend: 'Descargar Archivos', icon: '⬇️' },
  {
    backend: 'permiso_ver_archivos_privados',
    frontend: 'Ver Archivos Ocultos',
    icon: '👁️'
  }
]

const EmployeeDetails = ({
  employee,
  isEditing,
  editedEmployeeData,
  onChange
}) => {
  const { isDarkMode } = useTheme()

  return (
    <Card
      className={`border-0 shadow-sm ${isDarkMode ? 'bg-dark text-light' : 'bg-white'}`}
    >
      <Card.Header
        className={`border-bottom py-3 ${isDarkMode ? 'bg-dark' : 'bg-light'}`}
      >
        <h5 className="mb-0">Detalles del Empleado</h5>
      </Card.Header>
      <Card.Body className="p-4">
        <div className="row g-4">
          <div className="col-12">
            <div
              className={`d-flex align-items-center justify-content-between p-3 rounded-3 ${
                isDarkMode
                  ? 'bg-dark-subtle border border-secondary'
                  : 'bg-light-subtle border'
              }`}
            >
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-person-check-fill"></i>
                <span className="fw-semibold">Estado del Empleado</span>
              </div>
              {isEditing ? (
                <Form.Check
                  type="switch"
                  id="activo"
                  checked={editedEmployeeData.activo}
                  onChange={() =>
                    onChange({
                      target: {
                        name: 'activo',
                        checked: !editedEmployeeData.activo
                      }
                    })
                  }
                  className="m-0"
                />
              ) : (
                <Badge
                  bg={employee.activo ? 'success' : 'danger'}
                  className="px-3 py-2"
                >
                  {employee.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              )}
            </div>
          </div>

          {permissionsMap.map(({ backend, frontend, icon }) => (
            <div key={backend} className="col-12 col-md-6">
              <div
                className={`d-flex align-items-center justify-content-between p-3 rounded-3 ${
                  isDarkMode
                    ? 'bg-dark-subtle border border-secondary'
                    : 'bg-light-subtle border'
                }`}
              >
                <div className="d-flex align-items-center gap-2">
                  <span>{icon}</span>
                  <span className="fw-semibold">{frontend}</span>
                </div>
                {isEditing ? (
                  <Form.Check
                    type="switch"
                    id={backend}
                    checked={editedEmployeeData[backend]}
                    onChange={() =>
                      onChange({
                        target: {
                          name: backend,
                          checked: !editedEmployeeData[backend]
                        }
                      })
                    }
                    className="m-0"
                  />
                ) : (
                  <Badge
                    bg={employee[backend] ? 'success' : 'danger'}
                    className="px-3 py-2"
                  >
                    {employee[backend] ? 'Sí' : 'No'}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

EmployeeDetails.propTypes = {
  employee: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  editedEmployeeData: PropTypes.object,
  onChange: PropTypes.func
}

export default EmployeeDetails
