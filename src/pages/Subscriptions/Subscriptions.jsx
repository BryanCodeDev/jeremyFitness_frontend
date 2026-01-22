import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../utils/AuthContext';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Shield,
  Star,
  TrendingUp,
  Users,
  Video,
  MessageCircle,
  Award,
  Infinity
} from 'lucide-react';
import {
  getSubscriptionIcon
} from '../../utils/subscriptionUtils';

const Subscriptions = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Precios en pesos colombianos
  const COP_PRICES = useMemo(() => ({
    free: 0,
    premium: 60000,
    vip: 120000
  }), []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const API_BASE_URL = process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/api'
          : 'https://jeremyfitnessbackend-production.up.railway.app/api';
        
        const plansResponse = await axios.get(`${API_BASE_URL}/subscriptions/plans`);
        const plansWithCOP = plansResponse.data.plans.map(plan => ({
          ...plan,
          priceCOP: COP_PRICES[plan.id] || 0
        }));
        setPlans(plansWithCOP);

        if (user) {
          const statusResponse = await axios.get(`${API_BASE_URL}/subscriptions/status`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setCurrentSubscription(statusResponse.data);
        }
      } catch (error) {
        console.error('Error loading subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, COP_PRICES]);

  const benefits = [
    { icon: <Video className="w-5 h-5" />, text: 'Contenido exclusivo en HD' },
    { icon: <MessageCircle className="w-5 h-5" />, text: 'Soporte prioritario 24/7' },
    { icon: <Users className="w-5 h-5" />, text: 'Comunidad privada VIP' },
    { icon: <Award className="w-5 h-5" />, text: 'Certificados y logros' }
  ];

  const getPlanIcon = (planId) => {
    const iconName = getSubscriptionIcon(planId);
    if (iconName === 'Crown') return <Crown className="w-6 h-6" />;
    if (iconName === 'Star') return <Star className="w-6 h-6" />;
    return <Shield className="w-6 h-6" />;
  };

  const handleSubscribe = async (plan) => {
    try {
      const API_BASE_URL = process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000/api'
        : 'https://jeremyfitnessbackend-production.up.railway.app/api';
      
      const response = await axios.post(
        `${API_BASE_URL}/subscriptions/generate-whatsapp-link`,
        { planId: plan.id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      window.open(response.data.whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error generando enlace de WhatsApp:', error);
      // Fallback al método anterior si falla la API
      const phoneNumber = '+573016674680';
      const priceText = plan.id === 'free' ? 'Gratuito' : `$${plan.priceCOP.toLocaleString()} COP por mes`;
      const message = `Hola, estoy interesado en suscribirme al plan: ${plan.name}\n\nPrecio: ${priceText}\n\nCaracterísticas principales:\n${plan.features.slice(0, 3).join('\n')}\n\nPor favor, ayúdame con el proceso de suscripción.`;
      const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-400">Planes de Suscripción</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              Elige tu{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Plan Perfecto
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Desbloquea todo el potencial de tu entrenamiento con acceso ilimitado 
              a contenido premium y herramientas exclusivas
            </p>
          </motion.div>

          {/* Current Subscription Status */}
          {loading ? (
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-slate-800 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
          ) : currentSubscription && currentSubscription.tier !== 'free' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                      <Crown className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        Suscripción {currentSubscription?.tier?.toUpperCase()}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        <p className="text-green-400 font-semibold">
                          {currentSubscription.subscription?.status === 'active' ? 'Activa' : 'Inactiva'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {currentSubscription.expiresAt && (
                    <div className="text-center sm:text-right">
                      <p className="text-sm text-slate-400">Renovación</p>
                      <p className="text-white font-bold">
                        {new Date(currentSubscription.expiresAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 rounded-xl p-3 flex items-center space-x-3"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {benefit.icon}
                </div>
                <p className="text-sm text-slate-300 font-medium">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 lg:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-8 animate-pulse">
                  <div className="h-12 bg-slate-800 rounded-xl mb-6"></div>
                  <div className="h-16 bg-slate-800 rounded mb-6"></div>
                  <div className="space-y-3 mb-8">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-4 bg-slate-800 rounded"></div>
                    ))}
                  </div>
                  <div className="h-12 bg-slate-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
              {plans.map((plan, index) => {
                const isPopular = plan.id === 'vip';
                const isCurrent = currentSubscription?.tier === plan.id;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative group bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-6 sm:p-8 transition-all duration-500 ${
                      isPopular
                        ? 'border-red-500/50 shadow-2xl shadow-red-500/20 lg:scale-105'
                        : 'border-slate-800/50 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/10'
                    }`}
                  >
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Más Popular</span>
                        </div>
                      </div>
                    )}

                    {/* Plan Icon */}
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ${
                      isPopular
                        ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30'
                        : 'bg-slate-800/50 border border-slate-700/50'
                    } text-white transition-all duration-500 ${isPopular ? '' : 'group-hover:border-red-500/50'}`}>
                      {getPlanIcon(plan.id)}
                    </div>

                    {/* Plan Header */}
                    <div className="mb-6">
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-end mb-3">
                        {plan.id === 'free' ? (
                          <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                            Gratuito
                          </span>
                        ) : (
                          <>
                            <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                              ${plan.priceCOP.toLocaleString()}
                            </span>
                            <span className="text-slate-400 text-base sm:text-lg ml-2 mb-2">COP/mes</span>
                          </>
                        )}
                      </div>
                      {plan.price > 0 && (
                        <p className="text-sm text-slate-400">
                          Facturado mensualmente
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isPopular ? 'bg-red-500' : 'bg-slate-700'
                          }`}>
                            <Check className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                          </div>
                          <span className="text-slate-300 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => !isCurrent && handleSubscribe(plan)}
                      className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold transition-all duration-300 ${
                        isCurrent
                          ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                          : isPopular
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105'
                          : 'bg-slate-800/50 text-white border border-slate-700/50 hover:bg-slate-800 hover:border-red-500/50'
                      }`}
                      disabled={isCurrent}
                    >
                      {isCurrent ? (
                        <span className="flex items-center justify-center space-x-2">
                          <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Plan Actual</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Suscribirse a {plan.name}</span>
                        </span>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 lg:py-24 bg-slate-900/30 border-y border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              Todas las{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Membresías
              </span>
              {' '}Incluyen
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { icon: <Video />, title: 'Contenido HD', desc: 'Videos en alta calidad' },
              { icon: <Infinity />, title: 'Acceso Ilimitado', desc: 'Sin restricciones de tiempo' },
              { icon: <Users />, title: 'Comunidad', desc: 'Acceso a la comunidad' },
              { icon: <MessageCircle />, title: 'Soporte', desc: 'Ayuda cuando la necesites' },
              { icon: <Award />, title: 'Certificados', desc: 'Reconocimiento oficial' },
              { icon: <Zap />, title: 'Actualizaciones', desc: 'Nuevo contenido semanal' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-4 sm:p-6 hover:border-red-500/50 transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {React.cloneElement(item.icon, { className: 'w-5 h-5 sm:w-6 sm:h-6' })}
                </div>
                <h3 className="font-bold text-white mb-2 text-base sm:text-lg">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / CTA Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-slate-900 to-red-600/10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
              ¿Tienes{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                preguntas
              </span>
              ?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Nuestro equipo está listo para ayudarte a elegir el plan perfecto para tus objetivos
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Contactar Soporte
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-slate-300 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-300">
                Ver FAQ
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;
