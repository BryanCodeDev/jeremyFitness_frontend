import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Configuración de service worker para PWA (opcional)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Configuración de errores globales
window.addEventListener('error', (event) => {
  console.error('Error global capturado:', event.error);
  // Aquí podrías enviar el error a un servicio de monitoreo
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesa rechazada no manejada:', event.reason);
  // Aquí podrías enviar el error a un servicio de monitoreo
});

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);