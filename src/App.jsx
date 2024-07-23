// src/App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import { NavBar } from "./components/NavBar/NavBar";
import { Footer } from "./components/Footer/Footer";
import { Home } from "./routes/Home/Home";
import { Login } from "./routes/Login/Login";
import { MiCuenta } from "./routes/MiCuenta/MiCuenta";
import { GestionArchivo } from "./routes/GestionArchivo/GestionArchivo";
import { VerArchivo } from "./routes/VerArchivo/VerArchivo";
import { Registrar } from "./routes/Registrar/Registrar";

export const App = () => {
  return (
    <>
      <NavBar />
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
  );
};