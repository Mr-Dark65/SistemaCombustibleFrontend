import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import vehicleService from '../services/vehicleService';
import authService from '../services/authService';
import { VEHICLE_TYPES, VEHICLE_STATUS } from '../config/api';
import './VehicleTest.css';

const VehicleTest = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    vehicles: [],
    filteredVehicles: [],
    loading: false,
    error: '',
    showModal: false,
    searchTerm: '',
    newVehicle: {
      id: null,
      plate: '',
      type: '',
      brand: '',
      model: '',
      year: '',
      status: VEHICLE_STATUS.AVAILABLE
    }
  });

  const { vehicles, filteredVehicles, loading, error, showModal, searchTerm, newVehicle } = state;

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const loadVehicles = async () => {
    updateState({ loading: true, error: '' });
    try {
      const data = await vehicleService.listVehicles();
      updateState({ 
        vehicles: data.vehicles || [],
        filteredVehicles: data.vehicles || [],
        loading: false 
      });
    } catch (err) {
      updateState({ 
        error: err.message || 'Error al cargar vehículos',
        loading: false 
      });
      console.error('Error al cargar vehículos:', err);
    }
  };

  const handleSearch = (term) => {
    updateState({ searchTerm: term });
    if (!term) {
      updateState({ filteredVehicles: vehicles });
      return;
    }
    const filtered = vehicles.filter(vehicle =>
      vehicle.plate.toLowerCase().includes(term.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(term.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(term.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(term.toLowerCase()) ||
      vehicle.year.toString().includes(term) ||
      vehicle.status.toLowerCase().includes(term.toLowerCase())
    );
    updateState({ filteredVehicles: filtered });
  };

  const handleEditVehicle = (vehicle) => {
    updateState({
      showModal: true,
      newVehicle: {
        id: vehicle.id,
        plate: vehicle.plate,
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year.toString(),
        status: vehicle.status || VEHICLE_STATUS.AVAILABLE
      }
    });
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!newVehicle.plate.trim() || !newVehicle.type || !newVehicle.brand || !newVehicle.model || !newVehicle.year) {
      updateState({ error: 'Todos los campos son requeridos' });
      return;
    }

    updateState({ loading: true, error: '' });
    try {
      const vehicleData = {
        plate: newVehicle.plate.trim(),
        type: newVehicle.type,
        brand: newVehicle.brand,
        model: newVehicle.model,
        year: parseInt(newVehicle.year)
      };

      let result;
      if (newVehicle.id) {
        await vehicleService.updateVehicleStatus(newVehicle.id, newVehicle.status);
        updateState({ error: '' });
      } else {
        result = await vehicleService.createVehicle(
          vehicleData.plate,
          vehicleData.type,
          vehicleData.brand,
          vehicleData.model,
          vehicleData.year
        );
      }

      if (!result?.id && !newVehicle.id) {
        throw new Error('No se recibió respuesta válida del servidor');
      }

      await loadVehicles();
      updateState({
        showModal: false,
        newVehicle: {
          id: null,
          plate: '',
          type: '',
          brand: '',
          model: '',
          year: '',
          status: VEHICLE_STATUS.AVAILABLE
        }
      });
    } catch (err) {
      let errorMessage = err.message;
      if (err.message.includes('422')) {
        errorMessage = 'Error de validación: ' + err.message.replace(/.*Error 422: /, '');
      }
      updateState({ 
        error: errorMessage,
        loading: false 
      });
      console.error('Error al guardar vehículo:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    updateState({
      newVehicle: {
        ...newVehicle,
        [name]: type === 'number' ? value : value
      }
    });
  };

  const handleStatusChange = (e) => {
    updateState({
      newVehicle: {
        ...newVehicle,
        status: e.target.value
      }
    });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadVehicles();
  }, [navigate]);

  return (
    <div className="driver-container">
      <div className="driver-header-container">
        <h1 className="driver-header">Gestión de Vehículos</h1>
        
        <div className="driver-search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar vehículos..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={loading}
            />
            <button className="search-button" disabled={loading}>
              🔍
            </button>
          </div>
          
          <button 
            onClick={() => updateState({ 
              showModal: true,
              newVehicle: {
                id: null,
                plate: '',
                type: '',
                brand: '',
                model: '',
                year: '',
                status: VEHICLE_STATUS.AVAILABLE
              }
            })}
            className="driver-button driver-button-primary"
            disabled={loading}
          >
            Añadir Vehículo
          </button>
        </div>
      </div>

      {error && (
        <div className="driver-error">
          <span>⚠️</span> 
          <div className="error-message">{error}</div>
          {error.includes('Sesión expirada') && (
            <button onClick={handleLoginRedirect} className="button secondary">
              Ir a Iniciar Sesión
            </button>
          )}
        </div>
      )}

      <div className="driver-content">
        {loading && filteredVehicles.length === 0 ? (
          <div className="driver-loading">
            <div className="spinner"></div>
            <p>Cargando vehículos...</p>
          </div>
        ) : (
          <div className="driver-table-wrapper">
            <table className="driver-table">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Tipo</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.plate}</td>
                      <td>{vehicle.type}</td>
                      <td>{vehicle.brand}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.year}</td>
                      <td>
                        <span className={`driver-status ${vehicle.status.toLowerCase().includes('disponible') ? 'available' : 'unavailable'}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="driver-action-button edit"
                          onClick={() => handleEditVehicle(vehicle)}
                          disabled={loading}
                          title="Editar vehículo"
                        >
                         
                          <span className="text">Editar</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="driver-table-empty">
                      {searchTerm ? 'No se encontraron resultados' : 'No hay vehículos registrados'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="driver-modal-overlay">
          <div className="driver-modal">
            <div className="driver-modal-header">
              <h2>{newVehicle.id ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo'}</h2>
              <button 
                onClick={() => updateState({ 
                  showModal: false,
                  newVehicle: {
                    id: null,
                    plate: '',
                    type: '',
                    brand: '',
                    model: '',
                    year: '',
                    status: VEHICLE_STATUS.AVAILABLE
                  }
                })}
                className="driver-modal-close"
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSaveVehicle} className="driver-form">
              <div className="form-group">
                <label htmlFor="vehicle-plate">Placa*</label>
                <input
                  id="vehicle-plate"
                  type="text"
                  name="plate"
                  value={newVehicle.plate}
                  onChange={handleInputChange}
                  required
                  pattern="[A-Za-z]{3}\d{3,4}"
                  title="Formato: ABC123 o ABC1234"
                  disabled={newVehicle.id}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="vehicle-type">Tipo*</label>
                <select
                  id="vehicle-type"
                  name="type"
                  value={newVehicle.type}
                  onChange={handleInputChange}
                  required
                  disabled={newVehicle.id}
                >
                  <option value="">Seleccione tipo</option>
                  <option value={VEHICLE_TYPES.LIGHT}>{VEHICLE_TYPES.LIGHT}</option>
                  <option value={VEHICLE_TYPES.HEAVY}>{VEHICLE_TYPES.HEAVY}</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="vehicle-brand">Marca*</label>
                <input
                  id="vehicle-brand"
                  type="text"
                  name="brand"
                  value={newVehicle.brand}
                  onChange={handleInputChange}
                  required
                  disabled={newVehicle.id}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="vehicle-model">Modelo*</label>
                <input
                  id="vehicle-model"
                  type="text"
                  name="model"
                  value={newVehicle.model}
                  onChange={handleInputChange}
                  required
                  disabled={newVehicle.id}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="vehicle-year">Año*</label>
                <input
                  id="vehicle-year"
                  type="number"
                  name="year"
                  value={newVehicle.year}
                  onChange={handleInputChange}
                  min="2000"
                  max={new Date().getFullYear() + 1}
                  required
                  disabled={newVehicle.id}
                />
              </div>
              
              {newVehicle.id && (
                <div className="form-group">
                  <label htmlFor="vehicle-status">Estado*</label>
                  <select
                    id="vehicle-status"
                    name="status"
                    value={newVehicle.status}
                    onChange={handleStatusChange}
                    required
                  >
                    <option value="">Seleccione estado</option>
                    {Object.values(VEHICLE_STATUS).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  type="button"
                  onClick={() => updateState({ 
                    showModal: false,
                    newVehicle: {
                      id: null,
                      plate: '',
                      type: '',
                      brand: '',
                      model: '',
                      year: '',
                      status: VEHICLE_STATUS.AVAILABLE
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
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTest;