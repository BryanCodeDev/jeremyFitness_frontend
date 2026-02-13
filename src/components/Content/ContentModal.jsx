import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Heart, Share2, MessageCircle, Eye, 
  Calendar, User, Crown, Play, Download, Link as LinkIcon
} from 'lucide-react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { useAuth } from '../../utils/AuthContext';
import config from '../../config';

ReactModal.setAppElement('#root');

const ContentModal = ({
  isOpen,
  onClose,
  content,
  onLike,
  onUnlike,
  userLiked = false
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Cerrar con ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!content) return null;

  const handleLike = async () => {
    if (!isAuthenticated) return;
    
    setIsLiking(true);
    try {
      if (userLiked) {
        await onUnlike?.(content.id);
      } else {
        await onLike?.(content.id);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: content.title,
      text: content.description || `Mira este contenido: ${content.title}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareMenu(true);
        setTimeout(() => setShowShareMenu(false), 2000);
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Determinar la URL del thumbnail
  const thumbnailUrl = content.thumbnail_url 
    ? (content.thumbnail_url.startsWith('http') 
        ? content.thumbnail_url 
        : `${config.API_BASE_URL.replace('/api', '')}${content.thumbnail_url}`)
    : null;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-md"
      shouldCloseOnOverlayClick={true}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.4 }}
        className="relative w-full max-w-6xl max-h-[95vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-full max-h-[95vh]">
          {/* Media Section */}
          <div className="flex-1 bg-black relative flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
            {content.content_type === 'video' ? (
              <VideoPlayer
                url={content.file_url}
                thumbnail={thumbnailUrl}
                title={content.title}
                autoplay={true}
                className="w-full h-full"
                qualityOptions={['1080p', '720p', '480p', '360p']}
              />
            ) : content.content_type === 'image' ? (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img
                  src={content.file_url?.startsWith('http') ? content.file_url : `${config.API_BASE_URL.replace('/api', '')}${content.file_url}`}
                  alt={content.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                />
                {/* Download button for images */}
                <a
                  href={content.file_url?.startsWith('http') ? content.file_url : `${config.API_BASE_URL.replace('/api', '')}${content.file_url}`}
                  download={content.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-6 right-6 p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-sm hover:scale-110"
                  title="Descargar imagen"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-white p-8">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10" />
                </div>
                <p className="text-lg">Tipo de contenido no soportado</p>
              </div>
            )}

            {/* Premium Badge */}
            {content.is_premium && (
              <div className="absolute top-4 left-4 z-40">
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  <Crown className="w-4 h-4" />
                  <span>Premium</span>
                </div>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
                    {content.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatNumber(content.view_count)} vistas
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(content.created_at)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {content.description && (
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">
                      Descripción
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {content.description}
                    </p>
                  </div>
                )}

                {/* Creator info */}
                {content.username && (
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {content.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {content.username}
                      </p>
                      <p className="text-slate-400 text-sm flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Creador
                      </p>
                    </div>
                  </div>
                )}

                {/* Tags/Categories */}
                {content.category && (
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                      {content.category}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-3">
                {/* Like Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  disabled={isLiking || !isAuthenticated}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                    userLiked
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart className={`w-5 h-5 ${userLiked ? 'fill-current' : ''}`} />
                  <span>{formatNumber(content.like_count || 0)}</span>
                </motion.button>

                {/* Share Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl font-semibold transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Share notification */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm text-center"
                  >
                    ✓ Enlace copiado al portapapeles
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login prompt */}
              {!isAuthenticated && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm text-center">
                    Inicia sesión para interactuar con este contenido
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </ReactModal>
  );
};

// Helper component for file type
const FileText = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default ContentModal;
