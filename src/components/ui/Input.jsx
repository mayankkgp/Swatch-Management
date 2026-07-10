/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function Input({ className = '', id, ...props }) {
  return (
    <input
      id={id}
      className={`w-full text-base md:text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-md md:rounded-sm border border-slate-200 focus:outline-hidden focus:border-slate-400 transition-all font-sans py-1 px-1 md:py-0 md:px-2 md:h-6 ${className}`}
      {...props}
    />
  );
}
