import React, { useState, useEffect } from 'react';
import { buildApiUrl, API_CONFIG } from '../config/api';

const BackendStatus = () => {
  const [isBackendOnline, setIsBackendOnline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Intentar hacer una petición simple al endpoint raíz
        const response = await fetch(buildApiUrl('/'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setIsBackendOnline(response.ok);
      } catch (error) {
        setIsBackendOnline(false);
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        padding: '8px 12px', 
        borderRadius: '4px',
        backgroundColor: '#f0f0f0',
        fontSize: '12px'
      }}>
        Verificando backend...
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      padding: '8px 12px', 
      borderRadius: '4px',
      backgroundColor: isBackendOnline ? '#d4edda' : '#f8d7da',
      color: isBackendOnline ? '#155724' : '#721c24',
      fontSize: '12px',
      border: `1px solid ${isBackendOnline ? '#c3e6cb' : '#f5c6cb'}`
    }}>
      {isBackendOnline ? '✅ Backend Online' : '❌ Backend Offline'}
    </div>
  );
};

export default BackendStatus; 