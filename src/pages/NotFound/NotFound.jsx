import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, AlertCircle, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
            className="mb-6 flex justify-center"
          >
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-xl shadow-red-500/50">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-xl opacity-50"
              />
            </div>
          </motion.div>

          {/* Error Code */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-4"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-2">
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                404
              </span>
            </h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
              Página no encontrada
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
              Pero no te preocupes, ¡hay mucho más contenido esperándote!
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <Link
              to="/"
              className="group w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span>Volver al Inicio</span>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-slate-300 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span>Página Anterior</span>
            </button>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 pt-6 border-t border-slate-800/50"
          >
            <p className="text-sm text-slate-500 mb-3">
              ¿Necesitas ayuda? Intenta estas opciones:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                to="/content"
                className="inline-flex items-center px-3 py-2 text-sm font-semibold text-slate-300 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
              >
                <Search className="w-4 h-4 mr-2" />
                Explorar Contenido
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
