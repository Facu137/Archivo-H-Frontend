// src/App.jsx
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext' // Asegúrate de importar useAuth
// components
import { NavBar } from './components/NavBar/NavBar'
import RightSidebar from './components/RightSidebar/RightSidebar'
import { Footer } from './components/Footer/Footer'
// pages
import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'
import { MiCuenta } from './pages/MiCuenta/MiCuenta'
import { GestionArchivo } from './pages/GestionArchivo/GestionArchivo'
import { VerArchivo } from './pages/VerArchivo/VerArchivo'
import { Registrar } from './pages/Registrar/Registrar'
import { Institucional } from './pages/Institucional/Institucional'
import './index.css'

export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('mode')
    return savedMode ? savedMode === 'dark' : true
  })
  const { user } = useAuth() // Obtén el estado de autenticación
  const location = useLocation() // Obtén la ubicación actual

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
      <div className="main-container">
        <div className="ajusteancho content" id="seccion-contenido">
          <main id="contenido">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<Registrar />} />
              <Route path="/cuenta" element={<MiCuenta />} />
              <Route path="/gestion" element={<GestionArchivo />} />
              <Route path="/visor" element={<VerArchivo />} />
              <Route path="/institucional" element={<Institucional />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  )
}
