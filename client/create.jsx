import React from 'react';

export default function create(Component, props) {
  return <Component {...props} />;
} 