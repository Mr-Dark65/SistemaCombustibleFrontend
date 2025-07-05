import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { testLoginFormats } from '../utils/apiTest';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testing, setTesting] = useState(false);
  const navigate = useNavigate();

  // Función para extraer el nombre del username
  const getNombreFromUsername = (username) => {
    return username
      .split(/[._]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // Función para determinar el rol
  const getRolFromUsername = (username) => {
    if (username.includes('Admin')) return 'Administrador';
    if (username.includes('Supervisor')) return 'Supervisor';
    if (username.includes('Operador')) return 'Operador';
    return 'Usuario';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!credentials.username || !credentials.password) {
        throw new Error('Por favor complete todos los campos');
      }

      // Intentar hacer login con el servicio de autenticación
      const loginData = await authService.login(credentials.username, credentials.password);
      
      // Crear objeto de usuario con los datos del login
      const userData = { 
        nombre: getNombreFromUsername(credentials.username),
        username: credentials.username,
        rol: loginData.role || getRolFromUsername(credentials.username),
        avatar: getNombreFromUsername(credentials.username).match(/\b(\w)/g).join(''),
        token: loginData.token
      };
      
      onLogin(userData);
      navigate('/');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestFormats = async () => {
    if (!credentials.username || !credentials.password) {
      setError('Por favor complete los campos antes de probar');
      return;
    }
    
    setTesting(true);
    setError('');
    
    try {
      console.log('=== Probando diferentes formatos de petición ===');
      const results = await testLoginFormats(credentials.username, credentials.password);
      console.log('Resultados de las pruebas:', results);
      
      // Mostrar el resultado en la consola y en la UI
      setError('Revisa la consola del navegador (F12) para ver los resultados de las pruebas');
    } catch (err) {
      setError('Error al probar formatos: ' + err.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand-header">
          <div className="logo-gecom">
            <svg width="60" height="60" viewBox="0 0 24 24">
              <path fill="#F5F5F5" d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z" />
              <path fill="#005f87" d="M12,13A2,2 0 0,0 14,11A2,2 0 0,0 12,9A2,2 0 0,0 10,11A2,2 0 0,0 12,13Z" />
            </svg>
          </div>
          <h1>GECOM</h1>
          <h2>Sistema de Gestión de Combustible</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Usuario</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value.trim()})}
              placeholder="Ingrese su nombre de usuario"
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Recordar mi usuario</span>
            </label>
            <a href="/recuperar-contrasena" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Verificando...</span>
              </>
            ) : (
              'INICIAR SESIÓN'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={handleTestFormats} 
            disabled={testing || !credentials.username || !credentials.password}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            {testing ? 'Probando...' : 'Probar Formatos de API'}
          </button>
        </div>

        <div className="register-footer">
          <p>¿No tienes una cuenta? <Link to="/register">Registrarse</Link></p>
        </div>

        <div className="login-footer">
          <div className="version-info">
            <p>GECOM v2.4.8</p>
            <p>© {new Date().getFullYear()} Ecuador</p>
          </div>
          <div className="support-info">
            <p>Soporte técnico: <a href="mailto:soporte@gecom.ec">soporte@gecom.ec</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;