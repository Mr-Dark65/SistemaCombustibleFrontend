import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user = {}, onLogout }) => {
  const navigate = useNavigate();
  
  // Valores por defecto seguros
  const { nombre = 'Operador', rol = 'Usuario' } = user;
  const maquinas = [
    { id: 'EX-002', tipo: 'Excavadora', consumo: 42, estado: 'activa' },
    { id: 'BL-015', tipo: 'Bulldozer', consumo: 38, estado: 'mantenimiento' },
    { id: 'GR-009', tipo: 'Grúa', consumo: 25, estado: 'activa' }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand-title">
            <h1>GECOM</h1>
            <p>Panel de Control de Combustible</p>
          </div>
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">{nombre}</span>
              <span className="user-role">{rol}</span>
            </div>
            <button 
              onClick={() => {
                onLogout?.();
                navigate('/');
              }}
              className="logout-button"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="consumo-section">
          <h2><i className="icon-fuel"></i>Registro de Consumo</h2>
          <div className="maquinas-grid">
            {maquinas.map(maquina => (
              <div key={maquina.id} className={`maquina-card ${maquina.estado}`}>
                <h3>{maquina.tipo} <span>#{maquina.id}</span></h3>
                <div className="consumo-info">
                  <div className="consumo-value">
                    <span>{maquina.consumo}</span>
                    <small>LITROS/DÍA</small>
                  </div>
                  <div className="consumo-actions">
                    <button className="btn-registrar">Registrar Carga</button>
                    <button className="btn-detalles">Ver Historial</button>
                  </div>
                </div>
                <div className="maquina-status">
                  Estado: <span>{maquina.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-section">
          <h2><i className="icon-analytics"></i>Métricas Generales</h2>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;