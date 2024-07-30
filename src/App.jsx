// src/App.jsx
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './context/AuthContext'
// components
import { NavBar } from './components/NavBar/NavBar'
import RightSidebar from './components/RightSidebar/RightSidebar'
import LeftSidebar from './components/LeftSidebar/LeftSidebar'
import NotificationBar from './components/NotificationBar/NotificationBar'
import { Footer } from './components/Footer/Footer'
// pages
import { Home } from './pages/Home/Home'
import { Institucional } from './pages/Institucional/Institucional'
import { Login } from './pages/Login/Login'
import { GestionArchivo } from './pages/GestionArchivo/GestionArchivo'
import { VerArchivo } from './pages/VerArchivo/VerArchivo'
import { Registrar } from './pages/Registrar/Registrar'
import { EditUser } from './pages/EditUser/EditUser'
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword/ResetPassword'
import './index.css'
// hooks
import { NotificationProvider } from './hooks/useNotification'

export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('mode')
    return savedMode ? savedMode === 'dark' : true
  })
  const { user } = useAuth()
  const location = useLocation()
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    localStorage.setItem('mode', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
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
      <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
        <NavBar
          toggleSidebar={toggleSidebar}
          toggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
        {user && (
          <RightSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
              {user && <LeftSidebar />}

        <main className="contenido">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/institucional" element={<Institucional />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Registrar />} />
            <Route path="/editar-usuario" element={<EditUser />} />
            <Route path="/gestion" element={<GestionArchivo />} />
            <Route path="/visor" element={<VerArchivo />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
    </NotificationProvider>

  )
}

export default App
