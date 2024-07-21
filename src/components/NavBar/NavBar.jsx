import { NavLink } from 'react-router-dom'
import './NavBar.css'
import PropTypes from 'prop-types'

export const NavBar = ({ toggleSidebar }) => {
  return (
    <header>
      <nav>
        <div className="ajusteancho" id="seccion-principal-nav">
          <NavLink to="/" aria-current="page">
            Inicio
          </NavLink>
          <a href="#">Acerca de...</a>
          <NavLink to="/login">Cuenta</NavLink>
          <button onClick={toggleSidebar}>Toggle Sidebar</button>
        </div>
        <div className="ajusteancho" id="seccion-busqueda">
          <input type="text" placeholder="Buscar" />
          <button type="submit">Buscar</button>
        </div>
      </nav>
    </header>
  )
}
NavBar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired
}
