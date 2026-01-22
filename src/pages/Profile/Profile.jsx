import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import {
  User,
  Mail,
  Crown,
  Edit3,
  Camera,
  Award,
  Link as LinkIcon,
  Shield,
  Star,
  TrendingUp,
  Save,
  X,
  Key,
  Send
} from 'lucide-react';
import {
  getSubscriptionLabel,
  getSubscriptionAvatarGradient,
  getSubscriptionBadgeGradient,
  getSubscriptionIcon
} from '../../utils/subscriptionUtils';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    bio: user?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    email: user?.email || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    privacyPublicProfile: user?.privacyPublicProfile || true,
    privacyShowEmail: user?.privacyShowEmail || false,
    notificationsEmailNewContent: user?.notificationsEmailNewContent || true,
    notificationsEmailProducts: user?.notificationsEmailProducts || true,
    notificationsEmailSubscriptions: user?.notificationsEmailSubscriptions || true
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Funciones de suscripción ahora importadas desde utils

  const stats = [
    { icon: <TrendingUp className="w-5 h-5" />, label: 'Entrenamientos', value: '127' },
    { icon: <Award className="w-5 h-5" />, label: 'Logros', value: '23' },
    { icon: <Star className="w-5 h-5" />, label: 'Racha', value: '15 días' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      displayName: user?.displayName || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      const API_BASE_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api'
        : 'https://jeremyfitnessbackend-production.up.railway.app/api';
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || API_BASE_URL}/users/profile/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // Actualizar user en AuthContext usando updateProfile
        await updateProfile({ profileImageUrl: data.imageUrl });
      } else {
        throw new Error('Error uploading image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequestPasswordReset = async () => {
    if (!passwordForm.email) return;

    setPasswordLoading(true);
    try {
      const API_BASE_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api'
        : 'https://jeremyfitnessbackend-production.up.railway.app/api';
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || API_BASE_URL}/users/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: passwordForm.email })
      });

      if (response.ok) {
        setResetEmailSent(true);
      }
    } catch (error) {
      console.error('Error requesting password reset:', error);
    } finally {
      setPasswordLoading(false);
    }
  };


  const handleSettingsChange = (e) => {
    const { name, checked } = e.target;
    setSettingsForm(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSettings = async () => {
    setSettingsLoading(true);
    try {
      await updateProfile(settingsForm);
      setShowPrivacyModal(false);
      setShowNotificationsModal(false);
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Mi Perfil
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg">
              Gestiona tu información personal y preferencias
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6"
              >
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-800/50">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${getSubscriptionAvatarGradient(user?.subscription_tier)} rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-xl shadow-red-500/20`}>
                      {user?.profileImageUrl ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'development'
                            ? 'http://localhost:5000'
                            : 'https://jeremyfitnessbackend-production.up.railway.app')}${user.profileImageUrl}`}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        user?.firstName?.[0] + user?.lastName?.[0]
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profileImageInput"
                    />
                    <label
                      htmlFor="profileImageInput"
                      className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    >
                      {uploadingImage ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </label>
                    {/* Subscription Badge on Avatar */}
                    <div className={`absolute -bottom-2 -right-2 flex items-center gap-1 bg-gradient-to-r ${getSubscriptionBadgeGradient(user?.subscription_tier)} px-2.5 py-1 rounded-lg shadow-lg`}>
                      {getSubscriptionIcon(user?.subscription_tier) === 'Crown' && <Crown className="w-3 h-3" />}
                      {getSubscriptionIcon(user?.subscription_tier) === 'Star' && <Star className="w-3 h-3" />}
                      {getSubscriptionIcon(user?.subscription_tier) === 'Shield' && <Shield className="w-3 h-3" />}
                      <span className="text-xs font-bold text-white">
                        {getSubscriptionLabel(user?.subscription_tier)}
                      </span>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
                      {user?.displayName}
                    </h2>
                    <p className="text-slate-400 mb-2 flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                    <p className="text-slate-500 text-sm flex items-center gap-2">
                      <User className="w-4 h-4" />
                      @{user?.username}
                    </p>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Editar Perfil</span>
                    <span className="sm:hidden">Editar</span>
                  </button>
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                            <User className="w-4 h-4" />
                            Nombre
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Tu nombre"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                            <User className="w-4 h-4" />
                            Apellido
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Tu apellido"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                          <LinkIcon className="w-4 h-4" />
                          Nombre de Usuario
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Nombre para mostrar"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                          <Award className="w-4 h-4" />
                          Biografía
                        </label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          placeholder="Cuéntanos algo sobre ti..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-4 h-4" />
                          {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all duration-300"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                            <User className="w-4 h-4" />
                            Nombre Completo
                          </label>
                          <p className="text-white text-lg font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                            <LinkIcon className="w-4 h-4" />
                            Nombre de Usuario
                          </label>
                          <p className="text-white text-lg font-medium">
                            @{user?.username}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                          <Mail className="w-4 h-4" />
                          Correo Electrónico
                        </label>
                        <p className="text-white text-lg font-medium">
                          {user?.email}
                        </p>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2">
                          <Award className="w-4 h-4" />
                          Biografía
                        </label>
                        <p className="text-slate-300 leading-relaxed">
                          {user?.bio || 'Aún no has añadido una biografía. ¡Cuéntanos algo sobre ti!'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  Estadísticas
                </h3>
                <div className="space-y-3">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white">
                          {stat.icon}
                        </div>
                        <span className="text-slate-300 font-medium text-sm sm:text-base">{stat.label}</span>
                      </div>
                      <span className="text-white font-bold text-base sm:text-lg">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Subscription Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-red-500" />
                  Suscripción
                </h3>
                <div className={`bg-gradient-to-br ${getSubscriptionBadgeGradient(user?.subscription_tier)} rounded-xl p-4 sm:p-6 mb-4`}>
                  <div className="flex items-center gap-2 text-white mb-2">
                    {getSubscriptionIcon(user?.subscription_tier) === 'Crown' && <Crown className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {getSubscriptionIcon(user?.subscription_tier) === 'Star' && <Star className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {getSubscriptionIcon(user?.subscription_tier) === 'Shield' && <Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span className="text-xl sm:text-2xl font-black">
                      Plan {getSubscriptionLabel(user?.subscription_tier)}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm">
                    {user?.subscription_tier === 'free'
                      ? 'Actualiza para desbloquear contenido exclusivo'
                      : 'Disfrutando de todos los beneficios'}
                  </p>
                </div>
                {user?.subscription_tier === 'free' && (
                  <button className="w-full py-2 sm:py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 text-sm sm:text-base">
                    Mejorar Plan
                  </button>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6"
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                  Acciones Rápidas
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full py-2 sm:py-3 text-left px-3 sm:px-4 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    Cambiar contraseña
                  </button>
                  <button
                    onClick={() => setShowPrivacyModal(true)}
                    className="w-full py-2 sm:py-3 text-left px-3 sm:px-4 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    Configuración de privacidad
                  </button>
                  <button
                    onClick={() => setShowNotificationsModal(true)}
                    className="w-full py-2 sm:py-3 text-left px-3 sm:px-4 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300 font-medium text-sm sm:text-base"
                  >
                    Notificaciones
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-red-500" />
                Cambiar Contraseña
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setResetEmailSent(false);
                  setPasswordForm({ email: user?.email || '', newPassword: '', confirmPassword: '' });
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetEmailSent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Email Enviado</h4>
                <p className="text-slate-400 mb-6">
                  Revisa tu email y sigue las instrucciones para restablecer tu contraseña.
                </p>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setResetEmailSent(false);
                    setPasswordForm({ email: user?.email || '', newPassword: '', confirmPassword: '' });
                  }}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={passwordForm.email}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Tu email"
                  />
                </div>

                <div className="text-sm text-slate-400">
                  <p>Para cambiar tu contraseña, enviaremos un enlace de restablecimiento a tu email.</p>
                </div>

                <button
                  onClick={handleRequestPasswordReset}
                  disabled={passwordLoading || !passwordForm.email}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Configuración de Privacidad
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Perfil Público</label>
                  <p className="text-sm text-slate-400">Permite que otros vean tu perfil</p>
                </div>
                <input
                  type="checkbox"
                  name="privacyPublicProfile"
                  checked={settingsForm.privacyPublicProfile}
                  onChange={handleSettingsChange}
                  className="w-5 h-5 text-red-500 bg-slate-800 border-slate-600 rounded focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Mostrar Email</label>
                  <p className="text-sm text-slate-400">Muestra tu email en el perfil público</p>
                </div>
                <input
                  type="checkbox"
                  name="privacyShowEmail"
                  checked={settingsForm.privacyShowEmail}
                  onChange={handleSettingsChange}
                  className="w-5 h-5 text-red-500 bg-slate-800 border-slate-600 rounded focus:ring-red-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {settingsLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="flex-1 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notifications Settings Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-red-500" />
                Configuración de Notificaciones
              </h3>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Nuevo Contenido</label>
                  <p className="text-sm text-slate-400">Notificaciones de nuevo contenido</p>
                </div>
                <input
                  type="checkbox"
                  name="notificationsEmailNewContent"
                  checked={settingsForm.notificationsEmailNewContent}
                  onChange={handleSettingsChange}
                  className="w-5 h-5 text-red-500 bg-slate-800 border-slate-600 rounded focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Productos</label>
                  <p className="text-sm text-slate-400">Notificaciones de nuevos productos</p>
                </div>
                <input
                  type="checkbox"
                  name="notificationsEmailProducts"
                  checked={settingsForm.notificationsEmailProducts}
                  onChange={handleSettingsChange}
                  className="w-5 h-5 text-red-500 bg-slate-800 border-slate-600 rounded focus:ring-red-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-white font-medium">Suscripciones</label>
                  <p className="text-sm text-slate-400">Notificaciones de suscripciones</p>
                </div>
                <input
                  type="checkbox"
                  name="notificationsEmailSubscriptions"
                  checked={settingsForm.notificationsEmailSubscriptions}
                  onChange={handleSettingsChange}
                  className="w-5 h-5 text-red-500 bg-slate-800 border-slate-600 rounded focus:ring-red-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {settingsLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className="flex-1 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;
