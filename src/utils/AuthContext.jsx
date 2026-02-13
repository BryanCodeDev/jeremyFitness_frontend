import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

// Crear contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Configuración de axios usando configuración centralizada
export const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  withCredentials: true, // Habilitar credenciales para CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Asegurar headers correctos para CORS
    config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo manejar 401 en rutas específicas, no en todas las peticiones
    if (error.response?.status === 401 && !error.config.url.includes('/auth/verify')) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');

      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Provider de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);

      const { token: newToken, user: userData } = response.data;

      // Verificar permisos si es admin
      if (credentials.userType === 'admin' && userData.role !== 'admin') {
        return { success: false, error: 'No tienes permisos de administrador' };
      }

      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', credentials.userType); // Guardar el tipo de usuario

      // Si el usuario marcó "recordarme", extender la duración del token
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      return { success: true, user: userData };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      return { success: false, error: message };
    }
  };

  // Función para registrar usuario
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      // El backend devuelve token y usuario, usarlos para login automático
      if (response.data && response.data.token && response.data.user) {
        const { token: newToken, user: userData } = response.data;

        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', 'user'); // Usuarios registrados son tipo 'user'

        return { success: true, autoLogin: true };
      }

      // Si no hay token/usuario en respuesta, solo devolver éxito
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar usuario';
      return { success: false, error: message };
    }
  };

  // Función para actualizar actividad
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Función para cerrar sesión
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setLastActivity(0);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('rememberMe');
  }, []);

  // Función para actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      await api.put('/users/profile', profileData);
      // Actualizar usuario en el estado
      setUser(prev => ({ ...prev, ...profileData }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...profileData }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al actualizar perfil';
      return { success: false, error: message };
    }
  };

  // Función para refrescar datos del usuario
  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/verify');
      if (response.data && response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return { success: true };
      }
    } catch (error) {
      console.error('Error refrescando usuario:', error);
    }
    return { success: false };
  };

  // Función para verificar token al cargar la aplicación
  const verifyToken = async () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        console.log('🔄 Verificando token existente...');
        const response = await api.get('/auth/verify');

        if (response.data && response.data.user) {
          console.log('✅ Token válido, usuario verificado:', response.data.user.username);
          setToken(storedToken);
          setUser(response.data.user);
          setLoading(false);
          return;
        } else {
          console.warn('⚠️ Respuesta de verificación sin usuario');
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error verificando token:', error.response?.status, error.response?.data?.message);
        // Solo limpiar si es un error de autenticación real (401), no errores de red
        if (error.response?.status === 401) {
          console.log('🔄 Token expirado, limpiando sesión...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('userType');
          localStorage.removeItem('rememberMe');
          setToken(null);
          setUser(null);
        }
      }
    } else {
      console.log('ℹ️ No hay token almacenado');
    }

    setLoading(false);
  };

  // Verificar token al montar el componente
  useEffect(() => {
    verifyToken();
  }, []);

  // Logout automático por inactividad
  useEffect(() => {
    if (!user) return;

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      // Tiempo límite: 30 minutos si no está marcado "recordarme", 2 horas si sí
      const timeout = localStorage.getItem('rememberMe') ? 2 * 60 * 60 * 1000 : 30 * 60 * 1000; // 2 horas o 30 minutos

      if (timeSinceLastActivity > timeout) {
        console.log('Sesión expirada por inactividad');
        logout();
      }
    };

    const interval = setInterval(checkInactivity, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [user, lastActivity, logout]);

  // Detectar actividad del usuario
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleActivity = () => updateActivity();

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, updateActivity]);

  // Valores del contexto
  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: !!user,
    isCreator: user?.role === 'creator' || user?.role === 'admin',
    isAdmin: user?.role === 'admin',
    hasSubscription: user?.subscriptionTier !== 'free',
    rememberMe: !!localStorage.getItem('rememberMe'),
    userType: localStorage.getItem('userType'), // Agregar userType al contexto
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
