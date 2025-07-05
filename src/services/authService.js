import { buildApiUrl, API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

class AuthService {
  // Función para registrar un nuevo usuario
  async register(username, password, email, role) {
    try {
      // Crear URL con query parameters
      const url = new URL(buildApiUrl(API_CONFIG.ENDPOINTS.REGISTER));
      url.searchParams.append('username', username);
      url.searchParams.append('password', password);
      url.searchParams.append('email', email);
      url.searchParams.append('role', role);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el registro');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Función para iniciar sesión
  async login(username, password) {
    try {
      console.log('Intentando login con:', { username, password });
      
      // Crear URL con query parameters
      const url = new URL(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN));
      url.searchParams.append('username', username);
      url.searchParams.append('password', password);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      console.log('Respuesta del servidor:', response.status);

      if (!response.ok) {
        console.log('Error response status:', response.status);
        
        let errorData;
        try {
          errorData = await response.json();
          console.log('Error response body:', errorData);
        } catch (parseError) {
          console.log('Could not parse error response as JSON');
          errorData = { detail: `Error ${response.status}: ${response.statusText}` };
        }
        
        if (errorData.detail && Array.isArray(errorData.detail)) {
          const errorMessages = errorData.detail.map(err => 
            typeof err === 'object' ? JSON.stringify(err) : err
          ).join(', ');
          throw new Error(errorMessages);
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Datos de login:', data);
      
      // Guardar el token en localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.role);
      }

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Función para cerrar sesión
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  }

  // Función para obtener el token actual
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Función para verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.getToken();
  }

  // Función para hacer peticiones autenticadas
  async authenticatedRequest(url, options = {}) {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'token': token,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
        throw new Error('Sesión expirada');
      }
      throw new Error('Error en la petición');
    }

    return response.json();
  }
}

export default new AuthService(); 