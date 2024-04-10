import { Route, Routes, Navigate } from "react-router-dom";

import { NavBar } from "./routes/components/NavBar";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";


export const App = () => {
  return (
    <>
        <NavBar />

        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/*' element={<Navigate to='/' />}></Route>
        </Routes>
    </>
  );
};
