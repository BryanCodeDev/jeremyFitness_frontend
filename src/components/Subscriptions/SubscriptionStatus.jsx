import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { useNotification } from '../../utils/NotificationContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import config from '../../config';

const SubscriptionStatus = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadSubscriptionStatus();
  }, [user]);

  const loadSubscriptionStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/subscriptions/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data); // El backend devuelve tier, expiresAt, isActive directamente
      }
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !window.confirm('¿Estás seguro de que quieres cancelar tu suscripción? Tendrás acceso hasta el final del período actual.')) {
      return;
    }

    setCanceling(true);

    try {
      const response = await fetch(`${config.API_BASE_URL}/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showSuccess('Suscripción cancelada exitosamente');
        await loadSubscriptionStatus(); // Recargar el estado
      } else {
        showError('Error al cancelar la suscripción');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      showError('Error al procesar la cancelación');
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-500/20 text-green-400', text: 'Activa' },
      canceled: { color: 'bg-yellow-500/20 text-yellow-400', text: 'Cancelada' },
      past_due: { color: 'bg-red-500/20 text-red-400', text: 'Vencida' },
      incomplete: { color: 'bg-gray-500/20 text-gray-400', text: 'Incompleta' }
    };

    const config = statusConfig[status] || statusConfig.incomplete;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTierName = (tier) => {
    const tierNames = {
      premium: 'Premium',
      vip: 'VIP',
      free: 'Gratis'
    };
    return tierNames[tier] || tier;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">
          Inicia sesión para ver el estado de tu suscripción
        </p>
      </div>
    );
  }

  if (user.subscriptionTier === 'free') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Sin Suscripción Activa
        </h3>
        <p className="text-gray-400 mb-6">
          Suscríbete para acceder a contenido exclusivo y funciones premium
        </p>
        <button className="btn-primary px-6 py-3">
          Ver Planes Disponibles
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="card p-6">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
            user.subscriptionTier === 'vip'
              ? 'bg-secondary text-white'
              : 'bg-primary text-white'
          }`}>
            {getTierName(user.subscriptionTier)}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Suscripción {getTierName(user.subscriptionTier)}
          </h3>

          {getStatusBadge(subscription?.status || 'active')}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Estado:</span>
            <span className="text-white font-medium">
              {subscription?.status === 'active' ? 'Activa' : 'Inactiva'}
            </span>
          </div>

          {subscription?.current_period_end && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">
                {subscription.cancel_at_period_end ? 'Expira:' : 'Renueva:'}
              </span>
              <span className="text-white font-medium">
                {formatDate(subscription.current_period_end)}
              </span>
            </div>
          )}

          {subscription?.cancel_at_period_end && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                Tu suscripción se cancelará automáticamente el {formatDate(subscription.current_period_end)}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {subscription?.status === 'active' && !subscription.cancel_at_period_end && (
            <button
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="w-full btn-secondary py-3 disabled:opacity-50"
            >
              {canceling ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Cancelando...
                </div>
              ) : (
                'Cancelar Suscripción'
              )}
            </button>
          )}

          <button className="w-full btn-primary py-3">
            Gestionar Facturación
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SubscriptionStatus;
