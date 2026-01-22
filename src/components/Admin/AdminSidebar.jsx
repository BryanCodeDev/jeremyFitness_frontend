import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Video,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Detectar cambios en el tamaño de la pantalla
  useEffect(() => {
    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 1024;
      setIsDesktop(newIsDesktop);
      if (newIsDesktop) {
        setIsCollapsed(false); // Reset collapsed state on desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // En PC siempre mostrar el sidebar abierto y fijo
  const effectiveIsOpen = isDesktop ? true : isOpen;

  const menuItems = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      path: '/admin/dashboard',
      color: 'text-blue-400'
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Usuarios',
      path: '/admin/users',
      color: 'text-green-400'
    },
    {
      icon: <Video className="w-5 h-5" />,
      label: 'Contenido',
      path: '/admin/content',
      color: 'text-purple-400'
    },
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      label: 'Productos',
      path: '/admin/products',
      color: 'text-red-400'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: 'Configuración',
      path: '/admin/settings',
      color: 'text-slate-400'
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeMobileSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{
          x: effectiveIsOpen ? 0 : -300,
          width: (isCollapsed && !isDesktop) ? 80 : 280
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 z-50 flex flex-col lg:block lg:static lg:translate-x-0 w-full lg:w-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
          {(!isCollapsed || isDesktop) && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-sm">Admin Panel</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Botón de colapsar solo en mobile/tablet */}
            {!isDesktop && (
              <button
                onClick={toggleSidebar}
                className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}

            {/* Mobile close button */}
            {!isDesktop && (
              <button
                onClick={closeMobileSidebar}
                className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        {(!isCollapsed || isDesktop) && (
          <div className="p-4 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-slate-400 text-xs">Administrador</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={closeMobileSidebar}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className={`flex items-center justify-center ${isCollapsed ? 'w-full' : ''}`}>
                      <div className={isActive ? 'text-red-400' : item.color}>
                        {item.icon}
                      </div>
                    </div>

                    {(!isCollapsed || isDesktop) && (
                      <span className={`font-medium text-sm ${isActive ? 'text-red-400' : ''}`}>
                        {item.label}
                      </span>
                    )}

                    {isActive && (!isCollapsed || isDesktop) && (
                      <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 group ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5" />
            {(!isCollapsed || isDesktop) && (
              <span className="font-medium text-sm">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      {!isDesktop && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-20 left-4 z-30 w-12 h-12 bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-xl flex items-center justify-center text-white shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default AdminSidebar;
