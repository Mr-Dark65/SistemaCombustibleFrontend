import React, { useState, useEffect } from 'react';
import fuelService from '../services/fuelService';
import './FuelTest.css';

const FuelTest = () => {
  const [state, setState] = useState({
    consumptions: [],
    filteredConsumptions: [],
    loading: false,
    error: '',
    searchTerm: '',
    showModal: false,
    newConsumption: {
      routeId: '',
      vehicleId: '',
      fuelAmount: ''
    }
  });

  const { consumptions, filteredConsumptions, loading, error, searchTerm, showModal, newConsumption } = state;

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const loadConsumptions = async () => {
    updateState({ loading: true, error: '' });
    try {
      const data = await fuelService.listFuelConsumptions();
      updateState({
        consumptions: data,
        filteredConsumptions: data,
        loading: false
      });
    } catch (err) {
      updateState({
        error: err.message || 'Error al cargar consumos',
        loading: false
      });
    }
  };

  const handleSearch = (term) => {
    updateState({ searchTerm: term });
    if (!term) {
      updateState({ filteredConsumptions: consumptions });
      return;
    }
    const filtered = consumptions.filter(consumption =>
      consumption.route_id.toString().includes(term) ||
      consumption.vehicle_id.toString().includes(term) ||
      consumption.fuel_amount.toString().includes(term)
    );
    updateState({ filteredConsumptions: filtered });
  };

  const handleCreateConsumption = async (e) => {
    e.preventDefault();
    updateState({ loading: true, error: '' });

    try {
      // Registrar consumo de combustible
      await fuelService.registerFuelConsumption(
        parseInt(newConsumption.routeId),
        parseInt(newConsumption.vehicleId),
        parseFloat(newConsumption.fuelAmount)
      );
      
      // Recargar los consumos después de registrar
      await loadConsumptions();
      updateState({
        showModal: false,
        newConsumption: {
          routeId: '',
          vehicleId: '',
          fuelAmount: ''
        }
      });
    } catch (err) {
      // Manejar error mostrando mensaje más claro
      updateState({
        error: err.message || 'Error al registrar consumo',
        loading: false
      });
    }
  };

  const handleInputChange = (e) => {
    updateState({
      newConsumption: {
        ...newConsumption,
        [e.target.name]: e.target.value
      }
    });
  };

  useEffect(() => {
    loadConsumptions();
  }, []);

  return (
    <div className="fuel-container">
      <div className="fuel-header-container">
        <h1 className="fuel-header">Gestión de Consumo de Combustible</h1>

        <div className="fuel-search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar consumos..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={loading}
            />
            <button className="search-button" disabled={loading}>
              🔍
            </button>
          </div>

          <button 
            onClick={() => updateState({ showModal: true })}
            className="fuel-button fuel-button-primary"
            disabled={loading}
          >
            Registrar Consumo
          </button>
        </div>
      </div>

      {error && (
        <div className="fuel-error">
          <span>⚠️</span>
          <div className="error-message">{error}</div>
        </div>
      )}

      <div className="fuel-content">
        {loading && filteredConsumptions.length === 0 ? (
          <div className="fuel-loading">
            <div className="spinner"></div>
            <p>Cargando consumos...</p>
          </div>
        ) : (
          <div className="fuel-table-wrapper">
            <table className="fuel-table">
              <thead>
                <tr>
                  <th>ID Ruta</th>
                  <th>ID Vehículo</th>
                  <th>Combustible (L)</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {filteredConsumptions.length > 0 ? (
                  filteredConsumptions.map((consumption, index) => (
                    <tr key={index}>
                      <td>{consumption.route_id}</td>
                      <td>{consumption.vehicle_id}</td>
                      <td>{consumption.fuel_amount}</td>
                      <td>{new Date(consumption.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="fuel-table-empty">
                      {searchTerm ? 'No se encontraron resultados' : 'No hay consumos registrados'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fuel-modal-overlay">
          <div className="fuel-modal">
            <div className="fuel-modal-header">
              <h2>Registrar Nuevo Consumo</h2>
              <button 
                onClick={() => updateState({ 
                  showModal: false,
                  newConsumption: {
                    routeId: '',
                    vehicleId: '',
                    fuelAmount: ''
                  }
                })}
                className="fuel-modal-close"
                disabled={loading}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateConsumption} className="fuel-form">
              <div className="form-group">
                <label htmlFor="route-id">ID de Ruta*</label>
                <input
                  id="route-id"
                  type="number"
                  name="routeId"
                  value={newConsumption.routeId}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: 1"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vehicle-id">ID de Vehículo*</label>
                <input
                  id="vehicle-id"
                  type="number"
                  name="vehicleId"
                  value={newConsumption.vehicleId}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: 1"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fuel-amount">Cantidad (Litros)*</label>
                <input
                  id="fuel-amount"
                  type="number"
                  name="fuelAmount"
                  value={newConsumption.fuelAmount}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: 50.5"
                  step="0.1"
                  min="0.1"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  onClick={() => updateState({ 
                    showModal: false,
                    newConsumption: {
                      routeId: '',
                      vehicleId: '',
                      fuelAmount: ''
                    }
                  })}
                  className="button secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="button primary"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelTest;
