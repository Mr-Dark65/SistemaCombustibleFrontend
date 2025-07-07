import React, { useState, useEffect } from 'react';
import driverService from '../services/driverService';
import './DriverTest.css';

const LICENSE_TYPES = {
  LIGHT: 0,
  HEAVY: 1,
  BOTH: 2
};

const LICENSE_TYPE_LABELS = {
  [LICENSE_TYPES.LIGHT]: 'Liviana',
  [LICENSE_TYPES.HEAVY]: 'Pesada',
  [LICENSE_TYPES.BOTH]: 'Ambas'
};

const DriverTest = () => {
  const [state, setState] = useState({
    drivers: [],
    filteredDrivers: [],
    loading: false,
    error: '',
    showModal: false,
    searchTerm: '',
    newDriver: {
      id: null,
      name: '',
      licenseType: LICENSE_TYPES.LIGHT,
      availability: true
    }
  });

  const { drivers, filteredDrivers, loading, error, showModal, searchTerm, newDriver } = state;

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const loadDrivers = async () => {
    updateState({ loading: true, error: '' });
    try {
      const data = await driverService.listDrivers();
      updateState({ 
        drivers: data,
        filteredDrivers: data,
        loading: false 
      });
    } catch (err) {
      updateState({ 
        error: err.message || 'Error al cargar conductores',
        loading: false 
      });
      console.error('Error al cargar conductores:', err);
    }
  };

  const handleSearch = (term) => {
    updateState({ searchTerm: term });
    if (!term) {
      updateState({ filteredDrivers: drivers });
      return;
    }
    const filtered = drivers.filter(driver =>
      driver.name.toLowerCase().includes(term.toLowerCase()) ||
      LICENSE_TYPE_LABELS[driver.licenseType].toLowerCase().includes(term.toLowerCase())
    );
    updateState({ filteredDrivers: filtered });
  };

  const handleDeleteDriver = async (driverId) => {
    if (!window.confirm('¿Estás seguro de eliminar este conductor?')) {
      return;
    }

    updateState({ loading: true, error: '' });
    try {
      await driverService.deleteDriver(driverId);
      await loadDrivers();
    } catch (err) {
      updateState({ 
        error: err.message || 'Error al eliminar conductor',
        loading: false 
      });
      console.error('Error al eliminar:', err);
    }
  };

  const handleEditDriver = (driver) => {
    updateState({
      showModal: true,
      newDriver: {
        id: driver.id,
        name: driver.name,
        licenseType: driver.licenseType,
        availability: driver.availability
      }
    });
  };

  const handleSaveDriver = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!newDriver.name.trim()) {
      updateState({ error: 'El nombre es requerido' });
      return;
    }

    updateState({ loading: true, error: '' });
    
    try {
      const driverData = {
        name: newDriver.name.trim(),
        licenseType: Number(newDriver.licenseType),
        availability: Boolean(newDriver.availability)
      };

      let result;
      if (newDriver.id) {
        // Edición
        result = await driverService.updateDriver(newDriver.id, driverData);
      } else {
        // Creación
        result = await driverService.registerDriver(driverData);
      }

      if (!result?.id) {
        throw new Error('No se recibió respuesta válida del servidor');
      }

      await loadDrivers();
      updateState({
        showModal: false,
        newDriver: {
          id: null,
          name: '',
          licenseType: LICENSE_TYPES.LIGHT,
          availability: true
        }
      });
    } catch (err) {
      let errorMessage = err.message;
      
      // Mejorar mensaje para errores 422
      if (err.message.includes('422')) {
        errorMessage = 'Error de validación: ' + err.message.replace(/.*Error 422: /, '');
      }
      
      updateState({ 
        error: errorMessage,
        loading: false 
      });
      console.error('Error al guardar conductor:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateState({
      newDriver: {
        ...newDriver,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  return (
    <div className="driver-container">
      <div className="driver-header-container">
        <h1 className="driver-header">Gestión de Conductores</h1>
        
        <div className="driver-search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar conductores..."
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
              newDriver: {
                id: null,
                name: '',
                licenseType: LICENSE_TYPES.LIGHT,
                availability: true
              }
            })}
            className="driver-button driver-button-primary"
            disabled={loading}
          >
             Añadir Conductor
          </button>
        </div>
      </div>

      {error && (
        <div className="driver-error">
          <span>⚠️</span> 
          <div className="error-message">{error}</div>
        </div>
      )}

      <div className="driver-content">
        {loading && filteredDrivers.length === 0 ? (
          <div className="driver-loading">
            <div className="spinner"></div>
            <p>Cargando conductores...</p>
          </div>
        ) : (
          <div className="driver-table-wrapper">
            <table className="driver-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo de Licencia</th>
                  <th>Disponibilidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.length > 0 ? (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>{driver.name}</td>
                      <td>{LICENSE_TYPE_LABELS[driver.licenseType] || 'Desconocida'}</td>
                      <td>
                        <span className={`driver-status ${driver.availability ? 'available' : 'unavailable'}`}>
                          {driver.availability ? 'Disponible' : 'No disponible'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="driver-action-button edit"
                          onClick={() => handleEditDriver(driver)}
                          disabled={loading}
                          title="Editar conductor"
                        >
                         
                          <span className="text">Editar</span>
                        </button>
                        <button 
                          className="driver-action-button delete"
                          onClick={() => handleDeleteDriver(driver.id)}
                          disabled={loading}
                          title="Eliminar conductor"
                        >
                          
                          <span className="text">Eliminar</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="driver-table-empty">
                      {searchTerm ? 'No se encontraron resultados' : 'No hay conductores registrados'}
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
              <h2>{newDriver.id ? 'Editar Conductor' : 'Registrar Nuevo Conductor'}</h2>
              <button 
                onClick={() => updateState({ 
                  showModal: false,
                  newDriver: {
                    id: null,
                    name: '',
                    licenseType: LICENSE_TYPES.LIGHT,
                    availability: true
                  }
                })}
                className="driver-modal-close"
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSaveDriver} className="driver-form">
              <div className="form-group">
                <label htmlFor="driver-name">Nombre completo*</label>
                <input
                  id="driver-name"
                  type="text"
                  name="name"
                  value={newDriver.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  minLength={3}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="license-type">Tipo de licencia*</label>
                <select
                  id="license-type"
                  name="licenseType"
                  value={newDriver.licenseType}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  {Object.entries(LICENSE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  name="availability"
                  checked={newDriver.availability}
                  onChange={handleInputChange}
                  id="availability"
                  disabled={loading}
                />
                <label htmlFor="availability">Disponible para asignación</label>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button"
                  onClick={() => updateState({ 
                    showModal: false,
                    newDriver: {
                      id: null,
                      name: '',
                      licenseType: LICENSE_TYPES.LIGHT,
                      availability: true
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

export default DriverTest;