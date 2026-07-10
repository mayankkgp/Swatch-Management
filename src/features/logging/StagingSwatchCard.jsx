/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function StagingSwatchCard({ swatch, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    let interval;
    if (isDeleting) {
      const duration = 2000;
      const step = 50;
      let elapsed = 0;
      
      interval = setInterval(() => {
        elapsed += step;
        setProgress((elapsed / duration) * 100);
      }, step);

      timer = setTimeout(() => {
        onDelete(swatch.id);
      }, duration);
    } else {
      setProgress(0);
    }
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isDeleting, onDelete, swatch.id]);

  const handleCancel = () => {
    setIsDeleting(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs flex flex-col sm:flex-row h-auto sm:h-24">
            {/* Desktop view - 3:4 portrait aspect ratio */}
      <div 
        className="hidden sm:flex h-full shrink-0 items-center justify-center relative overflow-hidden"
        style={{
          aspectRatio: (swatch.aspectRatio || '3:4').replace(':', '/'),
          background: !swatch.image || swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#') ? (swatch.image || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)') : undefined,
        }}
      >
        {swatch.image && !(swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#')) && (
          <img 
            src={swatch.image} 
            alt={`Swatch ${swatch.id}`} 
            className="w-full h-full object-cover select-none cursor-pointer sm:cursor-default"
            referrerPolicy="no-referrer"
            onClick={(e) => {
              if (window.innerWidth < 768) {
                e.stopPropagation();
                e.preventDefault();
                const event = new CustomEvent('show-mobile-image-overlay', {
                  detail: {
                    src: swatch.image,
                    id: swatch.id
                  }
                });
                window.dispatchEvent(event);
              }
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-start p-2 pointer-events-none">
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">{swatch.id}</span>
        </div>
      </div>

      {/* Mobile full width view */}
      <div 
        className="sm:hidden h-20 w-full shrink-0 flex items-center justify-center relative overflow-hidden"
        style={{
          background: !swatch.image || swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#') ? (swatch.image || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)') : undefined,
        }}
      >
        {swatch.image && !(swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#')) && (
          <img 
            src={swatch.image} 
            alt={`Swatch ${swatch.id}`} 
            className="w-full h-full object-cover select-none cursor-pointer"
            referrerPolicy="no-referrer"
            onClick={(e) => {
              if (window.innerWidth < 768) {
                e.stopPropagation();
                e.preventDefault();
                const event = new CustomEvent('show-mobile-image-overlay', {
                  detail: {
                    src: swatch.image,
                    id: swatch.id
                  }
                });
                window.dispatchEvent(event);
              }
            }}
          />
        )}
      </div>
      
      <div className="flex-1 p-2 flex flex-col justify-between min-w-0">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-800 truncate" title={swatch.vendorName || 'No Vendor'}>
            {swatch.vendorName || 'No Vendor'}
          </h4>
          <p className="text-[10px] font-mono text-slate-500 truncate" title={swatch.vendorSku || 'No SKU'}>
            {swatch.vendorSku || 'No SKU'}
          </p>
        </div>
        
        {isDeleting ? (
          <div className="h-6 mt-1 flex relative bg-slate-100 rounded overflow-hidden cursor-pointer shrink-0" onClick={handleCancel}>
            <div 
              className="absolute inset-y-0 left-0 bg-red-100 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center gap-1 text-red-600">
              <span className="text-[9px] font-bold uppercase tracking-wider">Cancel</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-end mt-1 shrink-0">
            <button
              onClick={() => setIsDeleting(true)}
              className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
              title="Delete Swatch"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
