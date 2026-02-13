import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  SkipBack, SkipForward, Settings, RotateCcw, RotateCw,
  Video, PictureInPicture2, Theater, X, Check
} from 'lucide-react';

const VideoPlayer = ({
  url,
  thumbnail,
  title,
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  className = '',
  qualityOptions = ['1080p', '720p', '480p', '360p'] // Opciones de calidad
}) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  
  // Estados principales
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [showControls, setShowControls] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  
  // Estados de audio
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [previousVolume, setPreviousVolume] = useState(1);
  
  // Estados de progreso
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  
  // Estados de carga
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Estados de configuración
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  
  // Estados de pantalla
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  
  // Control de visibilidad de controles
  const controlsTimeoutRef = useRef(null);
  const hideControlsTimerRef = useRef(null);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, []);

  // Formatear tiempo
  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Formatear duración larga
  const formatDuration = useCallback((seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00:00';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Control de play/pause
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    resetHideControlsTimer();
  }, []);

  // Cambiar volumen
  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    resetHideControlsTimer();
  }, []);

  // Silenciar/Activar sonido
  const handleMuteToggle = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume || 1);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
    resetHideControlsTimer();
  }, [isMuted, volume, previousVolume]);

  // Buscar en el video
  const handleSeek = useCallback((e) => {
    const rect = progressRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (clientX === undefined) return;
    
    const x = clientX - rect.left;
    const width = rect.width;
    const newPlayed = Math.max(0, Math.min(1, x / width));
    
    setPlayed(newPlayed);
    if (playerRef.current) {
      playerRef.current.seekTo(newPlayed);
    }
  }, []);

  // Iniciar búsqueda
  const handleSeekStart = useCallback((e) => {
    setIsSeeking(true);
    handleSeek(e);
  }, [handleSeek]);

  // Finalizar búsqueda
  const handleSeekEnd = useCallback(() => {
    setIsSeeking(false);
  }, []);

  // Saltar tiempo
  const handleSkip = useCallback((seconds) => {
    if (!playerRef.current) return;
    const currentTime = played * duration;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    const newPlayed = newTime / duration;
    setPlayed(newPlayed);
    playerRef.current.seekTo(newPlayed);
    resetHideControlsTimer();
  }, [played, duration]);

  // Retroceder 10 segundos
  const handleRewind = useCallback(() => handleSkip(-10), [handleSkip]);
  
  // Adelantar 10 segundos
  const handleForward = useCallback(() => handleSkip(10), [handleSkip]);

  // Pantalla completa
  const handleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.error('Error en pantalla completa:', err);
    }
  }, []);

  // Picture in Picture
  const handlePip = useCallback(async () => {
    if (!playerRef.current) return;
    
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPip(false);
      } else {
        const videoElement = containerRef.current?.querySelector('video');
        if (videoElement) {
          await videoElement.requestPictureInPicture();
          setIsPip(true);
        }
      }
    } catch (err) {
      console.error('Error en PiP:', err);
    }
  }, []);

  // Mode Theater
  const handleTheater = useCallback(() => {
    setIsTheater(prev => !prev);
  }, []);

  // Reiniciar video
  const handleRestart = useCallback(() => {
    setPlayed(0);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  }, []);

  // Cambiar velocidad de reproducción
  const handlePlaybackRateChange = useCallback((rate) => {
    setPlaybackRate(rate);
    setShowSettings(false);
    setShowQualityMenu(false);
    resetHideControlsTimer();
  }, []);

  // Cambiar calidad
  const handleQualityChange = useCallback((quality) => {
    setSelectedQuality(quality);
    setShowQualityMenu(false);
    resetHideControlsTimer();
  }, []);

  // Resetear timer de ocultar controles
  const resetHideControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Manejar movimiento del mouse
  const handleMouseMove = useCallback(() => {
    setIsHovering(true);
    resetHideControlsTimer();
  }, [resetHideControlsTimer]);

  // Manejar mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (isPlaying) {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 1500);
    }
  }, [isPlaying]);

  // Manejar teclado
  const handleKeyDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        handlePlayPause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleSkip(-5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleSkip(5);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setVolume(prev => Math.min(1, prev + 0.1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setVolume(prev => Math.max(0, prev - 0.1));
        break;
      case 'm':
      case 'M':
        e.preventDefault();
        handleMuteToggle();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        handleFullscreen();
        break;
      case 't':
      case 'T':
        e.preventDefault();
        handleTheater();
        break;
      case 'i':
      case 'I':
        e.preventDefault();
        handlePip();
        break;
      case '0':
      case 'Home':
        e.preventDefault();
        handleRestart();
        break;
      default:
        break;
    }
  }, [handlePlayPause, handleSkip, handleMuteToggle, handleFullscreen, handleTheater, handlePip, handleRestart]);

  // Detectar cambio de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Calcular tiempo restante
  const remainingTime = duration - (played * duration);

  return (
    <motion.div
      ref={containerRef}
      className={`video-player-container relative bg-black rounded-xl overflow-hidden group ${isTheater ? 'theater-mode' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget || e.target.classList.contains('video-element')) {
          handlePlayPause();
        }
      }}
      tabIndex={0}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Indicador de carga */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black z-20"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
              <span className="text-white/60 text-sm">Cargando video...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de error */}
      <AnimatePresence>
        {hasError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black z-20"
          >
            <div className="flex flex-col items-center gap-4 text-center px-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <Video className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Error al cargar el video</p>
                <p className="text-white/60 text-sm">Por favor verifica tu conexión e intenta nuevamente</p>
              </div>
              <button 
                onClick={handleRestart}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Reintentar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player de React */}
      <div className="video-element w-full h-full bg-black">
        <ReactPlayer
          ref={playerRef}
          url={url}
          light={thumbnail}
          playing={autoplay || isPlaying}
          controls={false}
          muted={isMuted}
          loop={loop}
          volume={volume}
          playbackRate={playbackRate}
          width="100%"
          height="100%"
          className="react-player"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onProgress={({ played, buffered }) => {
            if (!isSeeking) {
              setPlayed(played);
              if (buffered && buffered.length > 0) {
                setBuffered(buffered[buffered.length - 1]);
              }
            }
          }}
          onDuration={setDuration}
          onReady={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onBuffer={() => setIsLoading(true)}
          onBufferEnd={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          progressInterval={100}
        />
      </div>

      {/* Overlay de play grande cuando está pausado */}
      <AnimatePresence>
        {!isPlaying && !isLoading && !hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 backdrop-blur-sm">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controles - Barra inferior */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-16 pb-4 px-4"
          >
            {/* Barra de progreso */}
            <div 
              ref={progressRef}
              className="relative mb-4 group/progress cursor-pointer"
              onMouseDown={handleSeekStart}
              onMouseMove={(e) => isSeeking && handleSeek(e)}
              onMouseUp={handleSeekEnd}
              onMouseLeave={handleSeekEnd}
              onTouchStart={handleSeekStart}
              onTouchMove={(e) => isSeeking && handleSeek(e)}
              onTouchEnd={handleSeekEnd}
            >
              {/* Fondo de la barra */}
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                {/* Buffer */}
                <div 
                  className="h-full bg-white/30 transition-all duration-100"
                  style={{ width: `${buffered * 100}%` }}
                />
                {/* Progreso */}
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full relative"
                  style={{ width: `${played * 100}%` }}
                >
                  {/* Thumb */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 group-hover/progress:w-4 h-4 bg-red-500 rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-all duration-200" />
                </div>
              </div>
              
              {/* Tooltip de tiempo al hover */}
              {isSeeking && (
                <div className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none transform -translate-x-1/2">
                  {formatTime(played * duration)}
                </div>
              )}
            </div>

            {/* Controles principales */}
            <div className="flex items-center justify-between gap-4">
              {/* Lado izquierdo - Reproducción */}
              <div className="flex items-center gap-2">
                {/* Reiniciar */}
                <button
                  onClick={handleRestart}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Retroceder */}
                <button
                  onClick={handleRewind}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="Retroceder 10s"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="p-2 text-white hover:text-red-400 hover:bg-white/10 rounded-lg transition-all"
                  title={isPlaying ? 'Pausar' : 'Reproducir'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                {/* Adelantar */}
                <button
                  onClick={handleForward}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title="Adelantar 10s"
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Volumen */}
                <div className="flex items-center gap-1 group/volume">
                  <button
                    onClick={handleMuteToggle}
                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title={isMuted ? 'Activar sonido' : 'Silenciar'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  
                  {/* Slider de volumen */}
                  <div className="w-0 group-hover/volume:w-24 overflow-hidden transition-all duration-200">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 accent-red-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Tiempo */}
                <div className="text-white/90 text-sm font-mono ml-2">
                  <span className="text-white">{formatTime(played * duration)}</span>
                  <span className="text-white/50 mx-1">/</span>
                  <span className="text-white/70">{formatDuration(duration)}</span>
                </div>
              </div>

              {/* Lado derecho - Configuración */}
              <div className="flex items-center gap-1">
                {/* Configuración */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSettings(!showSettings);
                      setShowQualityMenu(false);
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      showSettings ? 'text-red-500 bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    title="Configuración"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  {/* Menú de configuración */}
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute bottom-full right-0 mb-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-48"
                      >
                        {/* Velocidad */}
                        <div className="p-2 border-b border-white/10">
                          <div className="text-xs text-white/50 px-3 py-1 uppercase tracking-wider">Velocidad</div>
                          <div className="grid grid-cols-3 gap-1">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => handlePlaybackRateChange(rate)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  playbackRate === rate 
                                    ? 'bg-red-500 text-white' 
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Calidad */}
                        <div className="p-2">
                          <div className="text-xs text-white/50 px-3 py-1 uppercase tracking-wider">Calidad</div>
                          <div className="space-y-1">
                            {qualityOptions.map((quality) => (
                              <button
                                key={quality}
                                onClick={() => handleQualityChange(quality)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                                  selectedQuality === quality
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                <span>{quality}</span>
                                {selectedQuality === quality && <Check className="w-4 h-4" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Picture in Picture */}
                <button
                  onClick={handlePip}
                  className={`p-2 rounded-lg transition-all ${
                    isPip ? 'text-red-500 bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="Imagen en imagen"
                >
                  <PictureInPicture2 className="w-5 h-5" />
                </button>

                {/* Theater mode */}
                <button
                  onClick={handleTheater}
                  className={`p-2 rounded-lg transition-all hidden md:flex ${
                    isTheater ? 'text-red-500 bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="Modo teatro"
                >
                  <Theater className="w-5 h-5" />
                </button>

                {/* Pantalla completa */}
                <button
                  onClick={handleFullscreen}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Título del video */}
      {title && showControls && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 pointer-events-none">
          <motion.h3 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-bold text-lg drop-shadow-lg"
          >
            {title}
          </motion.h3>
        </div>
      )}

      {/* Atajos de teclado */}
      <div className="absolute bottom-20 left-4 text-white/30 text-xs pointer-events-none hidden">
        <span className="bg-black/50 px-2 py-1 rounded">Espacio</span> Play/Pause
        <span className="bg-black/50 px-2 py-1 rounded ml-2">←→</span> Buscar
        <span className="bg-black/50 px-2 py-1 rounded ml-2">↑↓</span> Volumen
        <span className="bg-black/50 px-2 py-1 rounded ml-2">F</span> Pantalla completa
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
