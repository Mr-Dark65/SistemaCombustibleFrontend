import { buildApiUrl, API_CONFIG } from '../config/api';
import authService from './authService';

class RouteService {
  // Crear una nueva ruta
  async createRoute(origin, destination, distance) {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROUTES), {
        method: 'POST',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          origin,
          destination,
          distance
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear ruta');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Listar todas las rutas
  async listRoutes() {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROUTES), {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al listar rutas');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Obtener una ruta específica
  async getRoute(routeId) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ROUTES}/${routeId}`), {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener ruta');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Actualizar una ruta
  async updateRoute(routeId, origin, destination, distance) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ROUTES}/${routeId}`), {
        method: 'PUT',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          origin,
          destination,
          distance
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar ruta');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Asignar vehículo a una ruta
  async assignVehicleToRoute(routeId, vehicleId) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ROUTES}/${routeId}/assign-vehicle`), {
        method: 'PUT',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicle_id: vehicleId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al asignar vehículo a ruta');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Calcular consumo de combustible para una ruta
  async calculateFuelConsumption(routeId) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ROUTES}/${routeId}/fuel-consumption`), {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al calcular consumo de combustible');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }
}

export default new RouteService(); 