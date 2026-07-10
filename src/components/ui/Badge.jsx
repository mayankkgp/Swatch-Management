/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function Badge({ className = '', children, ...props }) {
  return (
    <span
      className={`inline-flex items-center justify-center font-mono font-bold ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
