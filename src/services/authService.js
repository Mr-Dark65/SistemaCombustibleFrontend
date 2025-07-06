import { buildApiUrl, API_CONFIG } from '../config/api';

class AuthService {
  // Registrar nuevo usuario
  async register(username, password, email, role) {
    try {
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
      console.error('Error en register:', error);
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Iniciar sesión
  async login(username, password) {
    try {
      const url = new URL(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN));
      url.searchParams.append('username', username);
      url.searchParams.append('password', password);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el login');
      }

      const data = await response.json();
      this._handleTokenResponse(data);
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Manejar respuesta del token
  _handleTokenResponse(data) {
    if (!data.token) {
      throw new Error('No se recibió token en la respuesta');
    }
    localStorage.setItem('authToken', data.token);
    if (data.role) localStorage.setItem('userRole', data.role);
    if (data.user_id) localStorage.setItem('userId', data.user_id);
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
  }

  // Obtener token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Verificar autenticación
  isAuthenticated() {
    return !!this.getToken();
  }

  // Obtener rol del usuario
  getUserRole() {
    return localStorage.getItem('userRole');
  }

  // Validar token
  async validateToken() {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.VALIDATE_TOKEN), {
        method: 'POST',
        headers: {
          'token': this.getToken()
        }
      });

      if (!response.ok) {
        throw new Error('Token inválido');
      }

      return await response.json();
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();