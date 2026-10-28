import React from 'react';

export default function GununganIcon({ className = "w-12 h-16", alt = "Logo Jawa" }) {
  return (
    <img
      src="/assets/logojawa2.png"
      alt={alt}
      className={`inline-block object-contain filter drop-shadow-md ${className}`}
    />
  );
}
