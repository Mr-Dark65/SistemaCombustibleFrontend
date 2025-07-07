import React, { useState } from 'react'; // Añade { useState } aquí
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Menú Lateral - Ahora ocupa toda la altura */}
      <aside className={`sidebar ${menuOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h2>GECOM</h2>
          <button className="menu-toggle" onClick={toggleMenu}>
            {menuOpen ? '◄' : '►'}
          </button>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            {user.avatar || (user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U')}
          </div>
          {menuOpen && (
            <div className="user-info">
              <span className="welcome">Bienvenido</span>
              <span className="username">{user.nombre || user.username || 'Usuario'}</span>
              <span className="user-role">{user.rol || 'Usuario'}</span>
            </div>
          )}
        </div>

        <nav className="main-menu">
          <ul>
            <li>
              <Link to="/choferes">
                <i className="icon">👨‍✈️</i>
                {menuOpen && <span>Servicio de Conductores</span>}
              </Link>
            </li>
            <li>
              <Link to="/vehiculos">
                <i className="icon">🚛</i>
                {menuOpen && <span>Servicio de Vehículos</span>}
              </Link>
            </li>
            <li>
              <Link to="/rutas">
                <i className="icon">🗺️</i>
                {menuOpen && <span>Servicio de Rutas</span>}
              </Link>
            </li>
            <li>
              <Link to="/combustible">
                <i className="icon">⛽</i>
                {menuOpen && <span>Consumo de Combustible</span>}
              </Link>
            </li>
            
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <i className="icon">🚪</i>
            {menuOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className={`main-content ${menuOpen ? 'menu-open' : 'menu-collapsed'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;