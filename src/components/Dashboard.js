import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fuelService from '../services/fuelService'; // Asegúrate de tener el servicio de combustible configurado
import vehicleService from '../services/vehicleService'; // Asegúrate de tener el servicio de vehículos configurado
import { VEHICLE_TYPES, VEHICLE_STATUS } from '../config/api';
import './Dashboard.css';

const Dashboard = ({ user = {}, onLogout }) => {
  const navigate = useNavigate();

  // Estado del componente
  const [state, setState] = useState({
    nombre: user.nombre || 'Operador',
    rol: user.rol || 'Usuario',
    vehicles: [],  // Inicializamos como un array vacío
    consumptions: [],
    loading: true,
    error: ''
  });

  // Función para actualizar el estado
  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Función para cargar los datos (vehículos y consumos de combustible)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener los vehículos desde el backend
        const vehiclesData = await vehicleService.listVehicles();
        
        // Verificar si la respuesta tiene la estructura esperada (un array de vehículos)
        if (!Array.isArray(vehiclesData.vehicles)) {
          throw new Error('Datos de vehículos no válidos');
        }

        // Obtener los consumos de combustible
        const fuelData = await fuelService.listFuelConsumptions();

        // Actualizar el estado con los datos obtenidos
        setState({
          ...state,
          vehicles: vehiclesData.vehicles,  // Asegúrate de acceder correctamente a la propiedad 'vehicles'
          consumptions: fuelData,
          loading: false
        });
      } catch (err) {
        // Si ocurre un error, actualizar el estado con el mensaje de error
        setState({ ...state, error: 'Error al cargar datos', loading: false });
      }
    };

    loadData();
  }, []);

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
              <span className="user-name">{state.nombre}</span>
              <span className="user-role">{state.rol}</span>
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
            {state.loading ? (
              <p>Cargando...</p>
            ) : state.error ? (
              <p>{state.error}</p>
            ) : (
              state.vehicles.length > 0 ? (
                state.vehicles.map(vehicle => (
                  <div key={vehicle.id} className={`maquina-card ${vehicle.status}`}>
                    <h3>{vehicle.type} <span>#{vehicle.id}</span></h3>
                    <div className="consumo-info">
                      <div className="consumo-value">
                        {/* Mostrar el consumo de combustible asociado a cada vehículo */}
                        <span>{vehicle.fuelConsumption || 0}</span>
                        <small>LITROS/DÍA</small>
                      </div>
                      <div className="consumo-actions">
                        <button className="btn-registrar">Registrar Carga</button>
                        <button className="btn-detalles">Ver Historial</button>
                      </div>
                    </div>
                    <div className="maquina-status">
                      Estado: <span>{vehicle.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay vehículos disponibles.</p>
              )
            )}
          </div>
        </section>

        <section className="analytics-section">
          <h2><i className="icon-analytics"></i>Métricas Generales</h2>
          {/* Aquí puedes agregar más métricas como la suma del combustible consumido, promedio, etc */}
          {state.consumptions.length > 0 && (
            <div className="metrics-container">
              <div className="metric-card">
                <h3>Total Combustible Consumido</h3>
                <div className="metric-value">
                  {/* Calcular y mostrar el total de combustible consumido */}
                  {state.consumptions.reduce((acc, curr) => acc + curr.fuel_amount, 0)} L
                </div>
              </div>
              <div className="metric-card">
                <h3>Total de Vehículos</h3>
                <div className="metric-value">
                  {/* Mostrar el número total de vehículos */}
                  {state.vehicles.length}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
