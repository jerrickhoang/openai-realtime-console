import React from 'react';

// Default application context
export default React.createContext({
  // Add your context properties here
});

// Optional function to initialize context
export function createContext(initialData) {
  return {
    ...initialData
  };
} 