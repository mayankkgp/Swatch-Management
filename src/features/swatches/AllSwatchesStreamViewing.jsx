/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function AllSwatchesStreamViewing({
  viewingSwatch,
  setViewingSwatchId
}) {
  if (!viewingSwatch) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-100 relative overflow-hidden">
      {/* Floating Close/Back Button to easily return to grid */}
      <button
        id="close-single-swatch-view-btn"
        onClick={() => setViewingSwatchId(null)}
        className="absolute top-4 right-4 z-10 bg-white/95 hover:bg-white text-slate-700 font-bold text-xs md:text-[10px] uppercase tracking-wider px-4 md:px-3 h-11 md:h-7 rounded-md border border-slate-200 shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
      >
        <X className="size-5 md:size-3.5" />
        <span>Back to Grid</span>
      </button>

      {/* The Image Wrapper in its original aspect ratio */}
      <div 
        className="max-w-full max-h-[calc(100vh-180px)] rounded-lg shadow-xl overflow-hidden border border-slate-200/50 flex items-center justify-center transition-all bg-white"
        style={{
          aspectRatio: viewingSwatch.aspectRatio ? viewingSwatch.aspectRatio.replace(':', '/') : '3/4',
          background: !viewingSwatch.image || viewingSwatch.image.startsWith('linear-gradient') || viewingSwatch.image.startsWith('radial-gradient') || viewingSwatch.image.startsWith('#') ? (viewingSwatch.image || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)') : undefined,
          width: '100%',
          maxWidth: '520px'
        }}
      >
        {viewingSwatch.image && !(viewingSwatch.image.startsWith('linear-gradient') || viewingSwatch.image.startsWith('radial-gradient') || viewingSwatch.image.startsWith('#')) && (
          <button 
            type="button"
            className="w-full h-full outline-none flex items-center justify-center bg-transparent border-none p-0 m-0 cursor-pointer active:scale-[0.98] active:opacity-90 md:active:scale-100 md:active:opacity-100 transition-all duration-200 group/imgbtn relative"
            onClick={(e) => {
              if (window.innerWidth < 768) {
                e.stopPropagation();
                e.preventDefault();
                const event = new CustomEvent('show-mobile-image-overlay', {
                  detail: {
                    src: viewingSwatch.image,
                    id: viewingSwatch.id
                  }
                });
                window.dispatchEvent(event);
              }
            }}
          >
            <img 
              src={viewingSwatch.image} 
              alt={`Swatch ${viewingSwatch.id}`} 
              className="w-full h-full object-contain max-h-full max-w-full select-none block"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/0 md:hidden flex items-center justify-center transition-colors">
              <div className="bg-slate-900/40 backdrop-blur-sm p-2 rounded-full border border-white/20 shadow-lg opacity-80 active:opacity-100 active:scale-95 transition-all">
                <ZoomIn className="size-5 text-white drop-shadow-md" />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Displaying Swatch ID at the bottom of the image container */}
      <div className="mt-4 text-center">
        <span className="font-mono text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs">
          {viewingSwatch.id}
        </span>
      </div>
    </div>
  );
}
