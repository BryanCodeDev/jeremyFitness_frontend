import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Contextos
import { AuthProvider, useAuth } from './utils/AuthContext';
import { NotificationProvider } from './utils/NotificationContext';

// Componentes
import NotificationContainer from './components/Notification/NotificationContainer';

// Componentes principales
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

// Páginas
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import Content from './pages/Content/Content';
import PremiumContent from './pages/Content/PremiumContent';
import Subscriptions from './pages/Subscriptions/Subscriptions';
import LiveStreams from './pages/LiveStreams/LiveStreams';
import Products from './pages/Products/Products';
import CreatorDashboard from './pages/Dashboard/CreatorDashboard';
import NotFound from './pages/NotFound/NotFound';

// Configurar React Router con future flags para eliminar warnings
const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

// Componente de rutas protegidas
const ProtectedRoute = ({ children, requiredRole, requiredSubscription }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (requiredSubscription && user.subscription_tier === 'free') {
    return <Navigate to="/subscriptions" replace />;
  }

  return children;
};

// Componente de rutas públicas (redirige si ya está autenticado)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout principal
const MainLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            width: '80px',
            height: '80px',
            border: '3px solid #ff6b35',
            borderTop: '3px solid transparent',
            borderRadius: '50%'
          }}
        />
      </motion.div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      <Footer />
      <NotificationContainer />
    </div>
  );
};

// App principal
function App() {
  return (
    <AuthProvider>
        <NotificationProvider>
          <Router future={routerFuture}>
            <MainLayout>
              <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/content" element={<Content />} />
                <Route path="/products" element={<Products />} />
                <Route path="/live" element={<LiveStreams />} />

                {/* Rutas de autenticación */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />

                {/* Rutas protegidas */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/premium"
                  element={
                    <ProtectedRoute requiredSubscription={true}>
                      <PremiumContent />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subscriptions"
                  element={
                    <ProtectedRoute>
                      <Subscriptions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRole="creator">
                      <CreatorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Página 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </Router>
        </NotificationProvider>
      </AuthProvider>
  );
}

export default App;