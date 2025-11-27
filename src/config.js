// Configuración centralizada para URLs y endpoints
// Funciona tanto en desarrollo como en producción

const isDevelopment = process.env.NODE_ENV === 'development';

export const config = {
  // API URLs
  API_BASE_URL: isDevelopment
    ? 'http://localhost:5000/api'
    : (process.env.REACT_APP_API_URL || 'https://jeremy-fitness-backend.railway.app/api'),

  // Socket URL
  SOCKET_URL: isDevelopment
    ? 'http://localhost:5000'
    : (process.env.REACT_APP_SOCKET_URL || 'https://jeremy-fitness-backend.railway.app'),

  // Frontend URL
  FRONTEND_URL: isDevelopment
    ? 'http://localhost:3000'
    : (process.env.REACT_APP_SITE_URL || 'https://nackrat.netlify.app'),

  // Environment
  ENVIRONMENT: process.env.NODE_ENV || 'development',

  // API Timeout
  API_TIMEOUT: 10000,

  // Upload settings
  MAX_FILE_SIZE: parseInt(process.env.REACT_APP_MAX_FILE_SIZE) || 500000000,
  ALLOWED_FILE_TYPES: process.env.REACT_APP_ALLOWED_FILE_TYPES || 'video/mp4,video/webm,image/jpeg,image/png,image/gif',

  // PWA settings
  PWA_ENABLED: process.env.REACT_APP_PWA_ENABLED !== 'false',
  SITE_NAME: process.env.REACT_APP_SITE_NAME || 'Jeremy Fitness Pro',
  SITE_DESCRIPTION: process.env.REACT_APP_SITE_DESCRIPTION || 'Plataforma exclusiva de fitness con contenido premium',
};

// Log configuración en desarrollo
if (isDevelopment) {
  console.log('🔧 Configuración Frontend:', {
    API_BASE_URL: config.API_BASE_URL,
    SOCKET_URL: config.SOCKET_URL,
    ENVIRONMENT: config.ENVIRONMENT,
  });
}

export default config;
