import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth, api } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import {
  Settings,
  Shield,
  ArrowRight,
  Save,
  RefreshCw,
  Database,
  Mail,
  Lock,
  Globe,
  CreditCard,
  Bell,
  Video,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AdminSettings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [testingEmail, setTestingEmail] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadSettings();
  }, [user, navigate]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/admin/settings');

      // Convertir la estructura de la API a la estructura del componente
      const apiSettings = response.data.settings;
      const formattedSettings = {
        general: {
          siteName: apiSettings.general?.siteName?.value || 'NackRat Platform',
          siteDescription: apiSettings.general?.siteDescription?.value || 'Plataforma de fitness y bienestar',
          contactEmail: apiSettings.general?.contactEmail?.value || 'admin@jeremyfitness.com',
          timezone: apiSettings.general?.timezone?.value || 'America/Bogota',
          language: apiSettings.general?.language?.value || 'es'
        },
        security: {
          sessionTimeout: apiSettings.security?.sessionTimeout?.value || 30,
          passwordMinLength: apiSettings.security?.passwordMinLength?.value || 8,
          requireSpecialChars: apiSettings.security?.requireSpecialChars?.value || true,
          enableTwoFactor: apiSettings.security?.enableTwoFactor?.value || false,
          maxLoginAttempts: apiSettings.security?.maxLoginAttempts?.value || 5
        },
        content: {
          maxFileSize: apiSettings.content?.maxFileSize?.value || 500,
          allowedFileTypes: apiSettings.content?.allowedFileTypes?.value || ['mp4', 'jpg', 'png', 'pdf'],
          autoApproveContent: apiSettings.content?.autoApproveContent?.value || false,
          enableComments: apiSettings.content?.enableComments?.value || true,
          enableRatings: apiSettings.content?.enableRatings?.value || true
        },
        payments: {
          stripeEnabled: apiSettings.payments?.stripeEnabled?.value || true,
          paypalEnabled: apiSettings.payments?.paypalEnabled?.value || false,
          currency: apiSettings.payments?.currency?.value || 'USD',
          taxRate: apiSettings.payments?.taxRate?.value || 0,
          commissionRate: apiSettings.payments?.commissionRate?.value || 10
        },
        notifications: {
          emailEnabled: apiSettings.notifications?.emailEnabled?.value || true,
          smtpHost: apiSettings.notifications?.smtpHost?.value || 'smtp.gmail.com',
          smtpPort: apiSettings.notifications?.smtpPort?.value || 587,
          smtpUser: apiSettings.notifications?.smtpUser?.value || '',
          smtpPassword: apiSettings.notifications?.smtpPassword?.value || '',
          emailFrom: apiSettings.notifications?.emailFrom?.value || 'noreply@jeremyfitness.com'
        },
        maintenance: {
          maintenanceMode: apiSettings.maintenance?.maintenanceMode?.value || false,
          maintenanceMessage: apiSettings.maintenance?.maintenanceMessage?.value || 'El sitio está en mantenimiento. Volveremos pronto.',
          backupFrequency: apiSettings.maintenance?.backupFrequency?.value || 'daily',
          lastBackup: apiSettings.maintenance?.lastBackup?.value || new Date().toISOString()
        }
      };

      setSettings(formattedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Convertir la estructura del componente a la estructura de la API
      const apiSettings = {
        general: {
          siteName: settings.general.siteName,
          siteDescription: settings.general.siteDescription,
          contactEmail: settings.general.contactEmail,
          timezone: settings.general.timezone,
          language: settings.general.language
        },
        security: {
          sessionTimeout: settings.security.sessionTimeout,
          passwordMinLength: settings.security.passwordMinLength,
          requireSpecialChars: settings.security.requireSpecialChars,
          enableTwoFactor: settings.security.enableTwoFactor,
          maxLoginAttempts: settings.security.maxLoginAttempts
        },
        content: {
          maxFileSize: settings.content.maxFileSize,
          allowedFileTypes: settings.content.allowedFileTypes,
          autoApproveContent: settings.content.autoApproveContent,
          enableComments: settings.content.enableComments,
          enableRatings: settings.content.enableRatings
        },
        payments: {
          stripeEnabled: settings.payments.stripeEnabled,
          paypalEnabled: settings.payments.paypalEnabled,
          currency: settings.payments.currency,
          taxRate: settings.payments.taxRate,
          commissionRate: settings.payments.commissionRate
        },
        notifications: {
          emailEnabled: settings.notifications.emailEnabled,
          smtpHost: settings.notifications.smtpHost,
          smtpPort: settings.notifications.smtpPort,
          smtpUser: settings.notifications.smtpUser,
          smtpPassword: settings.notifications.smtpPassword,
          emailFrom: settings.notifications.emailFrom
        },
        maintenance: {
          maintenanceMode: settings.maintenance.maintenanceMode,
          maintenanceMessage: settings.maintenance.maintenanceMessage,
          backupFrequency: settings.maintenance.backupFrequency,
          lastBackup: settings.maintenance.lastBackup
        }
      };

      await api.put('/admin/settings', { settings: apiSettings });

      setSuccess('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const testEmailConfiguration = async () => {
    try {
      setTestingEmail(true);
      setError(null);

      // Usar el email del admin actual para la prueba
      const testEmail = user?.email;

      if (!testEmail) {
        setError('No se pudo obtener el email del administrador para la prueba');
        return;
      }

      await api.post('/admin/settings/test-email', { to: testEmail });

      setSuccess('Email de prueba enviado exitosamente');
    } catch (error) {
      console.error('Error testing email:', error);
      setError('Error al probar la configuración de email');
    } finally {
      setTestingEmail(false);
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

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'security', label: 'Seguridad', icon: <Lock className="w-4 h-4" /> },
    { id: 'content', label: 'Contenido', icon: <Video className="w-4 h-4" /> },
    { id: 'payments', label: 'Pagos', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Mantenimiento', icon: <Database className="w-4 h-4" /> }
  ];

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

      <div className="lg:ml-72 container mx-auto px-4 sm:px-6 lg:px-4 lg:pr-4 py-8 lg:py-12 relative z-10">
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
                  <Settings className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                  <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Configuración del Sistema
                  </span>
                </h1>
                <p className="text-slate-400 text-base sm:text-lg">
                  Gestiona la configuración global de la plataforma
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={loadSettings}
                  disabled={loading}
                  className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl px-4 py-2 hover:border-red-500/50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-sm font-semibold text-slate-300">Recargar</span>
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saving || loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl px-6 py-3 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            </motion.div>
          )}

          {/* Settings Content */}
          {loading ? (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-slate-800 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                      <div className="h-10 bg-slate-800 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : settings ? (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-slate-800/50">
                <nav className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-400'
                          : 'border-transparent text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-bold text-white">Configuración General</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Nombre del Sitio</label>
                        <input
                          type="text"
                          value={settings.general.siteName}
                          onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Email de Contacto</label>
                        <input
                          type="email"
                          value={settings.general.contactEmail}
                          onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Descripción del Sitio</label>
                        <textarea
                          value={settings.general.siteDescription}
                          onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="w-5 h-5 text-red-400" />
                      <h3 className="text-lg font-bold text-white">Configuración de Seguridad</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Timeout de Sesión (minutos)</label>
                        <input
                          type="number"
                          min="5"
                          max="480"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Longitud Mínima de Contraseña</label>
                        <input
                          type="number"
                          min="6"
                          max="32"
                          value={settings.security.passwordMinLength}
                          onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Máximo Intentos de Login</label>
                        <input
                          type="number"
                          min="3"
                          max="10"
                          value={settings.security.maxLoginAttempts}
                          onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.security.requireSpecialChars}
                            onChange={(e) => updateSetting('security', 'requireSpecialChars', e.target.checked)}
                            className="rounded border-slate-600 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm font-semibold text-slate-300">Requerir Caracteres Especiales</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Video className="w-5 h-5 text-purple-400" />
                      <h3 className="text-lg font-bold text-white">Configuración de Contenido</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Tamaño Máximo de Archivo (MB)</label>
                        <input
                          type="number"
                          min="1"
                          max="2000"
                          value={settings.content.maxFileSize}
                          onChange={(e) => updateSetting('content', 'maxFileSize', parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Tipos de Archivo Permitidos</label>
                        <input
                          type="text"
                          value={settings.content.allowedFileTypes.join(', ')}
                          onChange={(e) => updateSetting('content', 'allowedFileTypes', e.target.value.split(',').map(s => s.trim()))}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.content.enableComments}
                            onChange={(e) => updateSetting('content', 'enableComments', e.target.checked)}
                            className="rounded border-slate-600 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm font-semibold text-slate-300">Habilitar Comentarios</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.content.enableRatings}
                            onChange={(e) => updateSetting('content', 'enableRatings', e.target.checked)}
                            className="rounded border-slate-600 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm font-semibold text-slate-300">Habilitar Calificaciones</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5 text-green-400" />
                      <h3 className="text-lg font-bold text-white">Configuración de Pagos</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Moneda</label>
                        <select
                          value={settings.payments.currency}
                          onChange={(e) => updateSetting('payments', 'currency', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        >
                          <option value="USD">USD - Dólar Estadounidense</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="COP">COP - Peso Colombiano</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Tasa de Comisión (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          step="0.1"
                          value={settings.payments.commissionRate}
                          onChange={(e) => updateSetting('payments', 'commissionRate', parseFloat(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.payments.stripeEnabled}
                            onChange={(e) => updateSetting('payments', 'stripeEnabled', e.target.checked)}
                            className="rounded border-slate-600 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm font-semibold text-slate-300">Habilitar Stripe</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.payments.paypalEnabled}
                            onChange={(e) => updateSetting('payments', 'paypalEnabled', e.target.checked)}
                            className="rounded border-slate-600 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm font-semibold text-slate-300">Habilitar PayPal</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="w-5 h-5 text-yellow-400" />
                      <h3 className="text-lg font-bold text-white">Configuración de Notificaciones</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Servidor SMTP</label>
                        <input
                          type="text"
                          value={settings.notifications.smtpHost}
                          onChange={(e) => updateSetting('notifications', 'smtpHost', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Puerto SMTP</label>
                        <input
                          type="number"
                          value={settings.notifications.smtpPort}
                          onChange={(e) => updateSetting('notifications', 'smtpPort', parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Usuario SMTP</label>
                        <input
                          type="text"
                          value={settings.notifications.smtpUser}
                          onChange={(e) => updateSetting('notifications', 'smtpUser', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Contraseña SMTP</label>
                        <input
                          type="password"
                          value={settings.notifications.smtpPassword}
                          onChange={(e) => updateSetting('notifications', 'smtpPassword', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-sm font-semibold text-slate-300 mb-2">Email Remitente</label>
                        <input
                          type="email"
                          value={settings.notifications.emailFrom}
                          onChange={(e) => updateSetting('notifications', 'emailFrom', e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <button
                          onClick={testEmailConfiguration}
                          disabled={testingEmail || !settings.notifications.emailEnabled}
                          className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 font-semibold rounded-xl px-6 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Mail className="w-5 h-5" />
                          <span>{testingEmail ? 'Probando...' : 'Probar Configuración de Email'}</span>
                        </button>
                        <p className="text-xs text-slate-400 mt-2">
                          Envía un email de prueba a tu dirección para verificar la configuración SMTP.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'maintenance' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Database className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-bold text-white">Configuración de Mantenimiento</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.maintenance.maintenanceMode}
                            onChange={(e) => updateSetting('maintenance', 'maintenanceMode', e.target.checked)}
                            className="rounded border-slate-600 text-red-500 focus:ring-red-500"
                          />
                          <span className="text-sm font-semibold text-slate-300">Modo de Mantenimiento</span>
                        </label>
                      </div>

                      {settings.maintenance.maintenanceMode && (
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">Mensaje de Mantenimiento</label>
                          <textarea
                            value={settings.maintenance.maintenanceMessage}
                            onChange={(e) => updateSetting('maintenance', 'maintenanceMessage', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">Frecuencia de Backup</label>
                          <select
                            value={settings.maintenance.backupFrequency}
                            onChange={(e) => updateSetting('maintenance', 'backupFrequency', e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          >
                            <option value="hourly">Cada Hora</option>
                            <option value="daily">Diario</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensual</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">Último Backup</label>
                          <div className="px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-slate-400">
                            {new Date(settings.maintenance.lastBackup).toLocaleString('es-ES')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;
