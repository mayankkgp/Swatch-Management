/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function Button({ 
  variant = 'none', 
  className = '', 
  children, 
  ...props 
}) {
  let baseStyle = 'inline-flex items-center justify-center font-semibold transition-all select-none cursor-pointer';
  
  const hasDisplayOverride = className.split(' ').some(cls => 
    cls === 'hidden' || 
    cls.includes('hidden') || 
    cls === 'flex' || 
    cls === 'block' || 
    cls === 'inline-block' || 
    cls === 'grid' ||
    cls.endsWith(':flex') ||
    cls.endsWith(':block') ||
    cls.endsWith(':inline-flex') ||
    cls.endsWith(':inline-block') ||
    cls.endsWith(':grid')
  );

  if (hasDisplayOverride) {
    baseStyle = baseStyle.replace('inline-flex', '');
  }
  
  const variants = {
    primary: 'md:h-6 text-sm md:text-xs py-1 px-1 md:py-0 md:px-2.5 rounded-md md:rounded-sm bg-slate-950 hover:bg-slate-800 text-white font-semibold shadow-xs',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs py-1 px-1 md:py-0',
    secondary: 'md:h-6 text-sm md:text-xs py-1 px-1 md:py-0 md:px-2.5 rounded-md md:rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60',
    outline: 'md:h-6 text-sm md:text-xs py-1 px-1 md:py-0 md:px-2.5 rounded-md md:rounded-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs',
    none: ''
  };

  const selectedVariant = variants[variant] || '';

  return (
    <button
      className={`${baseStyle} ${selectedVariant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
