import React from 'react';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'blue' }) => {
  // Define size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  // Define color classes
  const colorClasses = {
    blue: 'border-t-blue-500',
    green: 'border-t-green-500',
    red: 'border-t-red-500',
    yellow: 'border-t-yellow-500',
    gray: 'border-t-gray-500',
  };

  return (
    <div
      role="status"
      className={`border-4 border-solid border-transparent rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      style={{ borderTopColor: 'currentColor' }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
