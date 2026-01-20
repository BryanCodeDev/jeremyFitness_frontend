import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  
  Upload,
  ShoppingBag,
  BarChart3,
  Clock,
  
  AlertCircle,
  ArrowRight,
  
  
  
  Activity,
  Shield
} from 'lucide-react';

const CreatorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalContent: 0,
    totalViews: 0,
    subscribers: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user || user.role !== 'admin') return;

      setLoading(true);
      try {
        // Aquí irían las llamadas a la API para obtener estadísticas reales
        setStats({
          totalContent: 0,
          totalViews: 0,
          subscribers: 0,
          earnings: 0
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  // Verificar permisos de administrador
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 pt-16 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
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
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105 group"
            >
              <span>Volver al Inicio</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const statsCards = [
    {
      icon: <Video className="w-6 h-6" />,
      label: 'Contenido Total',
      value: stats.totalContent,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      trend: '+12%',
      trendUp: true
    },
    {
      icon: <Eye className="w-6 h-6" />,
      label: 'Vistas Totales',
      value: stats.totalViews.toLocaleString(),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      trend: '+28%',
      trendUp: true
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Suscriptores',
      value: stats.subscribers.toLocaleString(),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      trend: '+5%',
      trendUp: true
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      label: 'Ingresos',
      value: `$${stats.earnings.toLocaleString()}`,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      trend: '+18%',
      trendUp: true
    }
  ];

  const quickActions = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Subir Contenido',
      description: 'Agregar nuevo video o imagen',
      color: 'from-red-500 to-red-600',
      action: () => console.log('Upload content')
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: 'Crear Producto',
      description: 'Añadir nuevo producto',
      color: 'from-purple-500 to-purple-600',
      action: () => console.log('Create product')
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Ver Analíticas',
      description: 'Estadísticas detalladas',
      color: 'from-blue-500 to-blue-600',
      action: () => console.log('View analytics')
    }
  ];

  const recentActivity = [
    {
      icon: <Video className="w-5 h-5" />,
      title: 'Nuevo video subido',
      description: 'Entrenamiento HIIT Avanzado',
      time: 'Hace 2 horas',
      status: 'success'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Nuevos suscriptores',
      description: '45 nuevos miembros premium',
      time: 'Hace 5 horas',
      status: 'success'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
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
                  <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                  <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                </h1>
                <p className="text-slate-400 text-base sm:text-lg">
                  Bienvenido de vuelta, {user?.firstName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl px-4 py-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-slate-300">En línea</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-slate-800 rounded mb-4"></div>
                  <div className="h-10 bg-slate-800 rounded"></div>
                </div>
              ))
            ) : (
              statsCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                      <TrendingUp className={`w-3 h-3 ${!stat.trendUp && 'rotate-180'}`} />
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-white">
                    {stat.value}
                  </p>
                </motion.div>
              ))
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-6 h-6 text-red-500" />
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    onClick={action.action}
                    className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-red-500/50 hover:bg-slate-800/70 transition-all duration-300 text-left"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {action.icon}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-slate-400">
                      {action.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 sm:p-8"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-red-500" />
                Actividad Reciente
              </h3>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                    >
                      <div className={`w-10 h-10 ${activity.status === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <div className={activity.status === 'success' ? 'text-green-500' : 'text-red-500'}>
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-semibold text-sm mb-1">
                          {activity.title}
                        </h4>
                        <p className="text-slate-400 text-xs mb-2 truncate">
                          {activity.description}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400">
                      No hay actividad reciente
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
