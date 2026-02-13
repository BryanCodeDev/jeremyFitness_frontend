import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, Heart, Calendar, Image, Video, Crown, MoreVertical } from 'lucide-react';
import config from '../../config';

const ContentCard = ({
  content,
  onClick,
  showCreator = true,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Determinar tipo de contenido
  const isVideo = content.content_type === 'video';
  const isImage = content.content_type === 'image';

  // Construir URL de thumbnail
  const getThumbnailUrl = () => {
    if (!content.thumbnail_url) return null;
    if (content.thumbnail_url.startsWith('http')) return content.thumbnail_url;
    return `${config.API_BASE_URL.replace('/api', '')}${content.thumbnail_url}`;
  };

  const thumbnailUrl = getThumbnailUrl();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className={`relative bg-slate-900 rounded-2xl overflow-hidden group cursor-pointer border border-slate-800 hover:border-red-500/50 transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-slate-800 overflow-hidden">
        {thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              alt={content.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            {isVideo ? (
              <Video className="w-12 h-12 text-slate-600" />
            ) : isImage ? (
              <Image className="w-12 h-12 text-slate-600" />
            ) : (
              <div className="w-12 h-12 bg-slate-700 rounded-lg" />
            )}
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Premium Badge */}
        {content.is_premium && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
              <Crown className="w-3 h-3" />
              <span>Premium</span>
            </div>
          </div>
        )}

        {/* Duration Badge - Videos only */}
        {isVideo && content.duration && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1">
              <Play className="w-3 h-3" />
              {formatDuration(content.duration)}
            </div>
          </div>
        )}

        {/* Type indicator - Images */}
        {isImage && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
              <Image className="w-3 h-3" />
              Imagen
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-500/50 backdrop-blur-sm"
          >
            <Play className="w-7 h-7 ml-1" />
          </motion.div>
        </div>

        {/* Quick Stats on Hover */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
            <Eye className="w-3 h-3" />
            {formatNumber(content.view_count)}
          </div>
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs">
            <Heart className="w-3 h-3" />
            {formatNumber(content.like_count)}
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-white text-base leading-tight line-clamp-2 group-hover:text-red-400 transition-colors">
            {content.title}
          </h3>
        </div>

        {content.description && (
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
            {content.description}
          </p>
        )}

        {/* Creator Info */}
        {showCreator && content.username && (
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-xs font-bold mr-2">
              {content.username[0].toUpperCase()}
            </div>
            <span className="text-slate-400 text-sm font-medium">
              {content.username}
            </span>
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(content.view_count)}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {formatNumber(content.like_count)}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(content.created_at)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;
