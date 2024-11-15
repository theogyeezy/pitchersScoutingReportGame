import React from 'react';

export const Alert = ({ children, className = '' }) => (
  <div 
    role="alert" 
    className={`rounded-lg border p-4 bg-yellow-50 ${className}`}
  >
    {children}
  </div>
);

export const AlertDescription = ({ children, className = '' }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`}>
    {children}
  </div>
);