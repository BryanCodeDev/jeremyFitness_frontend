import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth, api } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import {
  Users,
  Search,
  Edit,
  Shield,
  UserCheck,
  UserX,
  Crown,
  Mail,
  ArrowRight,
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AdminUsers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filterRole !== 'all') params.append('role', filterRole);
      if (filterSubscription !== 'all') params.append('subscription_tier', filterSubscription);

      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.users || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterRole, filterSubscription]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadUsers();
  }, [user, navigate, loadUsers]);

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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-red-400 bg-red-500/10';
      case 'creator':
        return 'text-purple-400 bg-purple-500/10';
      case 'user':
        return 'text-blue-400 bg-blue-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'creator':
        return <UserCheck className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getSubscriptionColor = (tier) => {
    switch (tier) {
      case 'vip':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'premium':
        return 'text-green-400 bg-green-500/10';
      case 'free':
        return 'text-slate-400 bg-slate-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getSubscriptionIcon = (tier) => {
    switch (tier) {
      case 'vip':
        return <Crown className="w-4 h-4" />;
      case 'premium':
        return <UserCheck className="w-4 h-4" />;
      case 'free':
        return <UserX className="w-4 h-4" />;
      default:
        return <UserX className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleUserUpdate = async (userId, updates) => {
    try {
      await api.put(`/admin/users/${userId}`, updates);
      loadUsers(); // Recargar lista
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error al actualizar el usuario');
    }
  };

  const handleSubscriptionUpdate = async (userId, newTier) => {
    try {
      await api.put(`/admin/users/${userId}/subscription`, { subscription_tier: newTier });
      loadUsers(); // Recargar lista
      setShowSubscriptionModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError('Error al actualizar la suscripción');
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const openSubscriptionModal = async (user) => {
    try {
      const response = await api.get(`/admin/users/${user.id}/subscriptions`);
      setSelectedUser({ ...user, subscriptions: response.data });
      setShowSubscriptionModal(true);
    } catch (error) {
      console.error('Error loading user subscriptions:', error);
      setError('Error al cargar las suscripciones del usuario');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
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
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Gestión de Usuarios
                  </span>
                </h1>
                <p className="text-slate-400 text-base sm:text-lg">
                  Administra usuarios y sus suscripciones
                </p>
              </div>
              <button
                onClick={loadUsers}
                disabled={loading}
                className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl text-white hover:border-orange-500/50 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
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
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="w-full lg:w-48">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                >
                  <option value="all">Todos los roles</option>
                  <option value="admin">Administradores</option>
                  <option value="creator">Creadores</option>
                  <option value="user">Usuarios</option>
                </select>
              </div>

              {/* Subscription Filter */}
              <div className="w-full lg:w-48">
                <select
                  value={filterSubscription}
                  onChange={(e) => setFilterSubscription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                >
                  <option value="all">Todas las suscripciones</option>
                  <option value="vip">VIP</option>
                  <option value="premium">Premium</option>
                  <option value="free">Gratuito</option>
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

          {/* Users Table */}
          {loading ? (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                      <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-slate-800 rounded w-20"></div>
                    <div className="h-6 bg-slate-800 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No hay usuarios</h3>
              <p className="text-slate-500">No se encontraron usuarios que coincidan con los filtros aplicados.</p>
            </div>
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Suscripción
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Registro
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Último Login
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {users.map((userItem, index) => (
                      <motion.tr
                        key={userItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {userItem.first_name?.charAt(0)}{userItem.last_name?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-semibold">
                                {userItem.display_name || `${userItem.first_name} ${userItem.last_name}`}
                              </div>
                              <div className="text-slate-400 text-sm flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {userItem.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(userItem.role)}`}>
                            {getRoleIcon(userItem.role)}
                            <span className="capitalize">{userItem.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getSubscriptionColor(userItem.subscription_tier)}`}>
                            {getSubscriptionIcon(userItem.subscription_tier)}
                            <span className="capitalize">{userItem.subscription_tier}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {userItem.is_active ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`text-sm font-semibold ${userItem.is_active ? 'text-green-400' : 'text-red-400'}`}>
                              {userItem.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {formatDate(userItem.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {userItem.last_login_at ? formatDate(userItem.last_login_at) : 'Nunca'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openUserModal(userItem)}
                              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                              title="Editar usuario"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openSubscriptionModal(userItem)}
                              className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="Gestionar suscripción"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

      {/* User Edit Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-white mb-4">Editar Usuario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Rol</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="user">Usuario</option>
                  <option value="creator">Creador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Estado</label>
                <select
                  value={selectedUser.is_active ? 'active' : 'inactive'}
                  onChange={(e) => setSelectedUser({...selectedUser, is_active: e.target.value === 'active'})}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleUserUpdate(selectedUser.id, {
                  role: selectedUser.role,
                  is_active: selectedUser.is_active
                })}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 w-full max-w-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              Gestionar Suscripción - {selectedUser.display_name}
            </h3>

            <div className="mb-4 p-4 bg-slate-800/50 rounded-xl">
              <p className="text-sm text-slate-400 mb-2">Suscripción Actual</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getSubscriptionColor(selectedUser.subscription_tier)}`}>
                {getSubscriptionIcon(selectedUser.subscription_tier)}
                <span className="capitalize">{selectedUser.subscription_tier}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-white mb-3">Cambiar a:</h4>
              {[
                { tier: 'free', name: 'Gratuito', price: 0, features: ['Acceso básico', 'Contenido limitado'] },
                { tier: 'premium', name: 'Premium', price: 15.99, features: ['Acceso completo', 'Contenido premium', 'Descargas'] },
                { tier: 'vip', name: 'VIP', price: 29.99, features: ['Todo lo premium', 'Acceso anticipado', 'Sesiones privadas'] }
              ].map((plan) => (
                <div
                  key={plan.tier}
                  onClick={() => handleSubscriptionUpdate(selectedUser.id, plan.tier)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedUser.subscription_tier === plan.tier
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getSubscriptionIcon(plan.tier)}
                      <span className="font-semibold text-white">{plan.name}</span>
                    </div>
                    <span className="text-green-400 font-bold">
                      {plan.price === 0 ? 'Gratis' : `$${plan.price}/mes`}
                    </span>
                  </div>
                  <ul className="text-sm text-slate-400 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;