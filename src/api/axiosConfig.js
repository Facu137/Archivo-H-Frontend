// src/api/axiosConfig.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // URL del backend
  withCredentials: true, // Habilita el envío de cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance
