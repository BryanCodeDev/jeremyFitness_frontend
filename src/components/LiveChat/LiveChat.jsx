import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, MessageCircle } from 'lucide-react';
import axios from 'axios';

const LiveChat = ({ streamId, isVisible, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);

  // Cargar mensajes iniciales desde la API
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/live/${streamId}/chat`);
        const formattedMessages = response.data.messages.map(msg => ({
          id: msg.id,
          username: msg.username || msg.display_name || 'Usuario',
          message: msg.message_text,
          timestamp: new Date(msg.created_at),
          type: msg.message_type
        }));
        setMessages(formattedMessages);
        setIsConnected(true);
      } catch (error) {
        console.error('Error cargando mensajes del chat:', error);
        setIsConnected(false);
      }
    };

    if (streamId) {
      loadMessages();
    }
  }, [streamId]);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling para actualizar mensajes en tiempo real
  useEffect(() => {
    if (isConnected && streamId) {
      pollingRef.current = setInterval(async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/live/${streamId}/chat?limit=10&offset=0`);
          const latestMessages = response.data.messages.map(msg => ({
            id: msg.id,
            username: msg.username || msg.display_name || 'Usuario',
            message: msg.message_text,
            timestamp: new Date(msg.created_at),
            type: msg.message_type
          }));

          // Solo actualizar si hay mensajes nuevos
          if (latestMessages.length > 0) {
            const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : 0;
            const newMessages = latestMessages.filter(msg => msg.id > lastMessageId);

            if (newMessages.length > 0) {
              setMessages(prev => [...prev, ...newMessages]);
            }
          }
        } catch (error) {
          console.error('Error actualizando mensajes:', error);
        }
      }, 3000); // Actualizar cada 3 segundos
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isConnected, streamId, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    const messageText = newMessage.trim();

    // Optimistic update - mostrar mensaje inmediatamente
    const optimisticMessage = {
      id: Date.now(),
      username: 'Tú', // En una implementación real, vendría del contexto de usuario
      message: messageText,
      timestamp: new Date(),
      type: 'text',
      isOptimistic: true
    };

    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');

    try {
      // Obtener token de autenticación (asumiendo que está en localStorage)
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `http://localhost:5000/api/live/${streamId}/chat`,
        {
          message: messageText,
          messageType: 'text'
        },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : undefined,
            'Content-Type': 'application/json'
          }
        }
      );

      // Reemplazar mensaje optimista con el real
      setMessages(prev =>
        prev.map(msg =>
          msg.isOptimistic ? {
            id: response.data.chatMessage.id,
            username: response.data.chatMessage.username || response.data.chatMessage.display_name || 'Tú',
            message: response.data.chatMessage.message_text,
            timestamp: new Date(response.data.chatMessage.created_at),
            type: response.data.chatMessage.message_type
          } : msg
        )
      );
    } catch (error) {
      console.error('Error enviando mensaje:', error);

      // Remover mensaje optimista en caso de error
      setMessages(prev => prev.filter(msg => !msg.isOptimistic));

      // Restaurar el mensaje en el input
      setNewMessage(messageText);

      // Mostrar error al usuario (podrías agregar un toast aquí)
      alert('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={onToggle}
          className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors relative"
        >
          <MessageCircle className="w-6 h-6" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {messages.filter(m => m.timestamp > new Date(Date.now() - 60000)).length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed bottom-4 right-4 w-80 h-96 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-40 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-white font-semibold">Chat en Vivo</h3>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.type === 'system' ? 'items-center' : ''}`}
            >
              {msg.type === 'system' ? (
                <div className="bg-slate-800 text-gray-400 text-xs px-3 py-1 rounded-full">
                  {msg.message}
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-orange-400 font-medium text-sm">{msg.username}</span>
                    <span className="text-gray-500 text-xs">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="bg-slate-800 text-white text-sm px-3 py-2 rounded-lg max-w-xs break-words">
                    {msg.message}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>{newMessage.length}/200</span>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{messages.filter(m => m.type !== 'system').length} mensajes</span>
            </div>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveChat;