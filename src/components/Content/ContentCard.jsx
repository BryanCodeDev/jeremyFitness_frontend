import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';

const ContentCard = ({
  content,
  onClick,
  showCreator = true,
  className = ''
}) => {
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTypeIcon = () => {
    switch (content.content_type) {
      case 'video':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        );
      case 'image':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2zm4 5a2 2 0 100 4 2 2 0 000-4zm4 8a4 4 0 100-8 4 4 0 000 8z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`card overflow-hidden group cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-dark-200 overflow-hidden">
        {content.thumbnail_url ? (
          <>
            <img
              src={content.thumbnail_url}
              alt={content.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="loading-shimmer w-full h-full" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            {getTypeIcon()}
          </div>
        )}

        {/* Premium Badge */}
        {content.is_premium && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 rounded text-xs font-semibold">
            Premium
          </div>
        )}

        {/* Duration Badge */}
        {content.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center">
            {getTypeIcon()}
            <span className="ml-1">{formatDuration(content.duration)}</span>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center text-white transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-white group-hover:text-primary transition-colors line-clamp-2">
            {content.title}
          </h3>
        </div>

        {content.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {content.description}
          </p>
        )}

        {/* Creator Info */}
        {showCreator && content.username && (
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
              {content.username[0].toUpperCase()}
            </div>
            <span className="text-gray-400 text-sm">
              {content.username}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              {content.view_count || 0}
            </span>
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
              {content.like_count || 0}
            </span>
          </div>
          <span>{formatDate(content.created_at)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;