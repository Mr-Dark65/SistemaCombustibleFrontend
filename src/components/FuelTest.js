import React, { useState } from 'react';
import fuelService from '../services/fuelService';

const FuelTest = () => {
  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newConsumption, setNewConsumption] = useState({
    routeId: '',
    vehicleId: '',
    fuelAmount: ''
  });

  const handleGetConsumptions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fuelService.listFuelConsumptions();
      setConsumptions(data);
      console.log('Consumos obtenidos:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener consumos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConsumption = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await fuelService.registerFuelConsumption(
        parseInt(newConsumption.routeId),
        parseInt(newConsumption.vehicleId),
        parseFloat(newConsumption.fuelAmount)
      );
      console.log('Consumo registrado:', result);
      
      // Limpiar formulario
      setNewConsumption({
        routeId: '',
        vehicleId: '',
        fuelAmount: ''
      });
      
      // Actualizar lista
      handleGetConsumptions();
    } catch (err) {
      setError(err.message);
      console.error('Error al registrar consumo:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewConsumption({
      ...newConsumption,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Prueba de API de Consumo de Combustible</h2>
      
      {/* Obtener Consumos */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Obtener Consumos de Combustible</h3>
        <button 
          onClick={handleGetConsumptions} 
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
          {loading ? 'Cargando...' : 'Obtener Consumos'}
        </button>
      </div>

      {/* Registrar Consumo */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Registrar Nuevo Consumo</h3>
        <form onSubmit={handleCreateConsumption}>
          <div style={{ marginBottom: '10px' }}>
            <label>ID de Ruta: </label>
            <input
              type="number"
              name="routeId"
              value={newConsumption.routeId}
              onChange={handleInputChange}
              placeholder="1"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>ID de Vehículo: </label>
            <input
              type="number"
              name="vehicleId"
              value={newConsumption.vehicleId}
              onChange={handleInputChange}
              placeholder="1"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Cantidad de Combustible (L): </label>
            <input
              type="number"
              name="fuelAmount"
              value={newConsumption.fuelAmount}
              onChange={handleInputChange}
              placeholder="50.5"
              step="0.1"
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
            {loading ? 'Registrando...' : 'Registrar Consumo'}
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

      {/* Lista de Consumos */}
      <div>
        <h3>Consumos de Combustible ({consumptions.length})</h3>
        {consumptions.length === 0 ? (
          <p>No hay consumos para mostrar</p>
        ) : (
          <div>
            {consumptions.map((consumption, index) => (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #ddd', 
                  padding: '10px', 
                  marginBottom: '10px',
                  borderRadius: '4px'
                }}
              >
                <strong>ID de Ruta:</strong> {consumption.route_id}<br/>
                <strong>ID de Vehículo:</strong> {consumption.vehicle_id}<br/>
                <strong>Cantidad:</strong> {consumption.fuel_amount} L
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelTest; 