import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Video, ShoppingBag, User, CreditCard,
  LayoutDashboard, LogOut, Menu, X, ChevronDown,
  Dumbbell, Crown, Bell
} from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import {
  shouldShowSubscriptionBadge,
  getSubscriptionDisplayText
} from '../../utils/subscriptionUtils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cargar notificaciones cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
    }
  }, [isAuthenticated, user]);

  const loadNotifications = async () => {
    try {
      // Aquí iría la llamada a la API para obtener notificaciones
      // const response = await api.get('/notifications');
      // setNotifications(response.data.notifications);

      // Por ahora usamos datos mock hasta que tengamos la API completa
      const mockNotifications = [
        {
          id: 1,
          type: 'new_content',
          title: 'Nuevo video disponible',
          message: 'Rutina HIIT para principiantes ya está disponible',
          created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          is_read: false
        },
        {
          id: 3,
          type: 'subscription',
          title: 'Suscripción renovada',
          message: 'Tu suscripción premium ha sido renovada exitosamente',
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          is_read: true
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const navigation = [
      { name: 'Inicio', href: '/', icon: Home },
      { name: 'Contenido', href: '/content', icon: Video },
      { name: 'Productos', href: '/products', icon: ShoppingBag },
    ];

  const authenticatedNavigation = [
    { name: 'Perfil', href: '/profile', icon: User },
    { name: 'Suscripciones', href: '/subscriptions', icon: CreditCard },
    ...(user?.role === 'admin'
       ? [{ name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }]
       : user?.role === 'creator'
       ? [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }]
       : []
     ),
  ];

  const isActive = (path) => location.pathname === path;
  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };


  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        // Aquí iría la llamada a la API para marcar como leída
        // await api.put(`/notifications/${notification.id}/read`);

        // Actualizar estado local
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    setIsNotificationsOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-xl border-b border-red-500/20 shadow-2xl shadow-red-500/10'
          : 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/50"
            >
              <Dumbbell className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl lg:text-2xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                NackRat
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative group"
                >
                  <div className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {!isActive(item.href) && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Usuario autenticado - Desktop */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center space-x-3">
              {/* Notificaciones */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2.5 rounded-xl bg-slate-800/50 text-slate-300 hover:text-red-500 hover:bg-slate-800 transition-all duration-300"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </motion.button>
              
              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setIsNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-16 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl shadow-2xl shadow-red-500/20 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="p-4 bg-gradient-to-br from-red-500/15 to-red-600/15 border-b border-slate-800/50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Bell className="w-5 h-5 text-red-500" />
                            Notificaciones
                          </h3>
                          <span className="text-xs text-slate-400">
                            {unreadCount} nuevas
                          </span>
                        </div>
                      </div>
              
                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer ${
                                !notification.is_read ? 'bg-red-500/5 border-l-4 border-l-red-500' : ''
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${notification.is_read ? 'bg-slate-600' : 'bg-red-500'}`} />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-white mb-1">
                                    {notification.title}
                                  </h4>
                                  <p className="text-xs text-slate-400 mb-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {formatNotificationTime(notification.created_at)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center">
                            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                            <p className="text-sm text-slate-400">No hay notificaciones</p>
                          </div>
                        )}
                      </div>
              
                      {/* Footer */}
                      <div className="p-3 border-t border-slate-800/50">
                        <Link
                          to="/profile"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="block w-full text-center text-sm text-red-500 hover:text-red-400 font-medium"
                        >
                          Ver todas las notificaciones
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>


              {/* Menú de perfil */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all duration-300 border border-slate-700/50 hover:border-red-500/50"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30">
                      <span className="text-white text-sm font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                    {shouldShowSubscriptionBadge(user?.subscription_tier) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 border-slate-950">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-semibold text-white leading-tight">
                      {user?.firstName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {getSubscriptionDisplayText(user?.subscription_tier)}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setIsProfileMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-red-500/10 overflow-hidden z-50"
                      >
                        {/* Header del dropdown */}
                        <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border-b border-slate-800">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </span>
                              </div>
                              {shouldShowSubscriptionBadge(user?.subscription_tier) && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center border-2 border-slate-900">
                                  <Crown className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white truncate">
                                {user?.displayName}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Opciones */}
                        <div className="p-2">
                          {authenticatedNavigation.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-300 group"
                                onClick={() => setIsProfileMenuOpen(false)}
                              >
                                <Icon className="w-4 h-4 group-hover:text-red-500 transition-colors" />
                                <span className="text-sm font-medium">{item.name}</span>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Logout */}
                        <div className="p-2 border-t border-slate-800">
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileMenuOpen(false);
                            }}
                            className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 group"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Cerrar Sesión</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Botones de autenticación - Desktop */
            <div className="hidden lg:flex items-center space-x-3">
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Botón menú móvil */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-800/50 text-slate-300 hover:text-red-500 hover:bg-slate-800 transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {/* Navegación principal */}
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isActive(item.href)
                          ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {isAuthenticated ? (
                  <>
                    {/* Separador */}
                    <div className="h-px bg-slate-800 my-3" />

                    {/* Usuario */}
                    <div className="px-4 py-3 bg-slate-800/30 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </span>
                          </div>
                          {shouldShowSubscriptionBadge(user?.subscription_tier) && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center border-2 border-slate-900">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {user?.displayName}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones de usuario */}
                    {authenticatedNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                            isActive(item.href)
                              ? 'text-white bg-gradient-to-r from-red-500 to-red-600'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}

                    {/* Logout */}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 font-semibold text-sm transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-px bg-slate-800 my-3" />
                    <div className="space-y-2 px-4">
                      <Link
                        to="/login"
                        className="block text-center px-6 py-3 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800/50 rounded-xl transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Iniciar Sesión
                      </Link>
                      <Link
                        to="/register"
                        className="block text-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Registrarse
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
