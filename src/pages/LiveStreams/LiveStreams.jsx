import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Radio, Calendar, Clock, Users, Eye, Bell, Play, Star } from 'lucide-react';
import LiveStreamPlayer from '../../components/VideoPlayer/LiveStreamPlayer';

const LiveStreams = () => {
  const [upcomingStreams, setUpcomingStreams] = useState([]);
  const [activeStreams, setActiveStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStream, setSelectedStream] = useState(null);

  const handleNotificationReminder = async (stream) => {
    try {
      // Obtener token de autenticación
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Debes iniciar sesión para recibir notificaciones');
        return;
      }

      if (stream) {
        // Recordatorio para un stream específico
        await axios.post('http://localhost:5000/api/notifications', {
          notificationType: 'live_stream',
          title: `Recordatorio: ${stream.title}`,
          message: `La transmisión "${stream.title}" comenzará pronto.`,
          data: {
            streamId: stream.id,
            scheduledStart: stream.scheduled_start
          }
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        alert('¡Recordatorio configurado! Te notificaremos antes de que comience la transmisión.');
      } else {
        // Activar notificaciones generales para streams en vivo
        await axios.post('http://localhost:5000/api/notifications', {
          notificationType: 'live_stream',
          title: 'Notificaciones de Streams en Vivo',
          message: 'Recibirás notificaciones cuando haya nuevas transmisiones en vivo disponibles.',
          data: {
            type: 'general_live_streams'
          }
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        alert('¡Notificaciones activadas! Te mantendremos informado sobre las transmisiones en vivo.');
      }
    } catch (error) {
      console.error('Error configurando notificaciones:', error);
      alert('Error al configurar las notificaciones. Inténtalo de nuevo.');
    }
  };

  useEffect(() => {
    const loadStreams = async () => {
      try {
        // Cargar streams programados
        const scheduledResponse = await axios.get('http://localhost:5000/api/live/scheduled');
        const mappedScheduledStreams = scheduledResponse.data.streams.map(stream => ({
          ...stream,
          date: stream.scheduled_start,
          time: new Date(stream.scheduled_start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          duration: '45 min', // Default, since not in DB
          instructor: stream.username,
          participants: stream.viewer_count || 0,
          category: stream.is_premium ? 'Premium' : 'Gratis'
        }));
        setUpcomingStreams(mappedScheduledStreams);

        // Cargar streams activos
        const activeResponse = await axios.get('http://localhost:5000/api/live/active');
        const mappedActiveStreams = activeResponse.data.streams.map(stream => ({
          ...stream,
          date: stream.actual_start,
          time: new Date(stream.actual_start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          duration: 'En vivo',
          instructor: stream.username,
          participants: stream.viewer_count || 0,
          category: stream.is_premium ? 'Premium' : 'Gratis'
        }));
        setActiveStreams(mappedActiveStreams);
      } catch (error) {
        console.error('Error loading streams:', error);
        setUpcomingStreams([]);
        setActiveStreams([]);
      } finally {
        setLoading(false);
      }
    };

    loadStreams();
  }, []);

  const features = [
    {
      icon: <Radio className="w-6 h-6" />,
      title: 'En Vivo',
      description: 'Entrena en tiempo real con NackRat'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Comunidad',
      description: 'Conecta con otros miembros'
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Notificaciones',
      description: 'Recibe alertas de nuevas sesiones'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Contenido Exclusivo',
      description: 'Acceso a sesiones premium'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      {selectedStream && (
        <LiveStreamPlayer
          stream={selectedStream}
          onClose={() => setSelectedStream(null)}
        />
      )}
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-400">Transmisiones en Vivo</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              Entrena{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                en Vivo
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Únete a las sesiones en tiempo real con NackRat y la comunidad.
              Interactúa, aprende y supera tus límites juntos.
            </p>
          </motion.div>

          {/* Status Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center space-x-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-1">{activeStreams.length}</div>
              <div className="text-sm text-slate-400">En Vivo Ahora</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-1">{upcomingStreams.length}</div>
              <div className="text-sm text-slate-400">Próximas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">
                {activeStreams.reduce((total, stream) => total + (stream.participants || 0), 0)}
              </div>
              <div className="text-sm text-slate-400">Espectadores</div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl p-6 text-center hover:border-red-500/50 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Streams */}
      {activeStreams.length > 0 && (
        <section className="py-16 lg:py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
                En{' '}
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Vivo Ahora
                </span>
              </h2>
              <p className="text-lg text-slate-400">
                Únete a las sesiones que están transmitiendo en este momento
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden animate-pulse">
                    <div className="aspect-video bg-slate-800"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-slate-800 rounded w-1/2"></div>
                      <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeStreams.map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-slate-900/50 backdrop-blur-xl border border-red-500/50 rounded-2xl overflow-hidden hover:border-red-500/70 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-3 left-3 flex items-center space-x-2 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold animate-pulse">
                        <Radio className="w-3 h-3" />
                        <span>EN VIVO</span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center space-x-2 bg-slate-900/80 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                        <Users className="w-3 h-3" />
                        <span>{stream.participants}</span>
                      </div>
                      <Play className="w-16 h-16 text-red-500 group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400">
                          {stream.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-xl mb-3 text-white group-hover:text-red-400 transition-colors">
                        {stream.title}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-slate-400 text-sm">
                          <Clock className="w-4 h-4 mr-2 text-red-500" />
                          <span>{stream.time} • {stream.duration}</span>
                        </div>
                        <div className="flex items-center text-slate-400 text-sm">
                          <Eye className="w-4 h-4 mr-2 text-red-500" />
                          <span>{stream.participants} espectadores</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedStream(stream)}
                        className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <Play className="w-4 h-4" />
                        <span>Unirme Ahora</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Upcoming Streams */}
      <section className="py-16 lg:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
              Próximas{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Sesiones
              </span>
            </h2>
            <p className="text-lg text-slate-400">
              Reserva tu lugar en las próximas transmisiones en vivo
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-slate-800"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-800 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingStreams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500"
              >
                <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Play className="w-16 h-16 text-red-500 group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                  
                  <div className="absolute top-3 left-3 flex items-center space-x-2 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Próximamente</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-400">
                      {stream.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-xl mb-3 text-white group-hover:text-red-400 transition-colors">
                    {stream.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-slate-400 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-red-500" />
                      <span>{new Date(stream.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-red-500" />
                      <span>{stream.time} • {stream.duration}</span>
                    </div>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Eye className="w-4 h-4 mr-2 text-red-500" />
                      <span>{stream.participants} interesados</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNotificationReminder(stream)}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Recordarme</span>
                  </button>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
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
              ¿Listo para entrenar{' '}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                en vivo
              </span>
              ?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              No te pierdas las próximas sesiones. Activa las notificaciones y únete a la comunidad.
            </p>
            <button
              onClick={() => handleNotificationReminder(null)}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105 group"
            >
              <Bell className="w-5 h-5 mr-2" />
              <span>Activar Notificaciones</span>
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LiveStreams;
