// src/App.jsx
import { Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './context/AuthContext'
import { NavBar } from './components/NavBar/NavBar'
import RightSidebar from './components/RightSidebar/RightSidebar'
import LeftSidebar from './components/LeftSidebar/LeftSidebar'
import NotificationBar from './components/NotificationBar/NotificationBar'
import { Footer } from './components/Footer/Footer'
import AuthenticatedRoute from './components/AuthenticatedRoute'
import { Home } from './pages/Home/Home'
import Institucional from './pages/Institucional/Institucional' // Importación corregida
import { Login } from './pages/Login/Login'
import { MiCuenta } from './pages/MiCuenta/MiCuenta'
import { GestionArchivo } from './pages/GestionArchivo/GestionArchivo'
import { VerArchivo } from './pages/VerArchivo/VerArchivo'
import { Registrar } from './pages/Registrar/Registrar'
import { EditUser } from './pages/EditUser/EditUser'
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword/ResetPassword'
import Buscador from './pages/Buscador/Buscador'
import { GestionarEmpleados } from './pages/GestionarEmpleados/GestionarEmpleados'
import ArchivosEliminados from './pages/ArchivosEliminados/ArchivosEliminados' // Importa el componente de Archivos Eliminados
import './index.css'
import { NotificationProvider } from './hooks/useNotification'

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
    <NotificationProvider showNotification={showNotification}>
      <div id="root" className={isDarkMode ? 'dark-mode' : 'light-mode'}>
        <div className="main-container">
          <div className="content">
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
                <Route path="/agregar-archivo" element={<GestionArchivo />} />

                <Route
                  element={<AuthenticatedRoute element={MiCuenta} />}
                  path="/cuenta"
                />
                <Route
                  element={<AuthenticatedRoute element={EditUser} />}
                  path="/editar-usuario"
                />
                <Route
                  element={<AuthenticatedRoute element={GestionArchivo} />}
                  path="/gestion"
                />
                <Route
                  element={<AuthenticatedRoute element={GestionarEmpleados} />}
                  path="/gestionar-empleados"
                />
                <Route
                  element={<AuthenticatedRoute element={ArchivosEliminados} />} // Protege la ruta
                  path="/archivos-eliminados"
                />

                <Route path="/*" element={<Navigate to="/" />} />
              </Routes>
            </main>

            <Footer isDarkMode={isDarkMode} />

            {notification && (
              <NotificationBar
                message={notification.message}
                type={notification.type}
                duration={notification.duration}
                onClose={closeNotification}
              />
            )}
          </div>
        </div>
      </div>
    </NotificationProvider>
  )
}

export default App
