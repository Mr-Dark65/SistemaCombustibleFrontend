export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    // Autenticación
    LOGIN: '/login',
    REGISTER: '/register',
    VALIDATE_TOKEN: '/validate-token',
    
    // Vehículos
    VEHICLES: '/vehicles',
    
    // Rutas
    ROUTES: '/routes',
    
    // Consumo de combustible
    FUEL: '/fuel',
    
    // Conductores
    DRIVERS: '/drivers',
    
    // Health check
    HEALTH: '/health'
  }
};

export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const LICENSE_TYPES = {
  LIGHT: 0,
  HEAVY: 1,
  BOTH: 2
};

export const VEHICLE_TYPES = {
  LIGHT: 'Liviana',
  HEAVY: 'Pesada'
};

export const VEHICLE_STATUS = {
  AVAILABLE: 'Disponible',
  IN_USE: 'En uso',
  MAINTENANCE: 'En mantenimiento',
  DISABLED: 'Deshabilitado'
};

export const USER_ROLES = {
  ADMIN: 'Admin',
  SUPERVISOR: 'Supervisor',
  OPERATOR: 'Operador'
};