import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth, api } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import ContentUpload from '../../components/Content/ContentUpload';
import {
  Video,
  Image,
  Search,
  Eye,
  ThumbsUp,
  Plus,
  Edit,
  Trash2,
  Shield,
  ArrowRight,
  Calendar,
  User,
  Play,
  FileText
} from 'lucide-react';

const AdminContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await api.get(`/admin/content?${params}`);
      setContent(response.data.content || []);
      setTotalPages(response.data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error loading content:', error);
      setError('Error al cargar el contenido');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterType, filterStatus]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    loadContent();
  }, [user, navigate, loadContent]);

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

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'short':
        return <Play className="w-5 h-5" />;
      case 'post':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getContentTypeColor = (type) => {
    switch (type) {
      case 'video':
        return 'text-red-400 bg-red-500/10';
      case 'image':
        return 'text-green-400 bg-green-500/10';
      case 'short':
        return 'text-purple-400 bg-purple-500/10';
      case 'post':
        return 'text-blue-400 bg-blue-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateContent = async (contentData) => {
    try {
      await api.post('/admin/content', contentData);
      loadContent();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating content:', error);
      setError('Error al crear el contenido');
    }
  };

  const handleUpdateContent = async (contentId, updates) => {
    try {
      await api.put(`/admin/content/${contentId}`, updates);
      loadContent();
      setShowContentModal(false);
      setSelectedContent(null);
    } catch (error) {
      console.error('Error updating content:', error);
      setError('Error al actualizar el contenido');
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este contenido?')) return;

    try {
      await api.delete(`/admin/content/${contentId}`);
      loadContent();
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Error al eliminar el contenido');
    }
  };

  const openContentModal = (content) => {
    setSelectedContent(content);
    setShowContentModal(true);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
  };

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

      <div className="lg:ml-72 container mx-auto px-4 sm:px-6 lg:px-8 lg:pr-8 py-8 lg:py-12 relative z-10">
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
                  <Video className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                  <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    Gestión de Contenido
                  </span>
                </h1>
                <p className="text-slate-400 text-base sm:text-lg">
                  Administra todo el contenido de la plataforma
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Subir Contenido</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar contenido..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="w-full sm:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                >
                  <option value="all">Todos los tipos</option>
                  <option value="video">Videos</option>
                  <option value="image">Imágenes</option>
                  <option value="short">Shorts</option>
                  <option value="post">Posts</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="w-full sm:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                >
                  <option value="all">Todos los estados</option>
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Content Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 animate-pulse">
                  <div className="aspect-video bg-slate-800 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-800 rounded mb-2"></div>
                  <div className="h-3 bg-slate-800 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : content.length === 0 ? (
            <div className="text-center py-16">
              <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400 mb-2">No hay contenido</h3>
              <p className="text-slate-500">No se encontró contenido que coincida con los filtros aplicados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {content.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-slate-800 relative overflow-hidden">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getContentTypeIcon(item.content_type)}
                      </div>
                    )}

                    {/* Content Type Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getContentTypeColor(item.content_type)}`}>
                        {getContentTypeIcon(item.content_type)}
                        <span className="capitalize">{item.content_type}</span>
                      </div>
                    </div>

                    {/* Premium Badge */}
                    {item.is_premium && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
                          <span className="text-yellow-400 text-xs font-semibold">Premium</span>
                        </div>
                      </div>
                    )}

                    {/* Play Button for Videos */}
                    {item.content_type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-500/30">
                          <Play className="w-6 h-6 text-red-500 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-white font-bold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {item.description || 'Sin descripción'}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{item.view_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{item.like_count || 0}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">{formatDate(item.created_at)}</span>
                      </div>
                    </div>

                    {/* Creator */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-slate-400 text-sm">{item.username || 'Usuario'}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openContentModal(item)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteContent(item.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.is_published
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {item.is_published ? 'Publicado' : 'Borrador'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                <span className="px-4 py-2 text-slate-400">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-900/50 border border-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Content Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Contenido</h3>
            <ContentForm onSubmit={handleCreateContent} onCancel={() => setShowCreateModal(false)} />
          </motion.div>
        </div>
      )}

      {/* Edit Content Modal */}
      {showContentModal && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/95 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">Editar Contenido</h3>
            <ContentForm
              content={selectedContent}
              onSubmit={(updates) => handleUpdateContent(selectedContent.id, updates)}
              onCancel={() => {
                setShowContentModal(false);
                setSelectedContent(null);
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Content Form Component
const ContentForm = ({ content, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
  title: content?.title || '',
  description: content?.description || '',
  content_type: content?.content_type || 'video',
  is_premium: content?.is_premium || false,
  is_published: content?.is_published !== undefined ? content.is_published : true,
  tags: content?.tags ? (Array.isArray(content.tags) ? content.tags : JSON.parse(content.tags || '[]')) : []
});

const handleSubmit = (e) => {
  e.preventDefault();
  onSubmit({
    ...formData,
    tags: JSON.stringify(formData.tags)
  });
};

const addTag = (tag) => {
  if (tag && !formData.tags.includes(tag)) {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tag]
    }));
  }
};

