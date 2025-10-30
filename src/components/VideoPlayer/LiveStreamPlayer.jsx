import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, MessageCircle, Users, Heart, Share2 } from 'lucide-react';
import LiveChat from '../LiveChat/LiveChat';

const LiveStreamPlayer = ({ stream, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [viewerCount, setViewerCount] = useState(stream.participants || 0);
  const [showChat, setShowChat] = useState(false);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const playerElement = videoRef.current?.parentElement;
    if (playerElement) {
      playerElement.addEventListener('mousemove', handleMouseMove);
      return () => playerElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    const playerElement = videoRef.current?.parentElement;
    if (playerElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerElement.requestFullscreen();
      }
    }
  };

  // Actualizar contador de espectadores en tiempo real
  useEffect(() => {
    const updateViewerCount = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/api/live/${stream.id}/viewer`, {
          action: 'join'
        });
        setViewerCount(response.data.viewerCount);
      } catch (error) {
        console.error('Error actualizando contador de espectadores:', error);
      }
    };

    updateViewerCount();

    // Actualizar contador periódicamente
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/live/active`);
        const currentStream = response.data.streams.find(s => s.id === stream.id);
        if (currentStream) {
          setViewerCount(currentStream.viewer_count);
        }
      } catch (error) {
        console.error('Error obteniendo contador actualizado:', error);
      }
    }, 10000);

    // Decrementar contador al salir
    const handleBeforeUnload = () => {
      axios.post(`http://localhost:5000/api/live/${stream.id}/viewer`, {
        action: 'leave'
      }).catch(error => console.error('Error al salir:', error));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Decrementar contador al desmontar componente
      axios.post(`http://localhost:5000/api/live/${stream.id}/viewer`, {
        action: 'leave'
      }).catch(error => console.error('Error al salir:', error));
    };
  }, [stream.id]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="text-white hover:text-orange-400 transition-colors"
          >
            ✕
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white font-semibold">EN VIVO</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-white">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{viewerCount}</span>
          </div>
          <button className="hover:text-orange-400 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="hover:text-orange-400 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 relative group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted={isMuted}
          playsInline
          src={stream.stream_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} // Placeholder
        />

        {/* Stream Info Overlay */}
        <div className="absolute bottom-20 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
          <h1 className="text-white text-xl font-bold mb-2">{stream.title}</h1>
          <p className="text-gray-300 text-sm mb-2">{stream.description}</p>
          <div className="flex items-center space-x-2">
            <span className="text-orange-400 font-semibold">{stream.instructor}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{stream.category}</span>
          </div>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-orange-400 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-orange-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowChat(!showChat)}
                className={`transition-colors ${showChat ? 'text-orange-400' : 'text-white hover:text-orange-400'}`}
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-orange-400 transition-colors"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chat Sidebar */}
      <LiveChat
        streamId={stream.id}
        isVisible={showChat}
        onToggle={() => setShowChat(!showChat)}
      />
    </div>
  );
};

export default LiveStreamPlayer;