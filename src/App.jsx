// src/App.jsx
import { Route, Routes, Navigate } from 'react-router-dom'
import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext' // Agregado
import { NotificationProvider } from './hooks/useNotification'
import { NetworkProvider } from './context/NetworkContext'
import NetworkStatus from './components/NetworkStatus/NetworkStatus'
// components
import { NavBar } from './components/NavBar/NavBar'
import RightSidebar from './components/RightSidebar/RightSidebar'
import LeftSidebar from './components/LeftSidebar/LeftSidebar'
import NotificationBar from './components/NotificationBar/NotificationBar'
import { Footer } from './components/Footer/Footer'
import AuthenticatedRoute from './components/AuthenticatedRoute'
// pages
import { Home } from './pages/Home/Home'
import Institucional from './pages/Institucional/Institucional'
import { Login } from './pages/Login/Login'
import AgregarArchivo from './pages/AgregarArchivo/AgregarArchivo'
import { VerArchivo } from './pages/VerArchivo/VerArchivo'
import { Registrar } from './pages/Registrar/Registrar'
import { EditUser } from './pages/EditUser/EditUser'
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword/ResetPassword'
import Buscador from './pages/Buscador/Buscador'
import GestionarEmpleados from './pages/GestionarEmpleados/GestionarEmpleados'
import ArchivosEliminados from './pages/ArchivosEliminados/ArchivosEliminados'
import NotFound from './pages/NotFound/NotFound' // Import NotFound page
// hooks
import './index.css'

export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState({
    left: false,
    right: false
  })
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('mode')
    return savedMode ? savedMode === 'dark' : true
  })
  const { user } = useAuth()
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    localStorage.setItem('mode', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    document.body.className = isDarkMode
      ? 'bg-dark text-white'
      : 'bg-light text-dark'
  }, [isDarkMode])

  const toggleSidebar = (side) => {
    setIsSidebarOpen((prev) => ({
      ...prev,
      [side]: !prev[side]
    }))
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const showNotification = useCallback(
    (message, type = 'info', duration = 9000) => {
      setNotification({ message, type, duration })
    },
    []
  )

  const closeNotification = useCallback(() => {
    setNotification(null)
  }, [])

  return (
    <NetworkProvider>
      <NotificationProvider showNotification={showNotification}>
        <ThemeProvider isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
          <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
            <NavBar
              toggleSidebar={toggleSidebar}
              toggleDarkMode={toggleDarkMode}
              isDarkMode={isDarkMode}
            />
            {user && (
              <RightSidebar
                isOpen={isSidebarOpen.right}
                onClose={() => toggleSidebar('right')}
              />
            )}
            {user && (
              <LeftSidebar
                isOpen={isSidebarOpen.left}
                onClose={() => toggleSidebar('left')}
              />
            )}
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/institucional" element={<Institucional />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registrar" element={<Registrar />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/buscador" element={<Buscador />} />
                <Route path="/visor" element={<VerArchivo />} />
                <Route
                  path="/archivos-eliminados"
                  element={<ArchivosEliminados />}
                />

                {/* Rutas protegidas */}
                <Route element={<AuthenticatedRoute />}>
                  <Route path="/editar-perfil" element={<EditUser />} />
                  <Route path="/agregar-archivo" element={<AgregarArchivo />} />
                </Route>

                {/* Ruta protegida para administradores */}

                <Route
                  element={
                    <AuthenticatedRoute allowedRoles={['administrador']} />
                  }
                >
                  <Route
                    path="/gestionar-empleados"
                    element={<GestionarEmpleados />}
                  />
                </Route>

                <Route path="*" element={<NotFound />} />
                <Route path="/*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer isDarkMode={isDarkMode} />
            <NetworkStatus />
            {notification && (
              <NotificationBar
                message={notification.message}
                type={notification.type}
                duration={notification.duration}
                onClose={closeNotification}
              />
            )}
          </div>
        </ThemeProvider>
      </NotificationProvider>
    </NetworkProvider>
  )
}

export default App
