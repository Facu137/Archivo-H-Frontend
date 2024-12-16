import api from './api.config'

export const archivoService = {
  // Búsqueda
  busquedaGeneral: (params) => api.get('/api/general', { params }),
  busquedaAvanzada: (params) =>
    api.get('/api/documents/advanced-search', { params }),

  // Gestión de archivos
  agregarArchivo: (formData) => {
    let endpoint = '/api/documents/upload/general'

    if (formData.get('tipoDocumento') === 'Mensura') {
      endpoint = '/api/documents/upload/mensura'
    } else if (formData.get('tipoDocumento') === 'Notarial') {
      endpoint = '/api/documents/upload/notarial'
    }

    return api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  eliminarArchivo: (id) => api.delete(`/api/archivos/${id}`),
  restaurarArchivo: (id) => api.put(`/api/archivos/${id}/restore`),

  // Archivos eliminados
  obtenerArchivosEliminados: ({ page = 1, pageSize = 50 } = {}) =>
    api.get('/api/deleted/deleted', {
      params: {
        page,
        pageSize
      }
    }),
  eliminarPermanentemente: (id) => api.delete(`/api/deleted/documents/${id}`)
}
