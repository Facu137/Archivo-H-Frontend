// src/App.jsx
import { Route, Routes, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
import './index.css' // Asegúrate de importar los estilos globales

export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Obtener el modo almacenado en localStorage al iniciar la aplicación
    const savedMode = localStorage.getItem('mode')
    return savedMode ? savedMode === 'dark' : true
  })

  useEffect(() => {
    // Guardar el modo actual en localStorage cada vez que cambie
    localStorage.setItem('mode', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

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
      <RightSidebar isOpen={isSidebarOpen} />
      <div id="seccion-principal">
        <div className="ajusteancho" id="seccion-contenido">
          <main id="contenido">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registrar" element={<Registrar />} />
              <Route path="/cuenta" element={<MiCuenta />} />
              <Route path="/gestion" element={<GestionArchivo />} />
              <Route path="/visor" element={<VerArchivo />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
