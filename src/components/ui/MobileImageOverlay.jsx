import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function MobileImageOverlay() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const handleOpen = (e) => {
      setImage(e.detail);
    };
    
    window.addEventListener('show-mobile-image-overlay', handleOpen);
    
    return () => {
      window.removeEventListener('show-mobile-image-overlay', handleOpen);
    };
  }, []);

  useEffect(() => {
    if (image) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [image]);

  if (!image) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-slate-950/90 z-[99999] flex flex-col items-center justify-center p-4 pointer-events-auto"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={(e) => {
        e.stopPropagation();
        setImage(null);
      }}
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setImage(null);
        }}
        className="absolute top-4 right-4 bg-white/20 active:bg-white/45 hover:bg-white/30 text-white rounded-full p-2.5 z-[100000] cursor-pointer flex items-center justify-center transition-transform active:scale-95 border border-white/10"
        aria-label="Close image overlay"
      >
        <X className="size-6" />
      </button>
      
      <div 
        className="max-w-full max-h-[calc(100vh-120px)] flex flex-col items-center justify-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={image.src} 
          alt={`Swatch ${image.id}`} 
          className="max-w-full max-h-[calc(100vh-160px)] object-contain rounded-md shadow-2xl border border-white/10 select-none"
          referrerPolicy="no-referrer"
        />
        <div className="mt-4 text-white/90 font-mono text-xs font-semibold bg-black/60 px-3 py-1 rounded-full border border-white/10 select-all whitespace-nowrap">
          {image.id}
        </div>
      </div>
    </div>,
    document.body
  );
}
