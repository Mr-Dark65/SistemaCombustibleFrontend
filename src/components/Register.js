import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'usuario'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validaciones
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('Por favor complete todos los campos');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (formData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Ingrese un correo electrónico válido');
      }

      // Intentar registrar el usuario
      const result = await authService.register(
        formData.username,
        formData.password,
        formData.email,
        formData.role
      );

      if (result.success) {
        setSuccess('Usuario registrado exitosamente. Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error(result.message || 'Error en el registro');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          <h2>Registro de Usuario</h2>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ingrese su nombre de usuario"
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@gmail.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="input-group">
            <label>Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
             
              <option value="Operador">Operador</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Registrando...</span>
              </>
            ) : (
              'REGISTRARSE'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link></p>
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

export default Register; 