import { Link, NavLink } from "react-router-dom";
import "./NavBar.css";

export const NavBar = () => {
  return (
    <header>
      <nav>
        <div class="ajusteancho" id="seccion-principal">
          <NavLink to="/" className="nav-link active" aria-current="page">
            Inicio
          </NavLink>
          <a href="#">Acerca de...</a>
          <NavLink to="/login" className="nav-link">
            Cuenta
          </NavLink>
        </div>
        <div class="ajusteancho" id="seccion-busqueda">
          <input type="text" placeholder="Buscar" />
          <button type="submit">Buscar</button>
        </div>
        <div class="ajusteancho" id="seccion-informacion">
          <h1>Archivo Historico</h1>
        </div>
      </nav>
    </header>
  );
};
