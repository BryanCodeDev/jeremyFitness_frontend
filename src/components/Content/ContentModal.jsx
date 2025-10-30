import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { motion } from 'framer-motion';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { useAuth } from '../../utils/AuthContext';

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
  const { isAuthenticated } = useAuth();

  if (!content) return null;

  const handleLike = async () => {
    if (!isAuthenticated) {
      // Redirigir al login o mostrar mensaje
      return;
    }

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
    return new Intl.NumberFormat('es-ES').format(num || 0);
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-dark-100 rounded-xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          {/* Media */}
          <div className="flex-1 bg-black">
            {content.content_type === 'video' ? (
              <VideoPlayer
                url={content.file_url}
                title={content.title}
                className="h-96 lg:h-full"
              />
            ) : (
              <img
                src={content.file_url}
                alt={content.title}
                className="w-full h-96 lg:h-full object-cover"
              />
            )}
          </div>

          {/* Info Panel */}
          <div className="w-full lg:w-96 bg-dark-100 p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Title and basic info */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {content.title}
                </h2>

                {content.is_premium && (
                  <div className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    Contenido Premium
                  </div>
                )}

                <div className="flex items-center text-gray-400 text-sm space-x-4">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    {formatNumber(content.view_count)} vistas
                  </span>
                  <span>{formatDate(content.created_at)}</span>
                </div>
              </div>

              {/* Description */}
              {content.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Descripción
                  </h3>
                  <p className="text-gray-300">
                    {content.description}
                  </p>
                </div>
              )}

              {/* Creator info */}
              {content.username && (
                <div className="flex items-center space-x-3 p-3 bg-dark-200 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                    {content.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {content.username}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Creador de contenido
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-200">
                <button
                  onClick={handleLike}
                  disabled={isLiking || !isAuthenticated}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    userLiked
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-dark-200 text-gray-300 hover:bg-primary/20 hover:text-primary'
                  } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg className="w-5 h-5" fill={userLiked ? 'currentColor' : 'none'} stroke="currentColor'}" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{formatNumber(content.like_count)}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-dark-200 text-gray-300 hover:bg-primary/20 hover:text-primary rounded-lg transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  <span>Compartir</span>
                </button>
              </div>

              {/* Login prompt for non-authenticated users */}
              {!isAuthenticated && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-primary text-sm">
                    Inicia sesión para dar like y comentar en este contenido
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

export default ContentModal;