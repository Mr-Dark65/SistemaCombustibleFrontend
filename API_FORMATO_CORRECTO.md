# Formato Correcto de API - GECOM

## ✅ **Cambios Realizados**

### 1. **Login y Registro Actualizados**
- Cambiado a formato JSON con `Content-Type: application/json`
- Headers correctos para autenticación
- Manejo mejorado de errores

### 2. **Servicio de Vehículos Actualizado**
- Formato exacto que especificaste
- Token en header `'token': 'jwt_token'`
- JSON en el body para todas las peticiones

### 3. **Componente de Prueba de Vehículos**
- Interfaz para probar la API de vehículos
- Formulario para crear vehículos
- Lista de vehículos existentes

## 🔧 **Formato de Peticiones**

### **Login:**
```javascript
POST http://localhost:8000/login
Content-Type: application/json

{
  "username": "usuario",
  "password": "contraseña"
}
```

### **Registro:**
```javascript
POST http://localhost:8000/register
Content-Type: application/json

{
  "username": "nuevo_usuario",
  "password": "contraseña",
  "email": "usuario@ejemplo.com",
  "role": "usuario"
}
```

### **Obtener Vehículos:**
```javascript
GET http://localhost:8000/vehicles
Headers: {
  'token': 'jwt_token_aqui',
  'Content-Type': 'application/json'
}
```

### **Crear Vehículo:**
```javascript
POST http://localhost:8000/vehicles
Headers: {
  'token': 'jwt_token_aqui',
  'Content-Type': 'application/json'
}
Body: {
  "plate": "ABC123",
  "type": "Camión",
  "brand": "Volvo",
  "model": "FH",
  "year": 2022
}
```

## 🧪 **Cómo Probar**

### **1. Login:**
1. Ve a `http://localhost:3000`
2. Ingresa usuario y contraseña
3. Haz clic en "INICIAR SESIÓN"
4. Revisa la consola para logs

### **2. API de Vehículos:**
1. Después del login, ve a "Vehículos" en el menú
2. Haz clic en "Obtener Vehículos"
3. Llena el formulario y crea un vehículo
4. Revisa la consola para logs

## 📋 **Logs de Debugging**

### **En la Consola del Navegador:**
```
Intentando login con: {username: "usuario", password: "***"}
Enviando JSON: {username: "usuario", password: "***"}
Respuesta del servidor: 200
Datos de login: {token: "...", role: "..."}

Vehículos obtenidos: [...]
Vehículo creado: {...}
```

## 🎯 **Estructura de Archivos**

```
src/
├── services/
│   ├── authService.js      # Login y registro
│   └── vehicleService.js   # API de vehículos
├── components/
│   ├── Login.js           # Formulario de login
│   ├── Register.js        # Formulario de registro
│   └── VehicleTest.js     # Prueba de API de vehículos
└── config/
    └── api.js             # Configuración de URLs
```

## 🚀 **Para Ejecutar**

1. **Asegúrate de que tu backend esté ejecutándose en `localhost:8000`**
2. **Ejecuta el frontend:**
   ```bash
   npm start
   ```
3. **Ve a `http://localhost:3000`**
4. **Haz login con credenciales válidas**
5. **Ve a "Vehículos" para probar la API**

## 🔍 **Solución de Problemas**

### **Error 422:**
- Verifica que el backend esté funcionando
- Revisa los logs en la consola
- Usa el botón "Probar Formatos de API" en el login

### **Error 401:**
- Token expirado o inválido
- Haz logout y login nuevamente
- Verifica que el token se esté enviando correctamente

### **Error de CORS:**
- Verifica que el backend permita peticiones desde `localhost:3000`
- Revisa la configuración CORS del backend

## 📝 **Notas Importantes**

1. **Formato JSON**: Todas las peticiones usan JSON
2. **Token en Header**: El token se envía en el header `'token'`
3. **Content-Type**: Siempre `'application/json'`
4. **Logs**: Revisa la consola del navegador para debugging
5. **Pruebas**: Usa el componente VehicleTest para probar la API

¡El formato ahora coincide exactamente con lo que especificaste! 🎉 