import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
        disabled 
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
          : 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-400'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
