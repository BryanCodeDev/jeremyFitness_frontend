import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentCard from './ContentCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ContentGallery = ({
  content: initialContent = [],
  loading = false,
  onLoadMore,
  hasMore = true,
  onContentClick,
  showCreator = true,
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
}) => {
  const [content, setContent] = useState(initialContent);
  const [filteredContent, setFilteredContent] = useState(initialContent);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    let filtered = content;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.content_type === filterType);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'most-viewed':
          return (b.view_count || 0) - (a.view_count || 0);
        case 'most-liked':
          return (b.like_count || 0) - (a.like_count || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    setFilteredContent(filtered);
  }, [content, searchTerm, filterType, sortBy]);

  const filterOptions = [
    { value: 'all', label: 'Todo' },
    { value: 'video', label: 'Videos' },
    { value: 'image', label: 'Imágenes' },
    { value: 'post', label: 'Posts' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Más recientes' },
    { value: 'oldest', label: 'Más antiguos' },
    { value: 'most-viewed', label: 'Más vistos' },
    { value: 'most-liked', label: 'Más gustados' },
    { value: 'title', label: 'Alfabético' }
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar contenido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full input-primary"
          />
        </div>

        {/* Filter by type */}
        <div className="flex gap-2">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilterType(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === option.value
                  ? 'bg-primary text-white'
                  : 'bg-dark-200 text-gray-300 hover:bg-primary/20'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input-primary"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="text-gray-400 text-sm">
        {loading ? 'Cargando...' : `${filteredContent.length} resultado${filteredContent.length !== 1 ? 's' : ''}`}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className={`grid ${gridCols} gap-6`}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="aspect-video bg-dark-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-dark-200 rounded mb-2"></div>
              <div className="h-3 bg-dark-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No se encontró contenido
          </h3>
          <p className="text-gray-400">
            {searchTerm || filterType !== 'all'
              ? 'Intenta ajustar tus filtros de búsqueda'
              : 'Aún no hay contenido disponible'
            }
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            className={`grid ${gridCols} gap-6`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {filteredContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ContentCard
                    content={item}
                    onClick={() => onContentClick?.(item)}
                    showCreator={showCreator}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Load More Button */}
          {hasMore && !loading && filteredContent.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <button
                onClick={onLoadMore}
                className="btn-secondary px-8 py-3"
              >
                Cargar Más Contenido
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default ContentGallery;