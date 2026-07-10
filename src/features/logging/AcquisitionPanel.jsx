/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import { INITIAL_SWATCHES } from '../../data/seedData';

export default function AcquisitionPanel({ onActiveImageSet, onImagesQueued }) {
  const fileInputRef = useRef(null);
  const desktopFileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target?.result;
        if (typeof dataUrl === 'string') {
          onActiveImageSet(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDesktopImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const mockImages = INITIAL_SWATCHES.slice(0, 5).map(swatch => ({
        image: swatch.image,
        aspectRatio: swatch.aspectRatio || '3:4'
      }));
      if (onImagesQueued) {
        onImagesQueued(mockImages);
      }
    }
    if (desktopFileInputRef.current) {
      desktopFileInputRef.current.value = '';
    }
  };

  const handleMobileLoadMockImages = () => {
    const mockImages = INITIAL_SWATCHES.slice(0, 5).map(swatch => ({
      image: swatch.image,
      aspectRatio: '3:4'
    }));
    if (onImagesQueued) {
      onImagesQueued(mockImages);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 border-b border-slate-200 md:border-b-0 relative overflow-hidden min-h-[30vh] order-1 md:order-2">
      <div className="flex flex-col gap-9 md:gap-3 w-full max-w-xs px-4">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <input 
          type="file" 
          accept="image/*" 
          multiple
          className="hidden" 
          ref={desktopFileInputRef}
          onChange={handleDesktopImageUpload}
        />
        <Button 
          onClick={handleMobileLoadMockImages}
          className="w-full h-12 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs flex items-center justify-center gap-2 rounded-lg font-bold text-sm tracking-wide md:hidden"
        >
          <Camera className="size-5" />
          <span>Open Camera</span>
        </Button>
        <Button 
          onClick={handleMobileLoadMockImages}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent shadow-xs flex items-center justify-center gap-2 rounded-lg font-bold text-sm tracking-wide md:hidden"
        >
          <ImageIcon className="size-5" />
          <span>Gallery Import</span>
        </Button>
        
        <Button 
          onClick={() => desktopFileInputRef.current?.click()}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent shadow-xs items-center justify-center gap-2 rounded-lg font-bold text-sm tracking-wide hidden md:flex"
        >
          <Camera className="size-5" />
          <span>Upload Images</span>
        </Button>
      </div>
    </div>
  );
}
