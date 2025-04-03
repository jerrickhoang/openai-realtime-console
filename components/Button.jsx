import React from 'react';

export default function Button({ children, onClick, disabled, primary }) {
  const className = primary 
    ? "bg-black text-white hover:bg-gray-800 px-4 py-2 rounded" 
    : "bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded";
    
  return (
    <button 
      className={className} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  );
} 