import React, { useState, useEffect } from 'react';
import vehicleService from '../services/vehicleService';
import { VEHICLE_TYPES, VEHICLE_STATUS } from '../config/api';

const VehicleTest = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newVehicle, setNewVehicle] = useState({
    plate: '',
    type: '',
    brand: '',
    model: '',
    year: ''
  });

  // Cargar vehículos automáticamente al montar el componente
  useEffect(() => {
    console.log('VehicleTest: Componente montado, cargando vehículos...');
    handleGetVehicles();
  }, []);

  const handleGetVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('VehicleTest: Iniciando petición para obtener vehículos...');
      const data = await vehicleService.listVehicles();
      console.log('VehicleTest: Respuesta del servicio:', data);
      setVehicles(Array.isArray(data) ? data : []);
      console.log('VehicleTest: Vehículos establecidos en estado:', Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('VehicleTest: Error al obtener vehículos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await vehicleService.createVehicle(
        newVehicle.plate,
        newVehicle.type,
        newVehicle.brand,
        newVehicle.model,
        parseInt(newVehicle.year)
      );
      console.log('Vehículo creado:', result);
      
      // Limpiar formulario
      setNewVehicle({
        plate: '',
        type: '',
        brand: '',
        model: '',
        year: ''
      });
      
      // Actualizar lista
      handleGetVehicles();
    } catch (err) {
      setError(err.message);
      console.error('Error al crear vehículo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewVehicle({
      ...newVehicle,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Prueba de API de Vehículos</h2>
      
      {/* Obtener Vehículos */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Obtener Vehículos</h3>
        <button 
          onClick={handleGetVehicles} 
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
          {loading ? 'Cargando...' : 'Obtener Vehículos'}
        </button>
      </div>

      {/* Crear Vehículo */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Crear Nuevo Vehículo</h3>
        <form onSubmit={handleCreateVehicle}>
          <div style={{ marginBottom: '10px' }}>
            <label>Placa: </label>
            <input
              type="text"
              name="plate"
              value={newVehicle.plate}
              onChange={handleInputChange}
              placeholder="ABC123"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Tipo: </label>
            <select
              name="type"
              value={newVehicle.type}
              onChange={handleInputChange}
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="">Seleccionar tipo</option>
              <option value={VEHICLE_TYPES.TRUCK}>{VEHICLE_TYPES.TRUCK}</option>
              <option value={VEHICLE_TYPES.CAR}>{VEHICLE_TYPES.CAR}</option>
              <option value={VEHICLE_TYPES.VAN}>{VEHICLE_TYPES.VAN}</option>
              <option value={VEHICLE_TYPES.BUS}>{VEHICLE_TYPES.BUS}</option>
              <option value={VEHICLE_TYPES.TRACTOR}>{VEHICLE_TYPES.TRACTOR}</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Marca: </label>
            <input
              type="text"
              name="brand"
              value={newVehicle.brand}
              onChange={handleInputChange}
              placeholder="Volvo"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Modelo: </label>
            <input
              type="text"
              name="model"
              value={newVehicle.model}
              onChange={handleInputChange}
              placeholder="FH"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Año: </label>
            <input
              type="number"
              name="year"
              value={newVehicle.year}
              onChange={handleInputChange}
              placeholder="2022"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
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
            {loading ? 'Creando...' : 'Crear Vehículo'}
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

      {/* Lista de Vehículos */}
      <div>
        <h3>Vehículos ({vehicles.length})</h3>
        {loading ? (
          <p>Cargando vehículos...</p>
        ) : vehicles.length === 0 ? (
          <div>
            <p>No hay vehículos para mostrar</p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Haz clic en "Obtener Vehículos" para cargar la lista o crea un nuevo vehículo.
            </p>
          </div>
        ) : (
          <div>
            {vehicles.map((vehicle, index) => (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #ddd', 
                  padding: '10px', 
                  marginBottom: '10px',
                  borderRadius: '4px'
                }}
              >
                <strong>Placa:</strong> {vehicle.plate}<br/>
                <strong>Tipo:</strong> {vehicle.type}<br/>
                <strong>Marca:</strong> {vehicle.brand}<br/>
                <strong>Modelo:</strong> {vehicle.model}<br/>
                <strong>Año:</strong> {vehicle.year}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleTest; 