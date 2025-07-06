import { buildApiUrl, API_CONFIG, VEHICLE_TYPES, VEHICLE_STATUS } from '../config/api';
import authService from './authService';

class VehicleService {
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

      console.log('Respuesta de GET /vehicles:', response.status, response.statusText);
      const data = await response.json();
      console.log('Datos de GET /vehicles:', data);

      if (!response.ok) {
        const error = await this._handleErrorResponse(response, data);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en listVehicles:', error);
      throw error;
    }
  }

  async createVehicle(plate, type, brand, model, year) {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.VEHICLES), {
        method: 'POST',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plate,
          type,
          brand,
          model,
          year: parseInt(year)
        })
      });

      console.log('Respuesta de POST /vehicles:', response.status, response.statusText);
      const data = await response.json();
      console.log('Datos de POST /vehicles:', data);

      if (!response.ok) {
        const error = await this._handleErrorResponse(response, data);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en createVehicle:', error);
      throw error;
    }
  }

  async updateVehicleStatus(vehicleId, newStatus) {
    const validStatuses = Object.values(VEHICLE_STATUS);
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Estado inválido: ${newStatus}. Debe ser uno de: ${validStatuses.join(', ')}`);
    }

    try {
      const url = new URL(buildApiUrl(`${API_CONFIG.ENDPOINTS.VEHICLES}/${vehicleId}/status`));
      url.searchParams.append('new_status', newStatus);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta de PUT /vehicles/:id/status:', response.status, response.statusText);
      console.log('URL enviada en PUT /vehicles/:id/status:', url.toString());
      const data = await response.json();
      console.log('Datos de PUT /vehicles/:id/status:', data);

      if (!response.ok) {
        const error = await this._handleErrorResponse(response, data);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en updateVehicleStatus:', error);
      throw error;
    }
  }

  async _handleErrorResponse(response, errorData = null) {
    if (response.status === 401) {
      authService.logout();
      return new Error('Sesión expirada. Por favor inicie sesión nuevamente');
    }

    try {
      const data = errorData || await response.json();
      if (Array.isArray(data.detail)) {
        const errorMessages = data.detail.map(err => 
          `${err.loc.join('.')}: ${err.msg} (${err.type})`
        ).join('; ');
        return new Error(errorMessages || `Error ${response.status}: ${response.statusText}`);
      }
      return new Error(data.detail || data.message || `Error ${response.status}: ${response.statusText}`);
    } catch {
      return new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
}

export default new VehicleService();