// src/api/axiosConfig.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // URL del backend
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance
