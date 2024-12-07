import api from './api.config'

export const empleadosService = {
  // Listar empleados
  listarPosiblesEmpleados: () => api.get('/admin/list-possible-employees'),
  listarEmpleados: () => api.get('/admin/list-employees'),

  // Gestión de empleados
  convertirAEmpleado: (userId) =>
    api.post('/admin/convert-to-employee', { userId }),
  cancelarConversionEmpleado: (userId) =>
    api.put('/admin/cancel-employee-conversion', { userId }),

  // Gestión de sucesores
  eliminarSucesor: (userId) => api.delete(`/admin/remove-successor/${userId}`),
  getSuccessor: (adminId) => {
    return api.get(`/admin/get-successor/${adminId}`)
  },
  setSucesor: (adminId, employeeId) => {
    return api.post('/admin/set-successor', {
      adminId,
      employeeId
    })
  },

  // Claves de conversión
  obtenerClaveConversion: (userId) =>
    api.get(`/admin/get-conversion-key/${userId}`),
  obtenerEstadoBusqueda: (userId) =>
    api.get(`/admin/get-search-status/${userId}`),
  actualizarEstadoBusqueda: (userId, enabled) =>
    api.put('/admin/update-search-new-employees', {
      personaId: userId,
      habilitarBusquedaEmpleados: enabled
    }),
  actualizarClaveConversion: (userId, key) =>
    api.put('/admin/update-conversion-key', {
      personaId: userId,
      claveConversion: key
    }),

  // Gestión de empleados
  removeEmployee: (employeeId) => {
    return api.delete(`/admin/remove-employee/${employeeId}`)
  },
  updateEmployee: (employeeId, updateData) => {
    return api.put(`/admin/update-employee/${employeeId}`, updateData)
  }
}
