// Utilidades para optimización de imágenes y contenido visual

// Función para crear URLs de imágenes responsivas
export const createResponsiveImageUrl = (baseUrl, options = {}) => {
  const {
    width,
    height,
    quality = 80,
    format = 'auto'
  } = options;

  // Si es una URL externa, devolverla tal cual
  if (baseUrl.startsWith('http') || baseUrl.startsWith('//')) {
    return baseUrl;
  }

  // Para desarrollo local, podrías implementar lógica de optimización aquí
  // En producción, esto se manejaría en el servidor o con un servicio como Cloudinary
  return baseUrl;
};

// Función para generar múltiples tamaños de imagen
export const createImageSrcSet = (baseUrl, sizes = [480, 768, 1024, 1280, 1920]) => {
  return sizes
    .map(size => `${createResponsiveImageUrl(baseUrl, { width: size })} ${size}w`)
    .join(', ');
};

// Función para pre-cargar imágenes críticas
export const preloadCriticalImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Hook para manejar el estado de carga de imágenes
export const useImageLoad = (src) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;

    setIsLoaded(false);
    setHasError(false);

    const img = new Image();

    img.onload = () => {
      setIsLoaded(true);
    };

    img.onerror = () => {
      setHasError(true);
    };

    img.src = src;
  }, [src]);

  return { isLoaded, hasError };
};

// Función para optimizar videos
export const optimizeVideo = (videoElement, options = {}) => {
  const {
    autoplay = false,
    muted = false,
    loop = false,
    preload = 'metadata'
  } = options;

  if (videoElement) {
    videoElement.autoplay = autoplay;
    videoElement.muted = muted;
    videoElement.loop = loop;
    videoElement.preload = preload;

    // Desactivar controles si es autoplay
    if (autoplay) {
      videoElement.controls = false;
    }
  }
};

// Función para lazy loading de videos
export const setupVideoLazyLoading = () => {
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;

          if (video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
          }

          videoObserver.unobserve(video);
        }
      });
    }, {
      rootMargin: '50px'
    });

    // Observar todos los videos con data-src
    document.querySelectorAll('video[data-src]').forEach(video => {
      videoObserver.observe(video);
    });
  }
};

// Función para generar miniaturas de video
export const generateVideoThumbnail = (videoFile, timestamp = 1) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = timestamp;
    };

    video.onseeked = () => {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };

    video.onerror = reject;

    video.src = URL.createObjectURL(videoFile);
  });
};

// Función para calcular el tamaño óptimo de imagen basado en el contenedor
export const calculateOptimalImageSize = (containerElement) => {
  if (!containerElement) return { width: 800, height: 450 };

  const rect = containerElement.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  return {
    width: Math.ceil(rect.width * dpr),
    height: Math.ceil(rect.height * dpr)
  };
};

// Función para detectar si el navegador soporta WebP
export const supportsWebP = () => {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Función para convertir imágenes a formato moderno
export const convertToModernFormat = async (imageFile) => {
  const supportsWebPFormat = await supportsWebP();

  if (supportsWebPFormat) {
    // Convertir a WebP si es soportado
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(resolve, 'image/webp', 0.8);
      };

      img.src = URL.createObjectURL(imageFile);
    });
  }

  return imageFile;
};

// Función para optimizar el rendimiento de animaciones
export const optimizeAnimations = () => {
  // Reducir motion para usuarios que lo prefieran
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }

  // Detectar si el navegador puede manejar animaciones complejas
  const canHandleComplexAnimations = 'requestAnimationFrame' in window;

  return {
    canHandleComplexAnimations,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };
};

// Función para limpiar recursos de medios
export const cleanupMediaResources = () => {
  // Pausar videos fuera de vista
  document.querySelectorAll('video').forEach(video => {
    if (!isElementInViewport(video)) {
      video.pause();
    }
  });

  // Limpiar object URLs
  document.querySelectorAll('img[src^="blob:"]').forEach(img => {
    URL.revokeObjectURL(img.src);
  });
};

// Función auxiliar para verificar si elemento está en viewport
const isElementInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Configuración inicial de optimizaciones
export const initializeOptimizations = () => {
  // Setup video lazy loading
  setupVideoLazyLoading();

  // Optimizar animaciones
  optimizeAnimations();

  // Cleanup en navegación
  window.addEventListener('beforeunload', cleanupMediaResources);

  // Cleanup en cambio de ruta (para SPA)
  if (window.history.pushState) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setTimeout(cleanupMediaResources, 100);
    };
  }
};

export default {
  createResponsiveImageUrl,
  createImageSrcSet,
  preloadCriticalImages,
  useImageLoad,
  optimizeVideo,
  setupVideoLazyLoading,
  generateVideoThumbnail,
  calculateOptimalImageSize,
  supportsWebP,
  convertToModernFormat,
  optimizeAnimations,
  cleanupMediaResources,
  initializeOptimizations
};