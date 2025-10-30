import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../utils/AuthContext';
import { useNotification } from '../../utils/NotificationContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ContentUpload = ({ onUploadComplete, maxSize = 500 * 1024 * 1024 }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const { token } = useAuth();
  const { showSuccess, showError } = useNotification();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('contentType', getContentType(file.type));
      formData.append('description', '');

      // Simular progreso de subida
      setUploadProgress({ [file.name]: 0 });

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress({ [file.name]: percentComplete });
        }
      };

      // Handle successful upload
      xhr.onload = () => {
        if (xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          showSuccess('Contenido subido exitosamente');
          onUploadComplete?.(response);
          setUploadProgress({});
        } else {
          showError('Error al subir el contenido');
        }
        setIsUploading(false);
      };

      // Handle error
      xhr.onerror = () => {
        showError('Error de conexión al subir el contenido');
        setIsUploading(false);
        setUploadProgress({});
      };

      // Send request
      xhr.open('POST', `${process.env.REACT_APP_API_URL}/content`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);

    } catch (error) {
      console.error('Error uploading file:', error);
      showError('Error inesperado al subir el contenido');
      setIsUploading(false);
    }
  }, [token, showSuccess, showError, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.webm', '.mov'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize,
    multiple: false,
    disabled: isUploading
  });

  const getContentType = (mimeType) => {
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('image/')) return 'image';
    return 'post';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path} className="text-red-400 text-sm">
      {file.path} - {errors.map(e => e.message).join(', ')}
    </li>
  ));

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-dark-300 hover:border-primary/50 hover:bg-primary/5'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-300 mb-2">Subiendo contenido...</p>
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="w-full max-w-xs">
                  <div className="bg-dark-200 rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">{progress.toFixed(1)}%</p>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="upload-prompt"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragActive ? '¡Suelta aquí!' : 'Subir Contenido'}
              </h3>

              <p className="text-gray-400 mb-4">
                {isDragActive
                  ? 'Suelta tu archivo aquí para subirlo'
                  : 'Arrastra y suelta tu video o imagen aquí, o haz clic para seleccionar'
                }
              </p>

              <div className="text-sm text-gray-500">
                <p>Soportamos: MP4, WebM, MOV (videos) • JPG, PNG, GIF, WebP (imágenes)</p>
                <p>Tamaño máximo: {formatFileSize(maxSize)}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File rejections */}
      {fileRejectionItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <h4 className="text-red-400 font-semibold mb-2">Errores:</h4>
          <ul className="list-disc list-inside space-y-1">
            {fileRejectionItems}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default ContentUpload;