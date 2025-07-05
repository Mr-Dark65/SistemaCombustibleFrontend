import React, { useState } from 'react';
import driverService from '../services/driverService';
import { LICENSE_TYPES } from '../config/api';

const DriverTest = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newDriver, setNewDriver] = useState({
    name: '',
    licenseType: LICENSE_TYPES.LIGHT,
    availability: true
  });

  const handleGetDrivers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await driverService.listDrivers();
      setDrivers(data);
      console.log('Conductores obtenidos:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener conductores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDriver = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await driverService.registerDriver(
        newDriver.name,
        newDriver.licenseType,
        newDriver.availability
      );
      console.log('Conductor creado:', result);
      
      // Limpiar formulario
      setNewDriver({
        name: '',
        licenseType: LICENSE_TYPES.LIGHT,
        availability: true
      });
      
      // Actualizar lista
      handleGetDrivers();
    } catch (err) {
      setError(err.message);
      console.error('Error al crear conductor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDriver({
      ...newDriver,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const getLicenseTypeName = (type) => {
    switch (type) {
      case LICENSE_TYPES.LIGHT: return 'Liviana';
      case LICENSE_TYPES.HEAVY: return 'Pesada';
      case LICENSE_TYPES.BOTH: return 'Ambas';
      default: return 'Desconocida';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Prueba de API de Conductores</h2>
      
      {/* Obtener Conductores */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Obtener Conductores</h3>
        <button 
          onClick={handleGetDrivers} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Cargando...' : 'Obtener Conductores'}
        </button>
      </div>

      {/* Crear Conductor */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Crear Nuevo Conductor</h3>
        <form onSubmit={handleCreateDriver}>
          <div style={{ marginBottom: '10px' }}>
            <label>Nombre: </label>
            <input
              type="text"
              name="name"
              value={newDriver.name}
              onChange={handleInputChange}
              placeholder="Juan Pérez"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Tipo de Licencia: </label>
            <select
              name="licenseType"
              value={newDriver.licenseType}
              onChange={handleInputChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value={LICENSE_TYPES.LIGHT}>Liviana</option>
              <option value={LICENSE_TYPES.HEAVY}>Pesada</option>
              <option value={LICENSE_TYPES.BOTH}>Ambas</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input
                type="checkbox"
                name="availability"
                checked={newDriver.availability}
                onChange={handleInputChange}
                style={{ marginRight: '5px' }}
              />
              Disponible
            </label>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Creando...' : 'Crear Conductor'}
          </button>
        </form>
      </div>

      {/* Mostrar Error */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Lista de Conductores */}
      <div>
        <h3>Conductores ({drivers.length})</h3>
        {drivers.length === 0 ? (
          <p>No hay conductores para mostrar</p>
        ) : (
          <div>
            {drivers.map((driver, index) => (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #ddd', 
                  padding: '10px', 
                  marginBottom: '10px',
                  borderRadius: '4px'
                }}
              >
                <strong>Nombre:</strong> {driver.name}<br/>
                <strong>Tipo de Licencia:</strong> {getLicenseTypeName(driver.license_type)}<br/>
                <strong>Disponible:</strong> {driver.availability ? 'Sí' : 'No'}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverTest; 