import api from './api.config'

export const authService = {
  login: async (credentials) => {
    console.log('Auth service login request:', {
      url: '/auth/login',
      data: credentials
    })

    // Ensure data is sent in the correct format
    const requestData = {
      email: credentials.email,
      password: credentials.password
    }

    const response = await api.post('/auth/login', requestData)
    console.log('Auth service login response:', response)
    return response
  },
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  me: () => api.get('/auth/me'),
  register: (userData) => api.post('/auth/register', userData),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  requestEmployeeRole: (userId, claveConversion, token) => {
    return api.post(
      '/auth/request-emp-role',
      { userId, claveConversion },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  },
  editUser: (userData, token) => {
    return api.put('/auth/edit-user', userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}
