import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  placeholder = 'blur',
  blurDataURL,
  priority = false,
  sizes,
  style,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef();

  useEffect(() => {
    // Crear URL optimizada para la imagen
    if (src) {
      const optimizedSrc = createOptimizedImageUrl(src, { width, height, quality });
      setImageSrc(optimizedSrc);
    }
  }, [src, width, height, quality]);

  const createOptimizedImageUrl = (baseUrl, options) => {
    // Si es una URL externa, devolverla tal cual
    if (baseUrl.startsWith('http') || baseUrl.startsWith('//')) {
      return baseUrl;
    }

    // Para imágenes locales, podrías implementar lógica de optimización aquí
    // Por ahora, devolver la URL original
    return baseUrl;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={`bg-dark-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
        {...props}
      >
        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder/Loading state */}
      {!isLoaded && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          className="absolute inset-0 bg-dark-200 flex items-center justify-center"
          style={{ width, height }}
        >
          {placeholder === 'blur' && blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
            />
          ) : (
            <div className="loading-shimmer w-full h-full" />
          )}
        </motion.div>
      )}

      {/* Main image */}
      {imageSrc && (
        <motion.img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            width,
            height,
            transition: 'opacity 0.3s ease'
          }}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      )}
    </div>
  );
};

// Hook personalizado para imágenes responsivas
export const useResponsiveImage = (src, breakpoints = [640, 768, 1024, 1280]) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    const updateSrc = () => {
      const width = window.innerWidth;
      const appropriateBreakpoint = breakpoints.find(bp => width < bp) || breakpoints[breakpoints.length - 1];
      // Aquí podrías implementar lógica para seleccionar diferentes versiones de la imagen
      setCurrentSrc(src);
    };

    updateSrc();
    window.addEventListener('resize', updateSrc);
    return () => window.removeEventListener('resize', updateSrc);
  }, [src, breakpoints]);

  return currentSrc;
};

export default OptimizedImage;
