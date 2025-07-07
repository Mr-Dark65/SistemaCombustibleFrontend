import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BackendStatus from './components/BackendStatus';
import VehicleTest from './components/VehicleTest';
import DriverTest from './components/DriverTest';
import RouteTest from './components/RouteTest';
import FuelTest from './components/FuelTest';
import authService from './services/authService';
import './App.css';

// Función para extraer username del token JWT (sin depender del backend)
const extractUserFromToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      username: decoded.username || decoded.sub || 'Usuario',
      role: decoded.role || 'operador'
    };
  } catch (error) {
    console.warn('Error decoding token:', error);
    return {
      username: 'Operador',
      role: 'operador'
    };
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const userData = extractUserFromToken(token);
      setUser({
        token,
        nombre: userData.username,
        rol: localStorage.getItem('userRole') || userData.role
      });
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <>
      <BackendStatus />
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? 
              <Navigate to="/" /> : 
              <Login onLogin={(token) => {
                const userData = extractUserFromToken(token);
                setUser({
                  token,
                  nombre: userData.username,
                  rol: localStorage.getItem('userRole') || userData.role
                });
              }} />
          } 
        />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route 
          path="/" 
          element={
            user ? 
              <Layout user={user} onLogout={handleLogout}>
                <Outlet />
              </Layout> : 
              <Navigate to="/login" />
          } 
        >
          <Route index element={<Dashboard user={user} />} />
          <Route path="choferes" element={<DriverTest />} />
          <Route path="vehiculos" element={<VehicleTest />} />
          <Route path="rutas" element={<RouteTest />} />
          <Route path="combustible" element={<FuelTest />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;