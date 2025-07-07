import React, { useState, useEffect } from 'react';
import routeService from '../services/routeService';
import './RouteTest.css';

const RouteTest = () => {
  const [state, setState] = useState({
    routes: [],
    filteredRoutes: [],
    loading: false,
    error: '',
    searchTerm: '',
    newRoute: {
      origin: '',
      destination: '',
      distance: ''
    },
    showModal: false,
    editRoute: null
  });

  const { routes, filteredRoutes, loading, error, searchTerm, newRoute, showModal, editRoute } = state;

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Cargar las rutas
  const loadRoutes = async () => {
    updateState({ loading: true, error: '' });
    try {
      const data = await routeService.listRoutes();
      console.log('Rutas cargadas:', data); // Depuración
      const routes = data.routes || [];  // Asegurarse de que 'routes' existe y es un array
      updateState({ routes: routes, filteredRoutes: routes, loading: false });
    } catch (err) {
      console.error('Error al cargar rutas:', err); // Depuración
      updateState({ error: err.message || 'Error al cargar rutas', loading: false });
    }
  };

  const handleSearch = (term) => {
    updateState({ searchTerm: term });
    if (!term) {
      updateState({ filteredRoutes: routes });
      return;
    }
    const filtered = routes.filter((route) =>
      route.origin.toLowerCase().includes(term.toLowerCase()) ||
      route.destination.toLowerCase().includes(term.toLowerCase()) ||
      route.distance.toString().includes(term)
    );
    updateState({ filteredRoutes: filtered });
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    updateState({ loading: true, error: '' });

    try {
      const result = await routeService.createRoute(
        newRoute.origin,
        newRoute.destination,
        parseFloat(newRoute.distance)
      );

      const updatedRoutes = await routeService.listRoutes();
      updateState({
        routes: updatedRoutes,
        filteredRoutes: updatedRoutes,
        newRoute: { origin: '', destination: '', distance: '' },
        showModal: false,
        loading: false
      });
    } catch (err) {
      updateState({ error: err.message || 'Error al crear ruta', loading: false });
    }
  };

  const handleEditRoute = async (route) => {
    updateState({
      editRoute: route,
      newRoute: { origin: route.origin, destination: route.destination, distance: route.distance },
      showModal: true
    });
  };

  const handleUpdateRoute = async (e) => {
    e.preventDefault();
    updateState({ loading: true, error: '' });

    try {
      const updatedRoute = await routeService.updateRoute(
        editRoute.id,
        newRoute.origin,
        newRoute.destination,
        parseFloat(newRoute.distance)
      );

      // Actualizar la ruta en el estado sin necesidad de recargar todas las rutas
      const updatedRoutes = routes.map((route) => 
        route.id === editRoute.id ? { ...route, ...updatedRoute } : route
      );

      updateState({
        routes: updatedRoutes,
        filteredRoutes: updatedRoutes,
        newRoute: { origin: '', destination: '', distance: '' },
        showModal: false,
        loading: false,
        editRoute: null
      });
    } catch (err) {
      updateState({ error: err.message || 'Error al actualizar ruta', loading: false });
    }
  };

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta ruta?')) {
      updateState({ loading: true, error: '' });
      try {
        await routeService.deleteRoute(routeId);
        
        // Eliminar la ruta del estado local sin necesidad de recargar desde el backend
        const updatedRoutes = routes.filter((route) => route.id !== routeId);
        updateState({
          routes: updatedRoutes,
          filteredRoutes: updatedRoutes,
          loading: false
        });
      } catch (err) {
        updateState({ error: err.message || 'Error al eliminar ruta', loading: false });
      }
    }
  };

  const handleInputChange = (e) => {
    updateState({
      newRoute: {
        ...newRoute,
        [e.target.name]: e.target.value
      }
    });
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  return (
    <div className="driver-container">
      <div className="driver-header-container">
        <h1 className="driver-header">Gestión de Rutas</h1>
        <div className="driver-search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar rutas..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={loading}
            />
            <button className="search-button" disabled={loading}>🔍</button>
          </div>
          <button
            onClick={() => updateState({ showModal: true })}
            className="driver-button driver-button-primary"
            disabled={loading}
          >
            Añadir Ruta
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
        {loading && filteredRoutes.length === 0 ? (
          <div className="driver-loading">
            <div className="spinner"></div>
            <p>Cargando rutas...</p>
          </div>
        ) : (
          <div className="driver-table-wrapper">
            <table className="driver-table">
              <thead>
                <tr>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Distancia (km)</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route, index) => (
                    <tr key={index}>
                      <td>{route.origin}</td>
                      <td>{route.destination}</td>
                      <td>{route.distance}</td>
                      <td className="actions-cell">
                        <button 
                          className="driver-action-button edit"
                          onClick={() => handleEditRoute(route)}
                          disabled={loading}
                        >
                          <span className="text">Editar</span>
                        </button>
                        <button 
                          className="driver-action-button delete"
                          onClick={() => handleDeleteRoute(route.id)}
                          disabled={loading}
                        >
                          <span className="text">Eliminar</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="driver-table-empty">
                      {searchTerm ? 'No se encontraron resultados' : 'No hay rutas registradas'}
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
              <h2>{editRoute ? 'Editar Ruta' : 'Registrar Nueva Ruta'}</h2>
              <button
                onClick={() => updateState({ showModal: false, editRoute: null })}
                className="driver-modal-close"
                disabled={loading}
              >
                ×
              </button>
            </div>

            <form onSubmit={editRoute ? handleUpdateRoute : handleCreateRoute} className="driver-form">
              <div className="form-group">
                <label htmlFor="route-origin">Origen*</label>
                <input
                  id="route-origin"
                  type="text"
                  name="origin"
                  value={newRoute.origin}
                  onChange={handleInputChange}
                  required
                  placeholder="Quito"
                />
              </div>

              <div className="form-group">
                <label htmlFor="route-destination">Destino*</label>
                <input
                  id="route-destination"
                  type="text"
                  name="destination"
                  value={newRoute.destination}
                  onChange={handleInputChange}
                  required
                  placeholder="Guayaquil"
                />
              </div>

              <div className="form-group">
                <label htmlFor="route-distance">Distancia (km)*</label>
                <input
                  id="route-distance"
                  type="number"
                  name="distance"
                  value={newRoute.distance}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                  placeholder="420"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => updateState({ showModal: false, editRoute: null })} className="button secondary" disabled={loading}>Cancelar</button>
                <button type="submit" className="button primary" disabled={loading}>
                  {loading ? 'Guardando...' : editRoute ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteTest;
