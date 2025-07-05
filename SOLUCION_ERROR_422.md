# Solución para Error 422 (Unprocessable Entity)

## 🔍 **Análisis del Problema**

El error 422 indica que el backend está recibiendo la petición pero hay un problema con el formato de los datos. Esto suele ocurrir cuando:

1. **Formato incorrecto**: El backend espera un formato diferente al que estamos enviando
2. **Campos faltantes**: Faltan campos requeridos
3. **Validación fallida**: Los datos no pasan las validaciones del backend

## 🛠️ **Soluciones Implementadas**

### 1. **Mejorado el Manejo de Errores**
- Agregados logs detallados en la consola
- Mejor parsing de errores del backend
- Información más clara sobre qué está fallando

### 2. **Cambiado a Form Data**
- FastAPI por defecto espera `FormData` para parámetros simples
- Cambiado de JSON a `FormData` para login y registro

### 3. **Herramienta de Prueba**
- Botón "Probar Formatos de API" en el login
- Prueba automáticamente 3 formatos diferentes:
  - Form Data
  - JSON
  - URL Encoded

## 🧪 **Cómo Usar la Herramienta de Prueba**

1. **Llena los campos** de usuario y contraseña
2. **Haz clic en "Probar Formatos de API"**
3. **Abre la consola del navegador** (F12 → Console)
4. **Revisa los resultados** de cada formato

### **Resultados Esperados:**
```
=== Test 1: Form Data ===
Form Data Result: { status: 200, ok: true, body: "..." }

=== Test 2: JSON ===
JSON Result: { status: 422, ok: false, body: "..." }

=== Test 3: URL Encoded ===
URL Encoded Result: { status: 200, ok: true, body: "..." }
```

## 🔧 **Posibles Soluciones**

### **Opción 1: Si Form Data funciona**
El backend espera `FormData`. Ya está configurado correctamente.

### **Opción 2: Si JSON funciona**
Cambiar de vuelta a JSON en `authService.js`:

```javascript
const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username,
    password
  })
});
```

### **Opción 3: Si URL Encoded funciona**
Cambiar a URL Encoded en `authService.js`:

```javascript
const urlEncoded = new URLSearchParams();
urlEncoded.append('username', username);
urlEncoded.append('password', password);

const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: urlEncoded
});
```

## 📋 **Verificación del Backend**

### **1. Verificar el endpoint:**
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test&password=test"
```

### **2. Verificar la documentación:**
Ve a `http://localhost:8000/docs` para ver la documentación de FastAPI

### **3. Verificar los logs del backend:**
Revisa la consola donde está ejecutándose tu backend para ver errores

## 🎯 **Próximos Pasos**

1. **Prueba el botón "Probar Formatos de API"**
2. **Revisa la consola del navegador**
3. **Identifica qué formato funciona**
4. **Ajusta el código según sea necesario**
5. **Prueba el login nuevamente**

## 📞 **Si el problema persiste**

1. **Comparte los logs de la consola** del navegador
2. **Comparte los logs del backend**
3. **Verifica que el backend esté funcionando** en `http://localhost:8000`
4. **Prueba el endpoint directamente** con curl o Postman 