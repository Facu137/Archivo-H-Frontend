// src/pages/GestionarEmpleados/CurrentEmployeesList/EmployeeList/EmployeeList.jsx
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Card } from 'react-bootstrap'
import { useTheme } from '../../../../context/ThemeContext'
import UserCard from '../../../../components/UserCard/UserCard'
import EmployeeDetails from '../EmployeeDetails/EmployeeDetails'

const EmployeeList = ({
  employees,
  setCurrentEmployees,
  token,
  user,
  showNotification,
  fetchCurrentEmployees,
  successor,
  fetchSuccessor
}) => {
  const { isDarkMode } = useTheme()
  const [editingEmployeeId, setEditingEmployeeId] = useState(null)
  const [editedEmployeeData, setEditedEmployeeData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const allowedUpdates = [
    'activo',
    'permiso_crear',
    'permiso_editar',
    'permiso_eliminar',
    'permiso_descargar',
    'permiso_ver_archivos_privados'
  ]

  const handleEditClick = (employeeId) => {
    setEditingEmployeeId(employeeId)
    const employeeToEdit = employees.find(
      (employee) => employee.id === employeeId
    )
    setEditedEmployeeData({ ...employeeToEdit })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingEmployeeId(null)
    setEditedEmployeeData(null)
  }

  const handleInputChange = (event) => {
    const { name, checked } = event.target
    setEditedEmployeeData((prevData) => ({
      ...prevData,
      [name]: checked
    }))
  }

  const handleSaveChanges = async () => {
    try {
      const dataToUpdate = {}
      allowedUpdates.forEach((field) => {
        dataToUpdate[field] = editedEmployeeData[field]
      })

      await window.axiosInstance.put(
        `/admin/update-employee/${editingEmployeeId}`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      showNotification('Empleado actualizado con éxito', 'success')
      handleCloseModal()
      fetchCurrentEmployees()
    } catch (error) {
      console.error('Error al actualizar empleado:', error)
      showNotification('Error al actualizar empleado', 'error')
    }
  }

  const handleSetSuccessor = async (employeeId) => {
    try {
      await window.axiosInstance.post(
        '/admin/set-successor',
        {
          adminId: user.id,
          employeeId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      showNotification('Sucesor establecido correctamente', 'success')
      fetchSuccessor()
    } catch (error) {
      console.error('Error al establecer sucesor:', error)
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 404)
      ) {
        showNotification(error.response.data.message, 'error')
      } else {
        showNotification(
          'Error al establecer el sucesor. Por favor, inténtalo de nuevo.',
          'error'
        )
      }
    }
  }

  const handleRemoveEmployee = async (employeeId) => {
    try {
      await window.axiosInstance.delete(
        `/admin/remove-employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      showNotification('Empleado eliminado con éxito', 'success')
      setCurrentEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.id !== employeeId)
      )
    } catch (error) {
      console.error('Error al eliminar empleado:', error)
      showNotification('Error al eliminar empleado', 'error')
    }
  }

  return (
    <div className="employee-list">
      <div className="row g-4">
        {employees.map((employee) => (
          <div key={employee.id} className="col-12">
            <Card
              className={`border-0 shadow-sm ${
                isDarkMode ? 'bg-dark text-light' : 'bg-white'
              }`}
            >
              <Card.Body className="p-0">
                <div className="position-relative">
                  <UserCard
                    user={employee}
                    darkMode={isDarkMode}
                    className="border-0 mb-0"
                  />
                  <div
                    className="position-absolute top-0 end-0 p-3 d-flex gap-2"
                    style={{ zIndex: 1 }}
                  >
                    <Button
                      variant={isDarkMode ? 'outline-light' : 'outline-primary'}
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      onClick={() => handleEditClick(employee.id)}
                    >
                      <i className="bi bi-pencil-square"></i>
                      <span>Editar</span>
                    </Button>
                    {employee.id !== successor?.id && (
                      <Button
                        variant={
                          isDarkMode ? 'outline-light' : 'outline-success'
                        }
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => handleSetSuccessor(employee.id)}
                      >
                        <i className="bi bi-person-check"></i>
                        <span>Sucesor</span>
                      </Button>
                    )}
                    <Button
                      variant={isDarkMode ? 'outline-light' : 'outline-danger'}
                      size="sm"
                      className="d-flex align-items-center gap-1"
                      onClick={() => handleRemoveEmployee(employee.id)}
                    >
                      <i className="bi bi-trash"></i>
                      <span>Eliminar</span>
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        className={isDarkMode ? 'modal-dark' : ''}
      >
        <Modal.Header
          closeButton
          className={
            isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-light'
          }
        >
          <Modal.Title>Editar Permisos de Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? 'bg-dark text-light' : 'bg-light'}>
          {editedEmployeeData && (
            <EmployeeDetails
              employee={editedEmployeeData}
              isEditing={true}
              editedEmployeeData={editedEmployeeData}
              onChange={handleInputChange}
            />
          )}
        </Modal.Body>
        <Modal.Footer
          className={
            isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-light'
          }
        >
          <Button
            variant={isDarkMode ? 'light' : 'secondary'}
            onClick={handleCloseModal}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

EmployeeList.propTypes = {
  employees: PropTypes.array.isRequired,
  setCurrentEmployees: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  fetchCurrentEmployees: PropTypes.func.isRequired,
  successor: PropTypes.object,
  fetchSuccessor: PropTypes.func.isRequired
}

export default EmployeeList
