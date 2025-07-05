import { buildApiUrl, API_CONFIG } from '../config/api';
import authService from './authService';

class DriverService {
  // Registrar un nuevo conductor
  async registerDriver(name, licenseType, availability) {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DRIVERS), {
        method: 'POST',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          license_type: licenseType,
          availability
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar conductor');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Obtener un conductor específico
  async getDriver(driverId) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.DRIVERS}/${driverId}`), {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener conductor');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Listar conductores con filtros opcionales
  async listDrivers(availability = null, licenseType = null) {
    try {
      const url = new URL(buildApiUrl(API_CONFIG.ENDPOINTS.DRIVERS));
      if (availability !== null) url.searchParams.append('availability', availability);
      if (licenseType !== null) url.searchParams.append('license_type', licenseType);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al listar conductores');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Actualizar datos de un conductor
  async updateDriver(driverId, name, licenseType, availability) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.DRIVERS}/${driverId}`), {
        method: 'PUT',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          license_type: licenseType,
          availability
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar conductor');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Asignar conductor a ruta y vehículo
  async assignDriver(driverId, routeId, vehicleId) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.DRIVERS}/${driverId}/assign`), {
        method: 'POST',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route_id: routeId,
          vehicle_id: vehicleId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al asignar conductor');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }
}

export default new DriverService(); 