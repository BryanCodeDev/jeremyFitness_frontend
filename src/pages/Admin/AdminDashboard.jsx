import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth, api } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import {
  Users,
  Video,
  ShoppingBag,
  Radio,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  ArrowRight,
  RefreshCw,
  Settings,
  UserCheck,
  Menu
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadMetrics();
  }, [user, navigate]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/admin/dashboard/metrics');
      setMetrics(response.data.metrics);
    } catch (error) {
      console.error('Error loading metrics:', error);
      setError('Error al cargar las métricas del dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Verificar permisos de administrador
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg mx-auto px-4 relative z-10"
        >
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 sm:p-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-red-500 mb-4">
              Acceso Denegado
            </h1>
            <p className="text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
              No tienes permisos de administrador para acceder a esta página.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 hover:scale-105 group"
            >
              <span>Volver al Inicio</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const metricCards = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Usuarios Totales',
      value: metrics?.totalUsers || 0,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      change: metrics?.newUsersThisMonth || 0,
      changeLabel: 'este mes'
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      label: 'Suscriptores Activos',
      value: metrics?.activeSubscribers || 0,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      change: metrics?.newSubscribersThisMonth || 0,
      changeLabel: 'este mes'
    },
    {
      icon: <Video className="w-6 h-6" />,
      label: 'Contenido Total',
      value: metrics?.totalContent || 0,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      change: null,
      changeLabel: ''
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: 'Productos',
      value: metrics?.totalProducts || 0,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
      change: null,
      changeLabel: ''
    },
    {
      icon: <Radio className="w-6 h-6" />,
      label: 'Lives Activos',
      value: metrics?.activeStreams || 0,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      change: null,
      changeLabel: ''
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Ingresos Totales',
      value: `$${typeof metrics?.totalRevenue === 'number' ? metrics.totalRevenue.toFixed(2) : '0.00'}`,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      change: null,
      changeLabel: ''
    }
  ];

  const quickActions = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Gestionar Usuarios',
      description: 'Administrar usuarios y suscripciones',
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/admin/users')
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Gestionar Contenido',
      description: 'Subir y administrar contenido',
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/admin/content')
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: 'Gestionar Productos',
      description: 'Crear y editar productos',
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/admin/products')
    },
    {
      icon: <Radio className="w-6 h-6" />,
      title: 'Gestionar Lives',
      description: 'Programar y gestionar streams',
      color: 'from-red-500 to-red-600',
      action: () => navigate('/admin/lives')
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Configuración',
      description: 'Configuración del sistema',
      color: 'from-slate-500 to-slate-600',
      action: () => navigate('/admin/settings')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Configuración',
      description: 'Configuración del sistema',
      color: 'from-slate-500 to-slate-600',
      action: () => navigate('/admin/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-16 flex">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        {/* Mobile Menu Button - Solo mostrar en móviles/tablets */}
        {!isDesktop && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-20 left-4 z-30 w-12 h-12 bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-xl flex items-center justify-center text-white shadow-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Desktop Sidebar Spacer - Para mantener el contenido alineado */}
        {isDesktop && (
          <div className="hidden lg:block lg:w-72" />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 flex items-center gap-3">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Panel Administrativo
                  </span>
                </h1>
                <p className="text-slate-400 text-base sm:text-lg">
                  Bienvenido, {user?.firstName} - Gestión completa de la plataforma
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={loadMetrics}
                  disabled={loading}
                  className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl px-4 py-2 hover:border-orange-500/50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-semibold text-slate-300">Actualizar</span>
                </button>
                <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl px-4 py-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-slate-300">Sistema Activo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6 mb-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-slate-800 rounded mb-4"></div>
                  <div className="h-10 bg-slate-800 rounded"></div>
                </div>
              ))
            ) : (
              metricCards.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {metric.icon}
                    </div>
                    {metric.change !== null && (
                      <div className={`flex items-center gap-1 text-xs font-bold ${metric.change > 0 ? 'text-green-500' : 'text-slate-500'}`}>
                        {metric.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        +{metric.change}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-black text-white">
                    {metric.value}
                  </p>
                  {metric.changeLabel && (
                    <p className="text-xs text-slate-500 mt-1">
                      {metric.changeLabel}
                    </p>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 sm:p-8"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-orange-500" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={action.action}
                  className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-orange-500/50 hover:bg-slate-800/70 transition-all duration-300 text-left"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {action.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {action.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;