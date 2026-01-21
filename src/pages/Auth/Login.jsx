import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, LogIn, ArrowLeft, Shield, UserCircle, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import { useNotification } from '../../utils/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [userType, setUserType] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeLeft, setBlockTimeLeft] = useState(0);

  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  // Efecto para manejar el temporizador de bloqueo
  useEffect(() => {
    let interval;
    if (isBlocked && blockTimeLeft > 0) {
      interval = setInterval(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockTimeLeft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validación en tiempo real
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'El usuario o email es requerido';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) && !/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username = 'Ingresa un email válido o nombre de usuario';
        } else {
          delete newErrors.username;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si está bloqueado
    if (isBlocked) {
      showError(`Demasiados intentos fallidos. Intenta de nuevo en ${blockTimeLeft} segundos.`);
      return;
    }

    // Validar todos los campos antes de enviar
    const allFields = ['username', 'password'];
    const newTouched = {};
    const newErrors = {};

    allFields.forEach(field => {
      newTouched[field] = true;
      const value = formData[field];
      switch (field) {
        case 'username':
          if (!value.trim()) {
            newErrors.username = 'El usuario o email es requerido';
          } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) && !/^[a-zA-Z0-9_]+$/.test(value)) {
            newErrors.username = 'Ingresa un email válido o nombre de usuario';
          }
          break;
        case 'password':
          if (!value) {
            newErrors.password = 'La contraseña es requerida';
          } else if (value.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
          }
          break;
        default:
          break;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);

    // Si hay errores, no enviar
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({...formData, userType});

      if (result.success) {
        showSuccess('¡Bienvenido de vuelta!');
        setLoginAttempts(0); // Resetear intentos en login exitoso

        // Redirigir según el tipo de usuario
        setTimeout(() => {
          if (userType === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }, 100);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsBlocked(true);
          setBlockTimeLeft(300); // 5 minutos
          showError('Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.');
        } else {
          showError(result.error);
        }
      }
    } catch (error) {
      showError('Error inesperado al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex flex-col justify-center space-y-8 px-8"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
                Transforma tu
                <span className="block bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Estilo de Vida
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed">
                Únete a miles de personas que ya están alcanzando sus objetivos fitness con entrenamiento profesional y contenido exclusivo.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />, text: "Contenido premium exclusivo" },
                { icon: <User className="w-5 h-5 sm:w-6 sm:h-6" />, text: "Planes personalizados" },
                { icon: <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />, text: "Acceso desde cualquier dispositivo" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-4 text-slate-300"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center text-red-500">
                    {item.icon}
                  </div>
                  <span className="text-base sm:text-lg">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
          >
            {/* Mobile Header */}
            <div className="text-center mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <span className="text-white font-black text-2xl">J</span>
                </div>
                <span className="text-2xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  NackRat
                </span>
              </Link>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl">
              {/* Desktop Header */}
              <div className="hidden lg:block mb-8">
                <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                    <span className="text-white font-black text-2xl">J</span>
                  </div>
                  <span className="text-2xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    NackRat
                  </span>
                </Link>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Bienvenido de vuelta
                </h2>
                <p className="text-slate-400">
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              {/* User Type Selector */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3 p-2 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                  <button
                    type="button"
                    onClick={() => setUserType('user')}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      userType === 'user'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>Usuario</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('admin')}
                    className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      userType === 'admin'
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  {userType === 'user'
                    ? 'Acceso estándar con contenido básico y premium'
                    : 'Panel administrativo con herramientas de gestión completas'
                  }
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-300 mb-2">
                    Usuario o Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 focus:ring-2 transition-all duration-300 outline-none ${
                        errors.username
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : touched.username && !errors.username
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'border-slate-800/50 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                      placeholder="tu@email.com o usuario"
                    />
                    {touched.username && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {errors.username ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>{errors.username}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full pl-12 pr-12 py-3.5 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 focus:ring-2 transition-all duration-300 outline-none ${
                        errors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : touched.password && !errors.password
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'border-slate-800/50 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {touched.password && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {errors.password ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                      disabled={isBlocked}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950/50 text-red-500 focus:ring-red-500 focus:ring-offset-0 focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className={`ml-2 transition-colors ${isBlocked ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-300'}`}>
                      Recordarme por 30 días
                    </span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className={`font-semibold transition-colors ${isBlocked ? 'text-slate-600 cursor-not-allowed' : 'text-red-500 hover:text-red-400'}`}
                    onClick={(e) => isBlocked && e.preventDefault()}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || Object.keys(errors).length > 0 || isBlocked}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-red-500/30 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Iniciando sesión...</span>
                    </>
                  ) : isBlocked ? (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Bloqueado ({Math.floor(blockTimeLeft / 60)}:{(blockTimeLeft % 60).toString().padStart(2, '0')})</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Iniciar Sesión</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900/50 text-slate-500">o continúa con</span>
                </div>
              </div>

              {/* Register link */}
              <div className="text-center">
                <p className="text-slate-400">
                  ¿No tienes una cuenta?{' '}
                  <Link
                    to="/register"
                    className="text-red-500 hover:text-red-400 font-bold transition-colors"
                  >
                    Regístrate gratis
                  </Link>
                </p>
              </div>
            </div>

            {/* Back to home */}
            <div className="text-center mt-6">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-slate-400 hover:text-red-500 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Volver al inicio</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
