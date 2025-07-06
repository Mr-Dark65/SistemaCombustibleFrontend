import { buildApiUrl, API_CONFIG } from '../config/api';
import authService from './authService';

class FuelService {
  // Registrar consumo de combustible
  async registerFuelConsumption(routeId, vehicleId, fuelAmount) {
    try {
      // Validación de datos antes de enviarlos
      if (!routeId || !vehicleId || !fuelAmount) {
        throw new Error("Todos los campos son obligatorios");
      }

      if (isNaN(fuelAmount) || fuelAmount <= 0) {
        throw new Error("La cantidad de combustible debe ser un número mayor que cero");
      }

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
        // Mostrar detalles de error detallados
        throw new Error(errorData.detail || 'Error al registrar consumo de combustible');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al registrar consumo:', error);
      let errorMessage = 'Error de conexión';
      if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  }

  // Obtener consumos de combustible
  async listFuelConsumptions() {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FUEL), {
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
      console.error('Error al listar consumos:', error);
      throw new Error(error.message || 'Error de conexión');
    }
  }
}

export default new FuelService();
