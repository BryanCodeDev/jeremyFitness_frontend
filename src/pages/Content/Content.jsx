import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Play, Image as ImageIcon, FileText, Clock, Crown, Filter, Search, Grid3x3, List, TrendingUp, Calendar, Eye } from 'lucide-react';
import ContentModal from '../../components/Content/ContentModal';

const Content = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const API_BASE_URL = process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/api'
          : 'https://jeremyfitnessbackend-production.up.railway.app/api';
        
        const response = await axios.get(`${API_BASE_URL}/content/public`, {
          params: { type: filter === 'all' ? undefined : filter },
          headers
        });
        const mappedContent = response.data.content.map(item => ({
          ...item,
          type: item.content_type,
          duration: item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : undefined
        }));
        setContent(mappedContent);
      } catch (error) {
        console.error('Error loading content:', error);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [filter]);

  const filteredContent = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Play className="w-5 h-5" />;
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'post':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const handleContentClick = (item) => {
    setSelectedContent(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  const filters = [
    { id: 'all', label: 'Todo', icon: <Grid3x3 className="w-4 h-4" /> },
    { id: 'video', label: 'Videos', icon: <Play className="w-4 h-4" /> },
    { id: 'image', label: 'Imágenes', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'post', label: 'Posts', icon: <FileText className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <div className="inline-flex items-center space-x-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-400">Contenido Actualizado</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">
              <span className="text-white">Contenido </span>
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Fitness
              </span>
            </h1>
            <p className="text-xl text-slate-400">
              Descubre rutinas, consejos y guías para alcanzar tus objetivos
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 transition-all"
              />
            </div>

            {/* Filter Buttons & View Mode */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/30 backdrop-blur-xl border border-slate-800/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
                <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div className="flex space-x-2">
                  {filters.map((filterType) => (
                    <button
                      key={filterType.id}
                      onClick={() => setFilter(filterType.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        filter === filterType.id
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30'
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {filterType.icon}
                      <span className="hidden sm:inline">{filterType.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-red-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-red-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Grid/List */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-video bg-slate-800/50"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-800/50 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800/50 rounded w-full"></div>
                    <div className="h-4 bg-slate-800/50 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContent.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No se encontró contenido</h3>
              <p className="text-slate-400">Intenta con otros términos de búsqueda o filtros</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredContent.map((item, index) => (
                  viewMode === 'grid' ? (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 cursor-pointer"
                      onClick={() => handleContentClick(item)}
                    >
                      <div className="relative aspect-video bg-slate-800/50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500">
                            {getContentIcon(item.content_type)}
                          </div>
                        </div>

                        {item.isPremium && (
                          <div className="absolute top-3 left-3 flex items-center space-x-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
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

                        <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-slate-950/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          {getContentIcon(item.content_type)}
                          <span className="capitalize">{item.content_type}</span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-lg mb-2 text-white group-hover:text-red-400 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                          <div className="flex items-center space-x-2 text-slate-500 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>Reciente</span>
                          </div>
                          <button className="text-red-500 hover:text-red-400 font-semibold text-sm transition-colors">
                            Ver más →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 cursor-pointer"
                      onClick={() => handleContentClick(item)}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-64 aspect-video sm:aspect-auto bg-slate-800/50 overflow-hidden flex-shrink-0">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-125 transition-transform duration-500">
                              {getContentIcon(item.content_type)}
                            </div>
                          </div>

                          {item.isPremium && (
                            <div className="absolute top-3 left-3 flex items-center space-x-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
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

                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center space-x-1 bg-slate-800/50 px-2 py-1 rounded-lg text-xs font-semibold text-slate-300">
                                  {getContentIcon(item.content_type)}
                                  <span className="capitalize">{item.content_type}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-slate-500 text-xs">
                                  <Calendar className="w-3 h-3" />
                                  <span>Reciente</span>
                                </div>
                              </div>
                              <h3 className="font-bold text-xl text-white group-hover:text-red-400 transition-colors mb-2">
                                {item.title}
                              </h3>
                              <p className="text-slate-400 text-sm line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                            <div className="flex items-center space-x-4 text-slate-500 text-sm">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>0 vistas</span>
                              </div>
                            </div>
                            <button
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                              onClick={() => handleContentClick(item)}
                            >
                              Ver ahora
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Results Counter */}
          {!loading && filteredContent.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <p className="text-slate-400">
                Mostrando <span className="text-red-500 font-semibold">{filteredContent.length}</span> resultados
              </p>
            </motion.div>
          )}
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

export default Content;
