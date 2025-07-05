# Implementación de Autenticación - GECOM

## Descripción

Se ha implementado un sistema completo de autenticación para la aplicación GECOM que incluye:

- **Login**: Inicio de sesión con username y password
- **Registro**: Creación de nuevas cuentas de usuario
- **Gestión de tokens**: Almacenamiento y uso de tokens JWT
- **Servicios de API**: Ejemplo de cómo hacer peticiones autenticadas

## Endpoints Implementados

### 1. Login
- **URL**: `POST http://localhost:8000/login`
- **Body**: 
  ```json
  {
    "username": "usuario",
    "password": "contraseña"
  }
  ```
- **Respuesta exitosa**:
  ```json
  {
    "token": "jwt_token_here",
    "role": "usuario",
    "message": "Login exitoso"
  }
  ```

### 2. Registro
- **URL**: `POST http://localhost:8000/register`
- **Body**:
  ```json
  {
    "username": "nuevo_usuario",
    "password": "contraseña",
    "email": "usuario@ejemplo.com",
    "role": "usuario"
  }
  ```
- **Respuesta exitosa**:
  ```json
  {
    "success": true,
    "message": "Usuario registrado exitosamente",
    "user_id": "123"
  }
  ```

## Archivos Creados/Modificados

### Nuevos Archivos
- `src/services/authService.js` - Servicio de autenticación
- `src/services/vehicleService.js` - Ejemplo de servicio con autenticación
- `src/components/Register.js` - Componente de registro
- `AUTH_README.md` - Este archivo

### Archivos Modificados
- `src/components/Login.js` - Integrado con el servicio de autenticación
- `src/components/Login.css` - Agregados estilos para registro
- `src/App.js` - Agregada ruta de registro y manejo de tokens

## Características Implementadas

### 1. Gestión de Tokens
- Los tokens JWT se almacenan en `localStorage`
- Verificación automática de tokens al cargar la aplicación
- Logout que limpia los tokens

### 2. Validaciones
- Campos requeridos
- Validación de contraseñas coincidentes
- Longitud mínima de contraseña
- Formato de email básico

### 3. Manejo de Errores
- Mensajes de error específicos
- Manejo de errores de red
- Redirección automática en caso de sesión expirada

### 4. Peticiones Autenticadas
- Función `authenticatedRequest` para peticiones con token
- Headers automáticos con el token
- Manejo de errores 401 (no autorizado)

## Uso de los Servicios

### Autenticación
```javascript
import authService from './services/authService';

// Login
const loginData = await authService.login(username, password);

// Registro
const registerData = await authService.register(username, password, email, role);

// Logout
authService.logout();

// Verificar si está autenticado
const isAuth = authService.isAuthenticated();
```

### Peticiones Autenticadas
```javascript
import vehicleService from './services/vehicleService';

// Obtener vehículos (con token automático)
const vehicles = await vehicleService.getVehicles();

// Crear vehículo
const newVehicle = await vehicleService.createVehicle(vehicleData);
```

## Configuración del Backend

Asegúrate de que tu backend en `localhost:8000` tenga los siguientes endpoints configurados:

```python
@app.post("/register", tags=["Auth"])
def register(username: str, password: str, email: str, role: str):
    # Tu lógica de registro aquí
    pass

@app.post("/login", tags=["Auth"])
def login(username: str, password: str):
    # Tu lógica de login aquí
    pass
```

## Notas Importantes

1. **CORS**: Asegúrate de que tu backend permita peticiones desde `http://localhost:3000`
2. **Tokens**: Los tokens se almacenan en localStorage por simplicidad. Para producción, considera usar httpOnly cookies
3. **Validación**: Considera agregar validación de tokens en el backend
4. **Seguridad**: Implementa rate limiting y otras medidas de seguridad en el backend

## Próximos Pasos

1. Implementar validación de tokens en el backend
2. Agregar refresh tokens
3. Implementar recuperación de contraseña
4. Agregar roles y permisos más granulares
5. Implementar logging de actividades de autenticación 