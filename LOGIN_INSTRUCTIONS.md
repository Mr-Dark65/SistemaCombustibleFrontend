# Instrucciones de Login - GECOM

## ✅ Cambios Realizados

### 1. **Componente Login Actualizado**
- Cambiado de `usuario`/`contraseña` a `username`/`password` para coincidir con tu backend
- Actualizado el placeholder del campo usuario
- Mejorado el manejo de errores con logs de consola

### 2. **Servicio de Autenticación Mejorado**
- Agregados logs de consola para debugging
- Mejor manejo de errores de red
- Configuración centralizada de URLs

### 3. **Configuración de API**
- Archivo `src/config/api.js` para centralizar configuración
- Función para verificar estado del backend
- URLs configurables

### 4. **Indicador de Estado del Backend**
- Componente `BackendStatus` que muestra si el backend está online
- Aparece en la esquina superior derecha

## 🔧 Cómo Funciona Ahora

### **Login:**
1. El usuario ingresa su `username` (nombre de usuario)
2. El usuario ingresa su `password` (contraseña)
3. Se envía petición POST a `http://localhost:8000/login`
4. El backend responde con token y rol
5. Se guarda el token en localStorage
6. Se redirige al dashboard

### **Formato de Petición:**
```json
POST http://localhost:8000/login
Content-Type: application/json

{
  "username": "tu_usuario",
  "password": "tu_contraseña"
}
```

### **Respuesta Esperada:**
```json
{
  "token": "jwt_token_here",
  "role": "usuario",
  "message": "Login exitoso"
}
```

## 🐛 Debugging

### **Logs en Consola:**
- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña "Console"
- Verás logs como:
  ```
  Intentando login con: {username: "usuario", password: "***"}
  Respuesta del servidor: 200
  Datos de login: {token: "...", role: "..."}
  ```

### **Indicador de Backend:**
- ✅ Backend Online: El backend está funcionando
- ❌ Backend Offline: El backend no está disponible

## 🚀 Para Probar

1. **Asegúrate de que tu backend esté ejecutándose en `localhost:8000`**
2. **Ejecuta el frontend:**
   ```bash
   npm start
   ```
3. **Ve a `http://localhost:3000`**
4. **Usa credenciales válidas de tu backend**

## 🔍 Solución de Problemas

### **Error: "Backend Offline"**
- Verifica que tu backend esté ejecutándose
- Verifica que esté en el puerto 8000
- Verifica que no haya errores en el backend

### **Error: "Credenciales inválidas"**
- Verifica que el usuario y contraseña sean correctos
- Revisa los logs en la consola del navegador
- Verifica que el endpoint `/login` esté funcionando

### **Error: "Error de conexión"**
- Verifica que el backend esté ejecutándose
- Verifica que no haya problemas de CORS
- Revisa la consola del navegador para más detalles

## 📝 Notas Importantes

1. **CORS**: Tu backend debe permitir peticiones desde `http://localhost:3000`
2. **Formato**: Los campos deben ser `username` y `password` (no `usuario` y `contraseña`)
3. **Token**: El token se guarda automáticamente en localStorage
4. **Logs**: Revisa la consola del navegador para debugging

## 🎯 Próximos Pasos

1. Probar el login con credenciales reales
2. Verificar que el token se guarde correctamente
3. Probar las peticiones autenticadas
4. Implementar logout funcional 