const removeTag = (tagToRemove) => {
  setFormData(prev => ({
    ...prev,
    tags: prev.tags.filter(tag => tag !== tagToRemove)
  }));
};

return (
  <form onSubmit={handleSubmit} className="space-y-4">
   <div>
     <label className="block text-sm font-semibold text-slate-300 mb-2">Título</label>
     <input
       type="text"
       value={formData.title}
       onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
       className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
       required
     />
   </div>

   <div>
     <label className="block text-sm font-semibold text-slate-300 mb-2">Descripción</label>
     <textarea
       value={formData.description}
       onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
       rows={3}
       className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
     />
   </div>

   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
     <div>
       <label className="block text-sm font-semibold text-slate-300 mb-2">Tipo de Contenido</label>
       <select
         value={formData.content_type}
         onChange={(e) => setFormData(prev => ({ ...prev, content_type: e.target.value }))}
         className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
       >
         <option value="video">Video</option>
         <option value="image">Imagen</option>
         <option value="short">Short</option>
         <option value="post">Post</option>
       </select>
     </div>

     <div>
       <label className="block text-sm font-semibold text-slate-300 mb-2">Estado</label>
       <select
         value={formData.is_published ? 'published' : 'draft'}
         onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.value === 'published' }))}
         className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
       >
         <option value="published">Publicado</option>
         <option value="draft">Borrador</option>
       </select>
     </div>
   </div>

   <div>
     <label className="block text-sm font-semibold text-slate-300 mb-2">Adjuntar Archivo</label>
     <ContentUpload />
   </div>

   <div>
     <label className="block text-sm font-semibold text-slate-300 mb-2">Tags</label>
     <div className="flex flex-wrap gap-2 mb-2">
       {formData.tags.map((tag, index) => (
         <span
           key={index}
           className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
         >
           {tag}
           <button
             type="button"
             onClick={() => removeTag(tag)}
             className="hover:text-red-300"
           >
             ×
           </button>
         </span>
       ))}
     </div>
     <input
       type="text"
       placeholder="Agregar tag y presionar Enter"
       onKeyPress={(e) => {
         if (e.key === 'Enter') {
           e.preventDefault();
           addTag(e.target.value.trim());
           e.target.value = '';
         }
       }}
       className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/50 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
     />
   </div>

   <div className="flex items-center gap-3">
     <label className="flex items-center gap-2 cursor-pointer">
       <input
         type="checkbox"
         checked={formData.is_premium}
         onChange={(e) => setFormData(prev => ({ ...prev, is_premium: e.target.checked }))}
         className="rounded border-slate-600 text-red-500 focus:ring-red-500"
       />
       <span className="text-sm font-semibold text-slate-300">Contenido Premium</span>
     </label>
   </div>

   <div className="flex gap-3 mt-6">
     <button
       type="submit"
       className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-300"
     >
       {content ? 'Actualizar' : 'Crear'} Contenido
     </button>
     <button
       type="button"
       onClick={onCancel}
       className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white transition-colors"
     >
       Cancelar
     </button>
   </div>
 </form>
);
};

export default AdminContent;
