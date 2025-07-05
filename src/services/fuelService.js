import { buildApiUrl, API_CONFIG } from '../config/api';
import authService from './authService';

class FuelService {
  // Registrar consumo de combustible
  async registerFuelConsumption(routeId, vehicleId, fuelAmount) {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FUEL), {
        method: 'POST',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route_id: routeId,
          vehicle_id: vehicleId,
          fuel_amount: fuelAmount
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al registrar consumo de combustible');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Obtener un registro de consumo específico
  async getFuelConsumption(consumptionId) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.FUEL}/${consumptionId}`), {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener consumo de combustible');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Listar consumos de combustible con filtros opcionales
  async listFuelConsumptions(routeId = null, vehicleId = null, vehicleType = null) {
    try {
      const url = new URL(buildApiUrl(API_CONFIG.ENDPOINTS.FUEL));
      if (routeId) url.searchParams.append('route_id', routeId);
      if (vehicleId) url.searchParams.append('vehicle_id', vehicleId);
      if (vehicleType) url.searchParams.append('vehicle_type', vehicleType);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al listar consumos de combustible');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Reporte de consumo por tipo de vehículo
  async getReportByVehicleType(vehicleType) {
    try {
      const url = new URL(buildApiUrl(`${API_CONFIG.ENDPOINTS.FUEL}/report/by-vehicle-type`));
      url.searchParams.append('vehicle_type', vehicleType);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener reporte por tipo de vehículo');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Comparar consumo estimado vs real para una ruta
  async compareEstimatedVsReal(routeId) {
    try {
      const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.FUEL}/compare/${routeId}`), {
        method: 'GET',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al comparar consumo estimado vs real');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }
}

export default new FuelService(); 