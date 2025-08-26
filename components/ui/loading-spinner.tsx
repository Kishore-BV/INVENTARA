import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-4',
};

export default function LoadingSpinner({ 
  className = '', 
  size = 'md' 
}: LoadingSpinnerProps) {
  return (
    <div 
      className={`
        inline-block 
        ${sizeClasses[size]} 
        border-t-transparent 
        border-blue-500 
        rounded-full 
        animate-spin 
        ${className}
      `}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
