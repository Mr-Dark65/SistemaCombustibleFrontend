import React, { useState } from 'react';
import routeService from '../services/routeService';

const RouteTest = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newRoute, setNewRoute] = useState({
    origin: '',
    destination: '',
    distance: ''
  });

  const handleGetRoutes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await routeService.listRoutes();
      setRoutes(data);
      console.log('Rutas obtenidas:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error al obtener rutas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await routeService.createRoute(
        newRoute.origin,
        newRoute.destination,
        parseFloat(newRoute.distance)
      );
      console.log('Ruta creada:', result);
      
      // Limpiar formulario
      setNewRoute({
        origin: '',
        destination: '',
        distance: ''
      });
      
      // Actualizar lista
      handleGetRoutes();
    } catch (err) {
      setError(err.message);
      console.error('Error al crear ruta:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewRoute({
      ...newRoute,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Prueba de API de Rutas</h2>
      
      {/* Obtener Rutas */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Obtener Rutas</h3>
        <button 
          onClick={handleGetRoutes} 
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
          {loading ? 'Cargando...' : 'Obtener Rutas'}
        </button>
      </div>

      {/* Crear Ruta */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Crear Nueva Ruta</h3>
        <form onSubmit={handleCreateRoute}>
          <div style={{ marginBottom: '10px' }}>
            <label>Origen: </label>
            <input
              type="text"
              name="origin"
              value={newRoute.origin}
              onChange={handleInputChange}
              placeholder="Quito"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Destino: </label>
            <input
              type="text"
              name="destination"
              value={newRoute.destination}
              onChange={handleInputChange}
              placeholder="Guayaquil"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Distancia (km): </label>
            <input
              type="number"
              name="distance"
              value={newRoute.distance}
              onChange={handleInputChange}
              placeholder="420"
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
            {loading ? 'Creando...' : 'Crear Ruta'}
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

      {/* Lista de Rutas */}
      <div>
        <h3>Rutas ({routes.length})</h3>
        {routes.length === 0 ? (
          <p>No hay rutas para mostrar</p>
        ) : (
          <div>
            {routes.map((route, index) => (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #ddd', 
                  padding: '10px', 
                  marginBottom: '10px',
                  borderRadius: '4px'
                }}
              >
                <strong>Origen:</strong> {route.origin}<br/>
                <strong>Destino:</strong> {route.destination}<br/>
                <strong>Distancia:</strong> {route.distance} km
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteTest; 