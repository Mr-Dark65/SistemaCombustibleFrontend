import { buildApiUrl, API_CONFIG } from '../config/api';
import authService from './authService';

class RouteService {
  // Crear una nueva ruta
  async createRoute(origin, destination, distance) {
    const token = authService.getToken();  // Obtener el token

    if (!token) {
      throw new Error('No se encontró un token válido');
    }

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROUTES), {
        method: 'POST',
        headers: {
          'token': token,  // Enviar el token en las cabeceras
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
    const token = authService.getToken();  // Obtener el token

    if (!token) {
      throw new Error('No se encontró un token válido');
    }

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROUTES), {
        method: 'GET',
        headers: {
          'token': token,  // Enviar el token en las cabeceras
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
    const token = authService.getToken();  // Obtener el token

    if (!token) {
      throw new Error('No se encontró un token válido');
    }

    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ROUTES}/${routeId}`), {
        method: 'GET',
        headers: {
          'token': token,  // Enviar el token en las cabeceras
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
    const token = authService.getToken();  // Obtener el token

    if (!token) {
      throw new Error('No se encontró un token válido');
    }

    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ROUTES}/${routeId}`), {
        method: 'PUT',
        headers: {
          'token': token,  // Enviar el token en las cabeceras
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

  // Eliminar una ruta
  async deleteRoute(routeId) {
    const token = authService.getToken();  // Obtener el token

    if (!token) {
      throw new Error('No se encontró un token válido');
    }

    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.ROUTES}/${routeId}`), {
        method: 'DELETE',
        headers: {
          'token': token,  // Enviar el token en las cabeceras
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al eliminar ruta');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }
}

export default new RouteService();
