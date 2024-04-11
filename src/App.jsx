import { Route, Routes, Navigate } from "react-router-dom";

import { NavBar } from "./components/NavBar/NavBar";
import { Home } from "./routes/Home/Home";
import { Login } from "./routes/Login/Login";
import { MiCuenta } from "./routes/MiCuenta/MiCuenta";
import { GestionArchivo } from "./routes/GestionArchivo/GestionArchivo";
import { VerArchivo } from "./routes/VerArchivo/VerArchivo";

export const App = () => {
  return (
    <>
        <NavBar />

        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path="/cuenta" element={<MiCuenta></MiCuenta>}></Route>
          <Route path="/gestion" element={<GestionArchivo></GestionArchivo>}></Route>
          <Route path="/visor" element={<VerArchivo></VerArchivo>}></Route>
          <Route path='/*' element={<Navigate to='/' />}></Route>
        </Routes>
    </>
  );
};
