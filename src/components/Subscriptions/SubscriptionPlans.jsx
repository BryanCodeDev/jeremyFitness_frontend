import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { useNotification } from '../../utils/NotificationContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const SubscriptionPlans = ({ onPlanSelect }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const { user } = useAuth();
  const { showError } = useNotification();

  useEffect(() => {
    loadPlans();
    loadCurrentSubscription();
  }, []);

  const loadPlans = async () => {
    try {
      // Aquí iría la llamada a la API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/subscriptions/plans`);
      const data = await response.json();

      setPlans(data.plans || []);
    } catch (error) {
      console.error('Error loading plans:', error);
      showError('Error al cargar los planes de suscripción');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentSubscription = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/subscriptions/status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      setCurrentSubscription(data.subscription);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      // Crear preferencia de pago de Mercado Pago
      const response = await fetch(`${process.env.REACT_APP_API_URL}/subscriptions/create-payment-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId: plan.id,
          successUrl: `${window.location.origin}/subscription/success?payment_id={payment_id}`,
          cancelUrl: `${window.location.origin}/subscriptions`
        })
      });

      const data = await response.json();

      if (data.initPoint) {
        // Redirigir a Mercado Pago
        window.location.href = data.initPoint;
      } else if (data.sandboxInitPoint && process.env.REACT_APP_ENV === 'development') {
        // Usar sandbox en desarrollo
        window.location.href = data.sandboxInitPoint;
      } else {
        showError('Error al crear la sesión de pago');
      }
    } catch (error) {
      console.error('Error creating payment preference:', error);
      showError('Error al procesar la suscripción');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative p-8 rounded-xl border-2 transition-all ${
            plan.id === 'vip'
              ? 'border-secondary bg-gradient-to-br from-secondary/10 to-primary/10'
              : 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5'
          }`}
        >
          {plan.id === 'vip' && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-semibold">
                Más Popular
              </span>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              {plan.name}
            </h3>
            <div className="text-4xl font-bold gradient-text">
              ${plan.price}
              <span className="text-lg text-gray-400">/{plan.interval}</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-primary mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleSubscribe(plan)}
            disabled={currentSubscription?.tier === plan.id}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
              currentSubscription?.tier === plan.id
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'btn-primary hover:scale-105'
            }`}
          >
            {currentSubscription?.tier === plan.id
              ? 'Plan Actual'
              : `Suscribirse a ${plan.name}`
            }
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default SubscriptionPlans;
