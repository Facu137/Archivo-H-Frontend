// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './hooks/useNotification'

const showNotification = (message) => {
  // Implementa la lógica para mostrar notificaciones
  console.log(message)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <AuthProvider>
        <NotificationProvider showNotification={showNotification}>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </React.StrictMode>
  </BrowserRouter>
)
