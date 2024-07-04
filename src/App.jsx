import { Route, Routes, Navigate } from "react-router-dom";

import { NavBar } from "./components/NavBar/NavBar";
import { BreadCrums } from "./components/BreadCrums/BreadCrums";
import { Favoritos } from "./components/Favoritos/Favoritos";
import { Footer } from "./components/Footer/Footer";

import { Home } from "./routes/Home/Home";
import { Login } from "./routes/Login/Login";
import { MiCuenta } from "./routes/MiCuenta/MiCuenta";
import { GestionArchivo } from "./routes/GestionArchivo/GestionArchivo";
import { VerArchivo } from "./routes/VerArchivo/VerArchivo";


export const App = () => {
  return (
    <>
      <NavBar />
      <div id="seccion-principal">
        <div className="ajusteancho" id="seccion-contenido">
          <main id="contenido">
            <Routes>
                <Route path="/" element={<Home></Home>}></Route>
                <Route path="/login" element={<Login></Login>}></Route>
                <Route path="/cuenta" element={<MiCuenta></MiCuenta>}></Route>
                <Route path="/gestion" element={<GestionArchivo></GestionArchivo>}></Route>
                <Route path="/visor" element={<VerArchivo></VerArchivo>}></Route>
                <Route path="/*" element={<Navigate to="/" />}></Route>
            </Routes>
          </main>
        </div>
      </div>
      <Footer/>
    </>
  );
};
