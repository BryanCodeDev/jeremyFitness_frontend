import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Crown, Users, Video, Target, Zap, Award, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '../../utils/AuthContext';
import { api } from '../../utils/AuthContext';
import ContentModal from '../../components/Content/ContentModal';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredContent, setFeaturedContent] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadFeaturedContent = async () => {
      try {
        const response = await api.get('/content/public', {
          params: { limit: 6, sortBy: 'view_count', sortOrder: 'DESC' }
        });
        const mappedContent = response.data.content.map(item => ({
          ...item,
          type: item.content_type,
          duration: item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : undefined
        }));
        setFeaturedContent(mappedContent);
      } catch (error) {
        console.error('Error loading featured content:', error);
        setFeaturedContent([]);
      }
    };

    loadFeaturedContent();
  }, []);

  const features = [
    {
      icon: <Video className="w-7 h-7" />,
      title: 'Videos Exclusivos',
      description: 'Contenido en HD con rutinas detalladas y técnicas profesionales'
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'En Vivo Interactivo',
      description: 'Sesiones en tiempo real con NackRat y la comunidad'
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Planes Personalizados',
      description: 'Programas de entrenamiento adaptados a tus objetivos'
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Comunidad Activa',
      description: 'Conecta con otros entusiastas del fitness y comparte tu progreso'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Miembros Activos', icon: <Users className="w-5 h-5" /> },
    { value: '500+', label: 'Videos Premium', icon: <Video className="w-5 h-5" /> },
    { value: '95%', label: 'Satisfacción', icon: <Star className="w-5 h-5" /> },
    { value: '24/7', label: 'Soporte', icon: <Award className="w-5 h-5" /> }
  ];

  const handleContentClick = (item) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-8"
              >
                <Crown className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-400">Plataforma #1 en Fitness Online</span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                  NackRat
                </span>
                <br />
                <span className="text-white">El Verdadero Valhalla</span>
              </h1>

              <p className="text-xl sm:text-2xl lg:text-3xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                El Verdadero Valhalla: Transforma tu cuerpo y mente con entrenamientos exclusivos,
                nutrición personalizada y el apoyo de una comunidad dedicada
              </p>

              {!isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105"
                  >
                    <span>Comenzar Ahora</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/content"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-300 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    <span>Ver Contenido Gratuito</span>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/content"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105"
                  >
                    <span>Explorar Contenido</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {user?.subscription_tier === 'free' && (
                    <Link
                      to="/subscriptions"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-300 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-300"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      <span>Mejorar a Premium</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                    <div className="flex items-center justify-center space-x-2 text-red-500 mb-2">
                      {stat.icon}
                      <span className="text-3xl font-black">{stat.value}</span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-8 h-12 border-2 border-slate-700 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-red-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-slate-900/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              ¿Por qué elegir{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                NackRat
              </span>
              ?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Más que una plataforma, es una experiencia completa de transformación física y mental
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-red-500/30">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              Contenido{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Destacado
              </span>
            </h2>
            <p className="text-xl text-slate-400">
              Explora nuestro contenido más popular y reciente
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
            {featuredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 cursor-pointer"
                onClick={() => handleContentClick(item)}
              >
                <div className="relative aspect-video bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500">
                      <Play className="w-8 h-8 text-red-500" fill="currentColor" />
                    </div>
                  </div>

                  {item.isPremium && (
                    <div className="absolute top-3 right-3 flex items-center space-x-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                      <Crown className="w-3 h-3" />
                      <span>Premium</span>
                    </div>
                  )}

                  {item.duration && (
                    <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-slate-950/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold">
                      <Clock className="w-3 h-3" />
                      <span>{item.duration}</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/content"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105 group"
            >
              <span>Ver Todo el Contenido</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-slate-900 to-red-600/10" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              ¿Listo para transformar tu{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                vida
              </span>
              ?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Únete a miles de personas que ya han cambiado su estilo de vida con nuestros métodos probados
            </p>

            {!isAuthenticated ? (
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-12 py-5 text-xl font-black text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105 group"
              >
                <CheckCircle className="w-6 h-6 mr-3" />
                <span>Comenzar Mi Transformación</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : user?.subscription_tier === 'free' ? (
              <Link
                to="/subscriptions"
                className="inline-flex items-center justify-center px-12 py-5 text-xl font-black text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105 group"
              >
                <Crown className="w-6 h-6 mr-3" />
                <span>Mejorar a Premium</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/premium"
                className="inline-flex items-center justify-center px-12 py-5 text-xl font-black text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105 group"
              >
                <Video className="w-6 h-6 mr-3" />
                <span>Ver Contenido Premium</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Modal */}
      <ContentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        content={selectedContent}
      />
    </div>
  );
};

export default Home;
