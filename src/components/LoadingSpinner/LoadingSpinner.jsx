import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinner = (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          border-2 border-transparent border-t-current border-r-current
          rounded-full animate-spin
          ${color === 'primary' ? 'text-primary' : 'text-white'}
        `}
        style={{
          background: `conic-gradient(from 0deg, transparent, currentColor)`,
          WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black calc(100% - 2px))'
        }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-dark-100 p-8 rounded-lg shadow-orange-lg">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Variantes específicas
export const LoadingDots = ({ className = '' }) => (
  <div className={`flex space-x-1 ${className}`}>
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

export const LoadingPulse = ({ className = '' }) => (
  <div className={`flex space-x-1 ${className}`}>
    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
  </div>
);

export default LoadingSpinner;