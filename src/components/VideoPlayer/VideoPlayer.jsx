import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from 'lucide-react';

const VideoPlayer = ({
  url,
  thumbnail,
  title,
  autoplay = false,
  controls = true,
  muted = false,
  loop = false,
  className = ''
}) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (e) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    playerRef.current.seekTo(newPlayed);
  };

  const handleSkip = (seconds) => {
    const currentTime = played * duration;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    playerRef.current.seekTo(newTime / duration);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case ' ':
        e.preventDefault();
        handlePlayPause();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleSkip(-10);
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleSkip(10);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.1));
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
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`video-container relative bg-black ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

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
        className="video-player"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onProgress={({ played }) => setPlayed(played)}
        onDuration={setDuration}
        onReady={() => setIsLoading(false)}
        onBuffer={() => setIsLoading(true)}
        onBufferEnd={() => setIsLoading(false)}
      />

      {/* Custom overlay para mejor UX */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button
            onClick={handlePlayPause}
            className="w-16 h-16 bg-orange-500/90 hover:bg-orange-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
          >
            <Play className="w-6 h-6 ml-1" />
          </button>
        </div>
      )}

      {/* Controles personalizados */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300">
          {/* Barra de progreso */}
          <div className="mb-4">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={played}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Controles principales */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-orange-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              {/* Skip buttons */}
              <button
                onClick={() => handleSkip(-10)}
                className="text-white hover:text-orange-400 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSkip(10)}
                className="text-white hover:text-orange-400 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              {/* Tiempo */}
              <span className="text-white text-sm">
                {formatTime(played * duration)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Volumen */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleMuteToggle}
                  className="text-white hover:text-orange-400 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Configuración */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:text-orange-400 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-32">
                    <div className="text-white text-sm mb-2">Velocidad</div>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setPlaybackRate(rate)}
                        className={`block w-full text-left px-2 py-1 text-sm rounded ${
                          playbackRate === rate ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Pantalla completa */}
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-orange-400 transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Información del video */}
      {title && (
        <div className="absolute top-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg drop-shadow-lg">
            {title}
          </h3>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;