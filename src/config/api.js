// Configuración de la API
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
  
  // Función para construir URLs completas
  export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  };
  
  // Constantes para tipos de licencia
  export const LICENSE_TYPES = {
    LIGHT: 0,
    HEAVY: 1,
    BOTH: 2
  };
  
  // Constantes para estados de vehículos
  export const VEHICLE_STATUS = {
    AVAILABLE: 'Disponible',
    IN_USE: 'En uso',
    MAINTENANCE: 'En mantenimiento',
    OUT_OF_SERVICE: 'Fuera de servicio'
  };
  
  // Constantes para tipos de vehículos
  export const VEHICLE_TYPES = {
    TRUCK: 'Camión',
    CAR: 'Automóvil',
    VAN: 'Furgoneta',
    BUS: 'Autobús',
    TRACTOR: 'Tractor'
  };
  
  // Constantes para roles de usuario
  export const USER_ROLES = {
    ADMIN: 'Admin',
    SUPERVISOR: 'Supervisor',
    OPERATOR: 'Operador'
  }; 