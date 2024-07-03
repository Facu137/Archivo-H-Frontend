import { Link, NavLink } from "react-router-dom";
import "./NavBar.css";

export const NavBar = () => {
  return (
    <header>
      <nav>
        <div className="ajusteancho" id="seccion-principal-nav">
          <NavLink to="/" aria-current="page">
            Inicio
          </NavLink>
          <a href="#">Acerca de...</a>
          <NavLink to="/login">
            Cuenta
          </NavLink>
        </div>
        <div className="ajusteancho" id="seccion-busqueda">
          <input type="text" placeholder="Buscar" />
          <button type="submit">Buscar</button>
        </div>
        <div className="ajusteancho" id="seccion-informacion">
          <h1>Archivo Historico</h1>
        </div>
      </nav>
    </header>
  );
};
