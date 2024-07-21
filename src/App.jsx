import { Route, Routes, Navigate } from 'react-router-dom'
import { useState } from 'react'
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

export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      <NavBar toggleSidebar={toggleSidebar} />
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
    </>
  )
}
