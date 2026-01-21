import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, Mail, ArrowLeft, Shield, UserPlus, Eye, EyeOff, Check, X, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import { useNotification } from '../../utils/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { register } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Validación en tiempo real
    if (touched[name]) {
      validateField(name, type === 'checkbox' ? checked : value);
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'El nombre es requerido';
        } else if (value.length < 1 || value.length > 50) {
          newErrors.firstName = 'El nombre debe tener entre 1 y 50 caracteres';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'Los apellidos son requeridos';
        } else if (value.length < 1 || value.length > 50) {
          newErrors.lastName = 'Los apellidos deben tener entre 1 y 50 caracteres';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'El nombre de usuario es requerido';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username = 'Solo letras, números y guiones bajos';
        } else if (value.length < 3 || value.length > 50) {
          newErrors.username = 'Debe tener entre 3 y 50 caracteres';
        } else {
          delete newErrors.username;
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'El email es requerido';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          newErrors.email = 'Ingresa un email válido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 8) {
          newErrors.password = 'Debe tener al menos 8 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          newErrors.password = 'Debe contener mayúscula, minúscula y número';
        } else {
          delete newErrors.password;
        }
        break;
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case 'acceptTerms':
        if (!value) {
          newErrors.acceptTerms = 'Debes aceptar los términos';
        } else {
          delete newErrors.acceptTerms;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // Password strength checker
  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const passwordRequirements = [
    { text: 'Mínimo 8 caracteres', met: formData.password.length >= 8 },
    { text: 'Una letra minúscula', met: /[a-z]/.test(formData.password) },
    { text: 'Una letra mayúscula', met: /[A-Z]/.test(formData.password) },
    { text: 'Un número', met: /\d/.test(formData.password) },
  ];

  const validateForm = () => {
    // Validar todos los campos antes de enviar
    const allFields = ['firstName', 'lastName', 'username', 'email', 'password', 'confirmPassword', 'acceptTerms'];
    const newTouched = {};

    allFields.forEach(field => {
      newTouched[field] = true;
      const value = field === 'acceptTerms' ? formData[field] : formData[field].trim();
      validateField(field, value);
    });

    setTouched(newTouched);

    // Si hay errores, no enviar
    if (Object.keys(errors).length > 0) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { confirmPassword, acceptTerms, ...registerData } = formData;
      const result = await register(registerData);

      if (result.success) {
        showSuccess('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión');
        navigate('/login');
      } else {
        showError(result.error);
      }
    } catch (error) {
      showError('Error inesperado al crear la cuenta');
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
            className="hidden md:flex flex-col justify-center space-y-8 px-8"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Comienza tu
                <span className="block bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Transformación
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed">
                Únete a la comunidad fitness más exclusiva y comienza a alcanzar tus objetivos con entrenamiento profesional.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, text: "100% gratuito para empezar" },
                { icon: <User className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Comunidad activa de atletas" },
                { icon: <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />, text: "Acceso inmediato al contenido" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-3 text-slate-300"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center text-red-500">
                    {item.icon}
                  </div>
                  <span className="text-sm sm:text-base">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4">
              <p className="text-slate-300 text-xs leading-relaxed">
                "NackRat cambió completamente mi vida. En 6 meses logré lo que no pude en años."
              </p>
              <div className="flex items-center space-x-3 mt-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600"></div>
                <div>
                  <p className="text-white font-semibold text-xs">Carlos Mendoza</p>
                  <p className="text-slate-500 text-xs">Miembro Premium</p>
                </div>
              </div>
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

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl">
              {/* Desktop Header */}
              <div className="hidden md:block mb-6">
                <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                    <span className="text-white font-black text-xl">J</span>
                  </div>
                  <span className="text-xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    NackRat
                  </span>
                </Link>
              </div>

              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Crea tu cuenta
                </h2>
                <p className="text-sm text-slate-400">
                  Completa el formulario para comenzar tu transformación
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-300 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 focus:ring-2 transition-all duration-300 outline-none text-sm ${
                          errors.firstName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : touched.firstName && !errors.firstName
                            ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                            : 'border-slate-800/50 focus:border-red-500 focus:ring-red-500/20'
                        }`}
                        placeholder="Tu nombre"
                      />
                      {touched.firstName && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {errors.firstName ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                        <XCircle className="w-3 h-3" />
                        <span>{errors.firstName}</span>
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-300 mb-2">
                      Apellido
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 focus:ring-2 transition-all duration-300 outline-none text-sm ${
                          errors.lastName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : touched.lastName && !errors.lastName
                            ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                            : 'border-slate-800/50 focus:border-red-500 focus:ring-red-500/20'
                        }`}
                        placeholder="Tu apellido"
                      />
                      {touched.lastName && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {errors.lastName ? (
                            <XCircle className="w-4 h-4 text-red-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                        <XCircle className="w-3 h-3" />
                        <span>{errors.lastName}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-slate-300 mb-2">
                    Nombre de Usuario
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 focus:ring-2 transition-all duration-300 outline-none text-sm ${
                        errors.username
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : touched.username && !errors.username
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'border-slate-800/50 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                      placeholder="Solo letras, números y guiones bajos"
                    />
                    {touched.username && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {errors.username ? (
                          <XCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">Solo letras, números y guiones bajos (3-50 caracteres)</p>
                  {errors.username && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>{errors.username}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 focus:ring-2 transition-all duration-300 outline-none ${
                        errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : touched.email && !errors.email
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'border-slate-800/50 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {touched.email && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {errors.email ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Contraseña */}
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${
                              passwordStrength <= 2 ? 'bg-red-500' :
                              passwordStrength === 3 ? 'bg-yellow-500' :
                              passwordStrength === 4 ? 'bg-green-500' :
                              'bg-green-600'
                            }`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
                          {passwordStrength <= 2 ? 'Débil' :
                           passwordStrength === 3 ? 'Media' :
                           passwordStrength === 4 ? 'Fuerte' :
                           'Muy fuerte'}
                        </span>
                      </div>

                      {/* Requirements checklist */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            {req.met ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-slate-600" />
                            )}
                            <span className={req.met ? 'text-green-500' : 'text-slate-500'}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>{errors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-300 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full pl-12 pr-12 py-3.5 bg-slate-950/50 border rounded-xl text-white placeholder-slate-500 focus:ring-2 transition-all duration-300 outline-none ${
                        errors.confirmPassword
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : touched.confirmPassword && !errors.confirmPassword
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'border-slate-800/50 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {touched.confirmPassword && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {errors.confirmPassword ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>{errors.confirmPassword}</span>
                    </p>
                  )}
                  {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-xs text-green-500 mt-1.5 flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Las contraseñas coinciden</span>
                    </p>
                  )}
                </div>

                {/* Términos y condiciones */}
                <div className={`flex items-start space-x-3 p-4 bg-slate-950/50 rounded-xl border transition-all duration-300 ${
                  errors.acceptTerms ? 'border-red-500' : touched.acceptTerms && !errors.acceptTerms ? 'border-green-500' : 'border-slate-800/50'
                }`}>
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className="w-5 h-5 rounded border-slate-700 bg-slate-950/50 text-red-500 focus:ring-red-500 focus:ring-offset-0 focus:ring-2 transition-all mt-0.5"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-slate-300 leading-relaxed">
                    Acepto los{' '}
                    <a href="/terms" className="text-red-500 hover:text-red-400 font-semibold transition-colors underline">
                      Términos y Condiciones
                    </a>
                    {' '}y la{' '}
                    <a href="/privacy" className="text-red-500 hover:text-red-400 font-semibold transition-colors underline">
                      Política de Privacidad
                    </a>
                  </label>
                  {touched.acceptTerms && (
                    <div className="ml-auto">
                      {errors.acceptTerms ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {errors.acceptTerms && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center space-x-1">
                    <XCircle className="w-3 h-3" />
                    <span>{errors.acceptTerms}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || Object.keys(errors).length > 0}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-red-500/30 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>Crear Cuenta</span>
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
                  <span className="px-4 bg-slate-900/50 text-slate-500">o</span>
                </div>
              </div>

              {/* Login link */}
              <div className="text-center">
                <p className="text-slate-400">
                  ¿Ya tienes una cuenta?{' '}
                  <Link
                    to="/login"
                    className="text-red-500 hover:text-red-400 font-bold transition-colors"
                  >
                    Inicia sesión aquí
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

export default Register;
