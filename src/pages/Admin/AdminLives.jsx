import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth, api } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import {
  Radio,
  Play,
  Square,
  Search,
  Eye,
  Clock,
  Calendar,
  Edit,
  Trash2,
  Shield,
  ArrowRight,
  User,
  MessageSquare
} from 'lucide-react';

const AdminLives = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lives, setLives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadLives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sortBy: 'scheduled_start',
        sortOrder: 'DESC'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await api.get(`/admin/lives?${params}`);
      setLives(response.data.lives || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error loading lives:', error);
      setError('Error al cargar los live streams');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadLives();
  }, [user, navigate, loadLives]);

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

  const getLiveStatusColor = (live) => {
    const now = new Date();
    const scheduledStart = new Date(live.scheduled_start);
    const actualStart = live.actual_start ? new Date(live.actual_start) : null;
    const actualEnd = live.actual_end ? new Date(live.actual_end) : null;

    if (actualEnd) {
      return 'text-slate-400 bg-slate-500/10'; // Finalizado
    } else if (actualStart && live.is_active) {
      return 'text-red-400 bg-red-500/10'; // En vivo
    } else if (scheduledStart <= now) {
      return 'text-yellow-400 bg-yellow-500/10'; // Programado pero no iniciado
    } else {
      return 'text-blue-400 bg-blue-500/10'; // Programado
    }
  };

  const getLiveStatusText = (live) => {
    const now = new Date();
    const scheduledStart = new Date(live.scheduled_start);
    const actualStart = live.actual_start ? new Date(live.actual_start) : null;
    const actualEnd = live.actual_end ? new Date(live.actual_end) : null;

    if (actualEnd) {
      return 'Finalizado';
    } else if (actualStart && live.is_active) {
      return 'En Vivo';
    } else if (scheduledStart <= now) {
      return 'Pendiente';
    } else {
      return 'Programado';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const duration = new Date(end) - new Date(start);
    const minutes = Math.floor(duration / 60000);
    return `${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="lg:ml-72 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
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
                  <Radio className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                  <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Gestión de Live Streams
                  </span>
                </h1>
                <p className="text-slate-400 text-base sm:text-lg">
                  Administra las sesiones de streaming en vivo
                </p>
              </div>
              <button
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300"
              >
                <Play className="w-5 h-5" />
                <span>Programar Live</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar live streams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="w-full lg:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                >
                  <option value="all">Todos los estados</option>
                  <option value="scheduled">Programados</option>
                  <option value="active">En Vivo</option>
                  <option value="finished">Finalizados</option>
                </select>
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

          {/* Lives Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 animate-pulse">
                  <div className="aspect-video bg-slate-800 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-800 rounded mb-2"></div>
                  <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : lives.length === 0 ? (
            <div className="text-center py-16">
              <Radio className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No hay live streams</h3>
              <p className="text-slate-500">No se encontraron live streams que coincidan con los filtros aplicados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {lives.map((live, index) => (
                <motion.div
                  key={live.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300"
                >
                  {/* Live Thumbnail/Preview */}
                  <div className="aspect-video bg-slate-800 relative overflow-hidden">
                    {live.thumbnail_url ? (
                      <img
                        src={live.thumbnail_url}
                        alt={live.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Radio className="w-12 h-12 text-slate-600" />
                      </div>
                    )}

                    {/* Live Status Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getLiveStatusColor(live)}`}>
                        {live.is_active && !live.actual_end ? (
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        ) : (
                          <Radio className="w-3 h-3" />
                        )}
                        <span>{getLiveStatusText(live)}</span>
                      </div>
                    </div>

                    {/* Premium Badge */}
                    {live.is_premium && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
                          <span className="text-yellow-400 text-xs font-semibold">Premium</span>
                        </div>
                      </div>
                    )}

                    {/* Live Indicator */}
                    {live.is_active && !live.actual_end && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-500/30 mb-2">
                            <Radio className="w-6 h-6 text-red-500" />
                          </div>
                          <p className="text-white font-bold text-sm">EN VIVO</p>
                          <p className="text-slate-300 text-xs">{live.viewer_count || 0} espectadores</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Live Info */}
                  <div className="p-6">
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {live.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {live.description || 'Sin descripción'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{live.viewer_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>Chat</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(live.actual_start, live.actual_end)}</span>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Programado</p>
                        <p className="text-white text-sm font-semibold">{formatDate(live.scheduled_start)}</p>
                      </div>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-slate-400 text-sm">{live.username || 'Usuario'}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {live.is_active && !live.actual_end && (
                          <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Square className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-slate-500">
                          {live.stream_key ? 'Configurado' : 'Sin configurar'}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                <span className="px-4 py-2 text-slate-400">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLives;
