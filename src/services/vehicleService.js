import { buildApiUrl, API_CONFIG } from '../config/api';
import authService from './authService';

class VehicleService {
  // Crear un nuevo vehículo
  async createVehicle(plate, type, brand, model, year) {
    try {
      const url = new URL(buildApiUrl(API_CONFIG.ENDPOINTS.VEHICLES));
      url.searchParams.append('plate', plate);
      url.searchParams.append('type', type);
      url.searchParams.append('brand', brand);
      url.searchParams.append('model', model);
      url.searchParams.append('year', year);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al crear vehículo');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Listar todos los vehículos
  async listVehicles(typeFilter = null, statusFilter = null) {
    try {
      const url = new URL(buildApiUrl(API_CONFIG.ENDPOINTS.VEHICLES));
      if (typeFilter) url.searchParams.append('type_filter', typeFilter);
      if (statusFilter) url.searchParams.append('status_filter', statusFilter);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al listar vehículos');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Obtener un vehículo específico
  async getVehicle(vehicleId) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.VEHICLES}/${vehicleId}`), {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener vehículo');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Actualizar estado de un vehículo
  async updateVehicleStatus(vehicleId, newStatus) {
    try {
      const url = new URL(buildApiUrl(`${API_CONFIG.ENDPOINTS.VEHICLES}/${vehicleId}/status`));
      url.searchParams.append('new_status', newStatus);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al actualizar estado del vehículo');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Asignar conductor a un vehículo
  async assignDriver(vehicleId, driverId) {
    try {
      const url = new URL(buildApiUrl(`${API_CONFIG.ENDPOINTS.VEHICLES}/${vehicleId}/assign-driver`));
      url.searchParams.append('driver_id', driverId);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
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

export default new VehicleService(); 