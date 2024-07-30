// src/App.jsx
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext' // Asegúrate de importar useAuth
// components
import { NavBar } from './components/NavBar/NavBar'
import RightSidebar from './components/RightSidebar/RightSidebar'
import LeftSidebar from './components/LeftSidebar/LeftSidebar'
import { Footer } from './components/Footer/Footer'
// pages
import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'
import { GestionArchivo } from './pages/GestionArchivo/GestionArchivo'
import { VerArchivo } from './pages/VerArchivo/VerArchivo'
import { Registrar } from './pages/Registrar/Registrar'
import { EditUser } from './pages/EditUser/EditUser'
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword/ResetPassword'
import './index.css'

export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('mode')
    return savedMode ? savedMode === 'dark' : true
  })
  const { user } = useAuth() // Obtén el estado de autenticación
  const location = useLocation() // Obtén la ubicación actual

  // Almacena el modo de tema en localStorage
  useEffect(() => {
    localStorage.setItem('mode', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    // Cierra el sidebar cuando cambia la ruta
    setIsSidebarOpen(false)
  }, [location])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <NavBar
        toggleSidebar={toggleSidebar}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      {user && ( // Solo renderiza el sidebar si hay un usuario autenticado
        <RightSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
       {user && <LeftSidebar />} {/* Agrega LeftSidebar aquí */}
      <div id="seccion-principal">
        <div className="ajusteancho" id="seccion-contenido">
          <main id="contenido">
            <Routes>
              <Route path="/" element={<Home />} />
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
        </div>
      </div>
      <Footer />
    </div>
  )
}
