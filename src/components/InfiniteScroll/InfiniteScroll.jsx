import React, { useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const InfiniteScroll = ({
  hasMore = true,
  isLoading = false,
  onLoadMore,
  threshold = 100,
  endMessage = 'No hay más contenido para mostrar',
  loader = <LoadingSpinner size="lg" className="py-8" />,
  children,
  className = ''
}) => {
  const loadingRef = useRef();

  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;

    if (entry.isIntersecting && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: `${threshold}px`,
      threshold: 0.1
    });

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [handleIntersection, threshold]);

  return (
    <div className={className}>
      {children}

      {/* Loading trigger element */}
      <div ref={loadingRef} className="w-full h-4" />

      {/* Loading indicator or end message */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          {loader}
        </motion.div>
      )}

      {!hasMore && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-400">
            {endMessage}
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Hook personalizado para infinite scroll
export const useInfiniteScroll = (callback, options = {}) => {
  const {
    threshold = 100,
    rootMargin = '100px',
    hasMore = true
  } = options;

  const targetRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore) {
            callback();
          }
        });
      },
      {
        rootMargin,
        threshold: 0.1
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [callback, threshold, rootMargin, hasMore]);

  return targetRef;
};

export default InfiniteScroll;
