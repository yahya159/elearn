import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-transparent`}
        style={{
          borderTopColor: 'transparent',
          borderRightColor: '#8B5CF6',
          borderBottomColor: '#EC4899',
          borderLeftColor: '#3B82F6'
        }}
      />
    </div>
  );
};

export default LoadingSpinner; 