import { buildApiUrl, API_CONFIG } from '../config/api';
import authService from './authService';

class DriverService {
  normalizeDriver(driver) {
    return {
      ...driver,
      licenseType: driver.license_type,
      createdAt: driver.created_at
    };
  }

  async listDrivers() {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DRIVERS), {
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al listar conductores');
      }

      const data = await response.json();
      return Array.isArray(data.drivers) ? data.drivers.map(this.normalizeDriver) : [];
    } catch (error) {
      console.error('Error en listDrivers:', error);
      throw error;
    }
  }

  async registerDriver(driverData) {
    try {
      const payload = {
        name: driverData.name,
        license_type: Number(driverData.licenseType),
        availability: Boolean(driverData.availability)
      };

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DRIVERS), {
        method: 'POST',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.detail || 'Error al registrar conductor';
        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).join(', ');
        }
        throw new Error(errorMessage);
      }

      return this.normalizeDriver(await response.json());
    } catch (error) {
      console.error('Error en registerDriver:', error);
      throw error;
    }
  }

  async updateDriver(driverId, driverData) {
    try {
      const payload = {
        name: driverData.name,
        license_type: Number(driverData.licenseType),
        availability: Boolean(driverData.availability)
      };

      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.DRIVERS)}/${driverId}`, {
        method: 'PUT',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        if (errorData.detail) errorMessage = errorData.detail;
        if (errorData.errors) {
          errorMessage = Object.entries(errorData.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
        }
        throw new Error(errorMessage);
      }

      return this.normalizeDriver(await response.json());
    } catch (error) {
      console.error('Error en updateDriver:', error);
      throw error;
    }
  }

  async deleteDriver(driverId) {
    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.DRIVERS)}/${driverId}`, {
        method: 'DELETE',
        headers: {
          'token': authService.getToken(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.detail || 'Error al eliminar conductor';
        if (errorData.message) errorMessage = errorData.message;
        throw new Error(errorMessage);
      }

      return true;
    } catch (error) {
      console.error('Error en deleteDriver:', error);
      throw error;
    }
  }
}

const driverServiceInstance = new DriverService();
export default driverServiceInstance;