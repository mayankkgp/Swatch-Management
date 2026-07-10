/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCw } from 'lucide-react';
import MobileSkuAndQuantity from './MobileSkuAndQuantity';
import AcquisitionPanel from './AcquisitionPanel';

export default function CaptureZone({ 
  activeImage, 
  setActiveImage, 
  rotation, 
  setRotation,
  onImagesQueued,
  aspectRatio = '3:4',
  viewerTheme = 'dark',
  formData,
  handleInputChange
}) {
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!activeImage) {
    return (
      <AcquisitionPanel
        onActiveImageSet={(dataUrl) => {
          setActiveImage(dataUrl);
          setRotation(0);
        }}
        onImagesQueued={onImagesQueued}
      />
    );
  }

  const isGradientOrHex = activeImage && (
    activeImage.startsWith('linear-gradient') || 
    activeImage.startsWith('radial-gradient') || 
    activeImage.startsWith('#')
  );

  return (
    <div className={`flex-1 flex items-center justify-center pt-2 pb-2.5 md:pt-0 md:pb-0 border-b border-slate-200 md:border-b-0 relative overflow-hidden min-h-[40vh] md:min-h-0 order-1 md:order-2 transition-colors duration-200 ${viewerTheme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
      {isGradientOrHex ? (
        <>
          <div className="md:hidden w-full h-full max-w-full px-2 flex flex-col items-center justify-center">
            <div className="flex-1 min-h-0 w-full flex items-center justify-center">
              <div 
                style={{ 
                  background: activeImage,
                  transform: `rotate(${rotation}deg)`,
                  aspectRatio: '3/4'
                }}
                className="h-full max-h-full max-w-full aspect-[3/4] transition-transform duration-300 rounded select-none"
              />
            </div>
            <MobileSkuAndQuantity 
              viewerTheme={viewerTheme}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>
          <div 
            className="hidden md:flex items-center justify-center h-[80%] max-h-full shrink-0 w-auto"
            style={{ 
              aspectRatio: (aspectRatio || '3:4').replace(':', '/')
            }}
          >
            <div 
              style={{ 
                background: activeImage,
                transform: `rotate(${rotation}deg)`
              }}
              className="w-full h-full transition-transform duration-300 rounded shadow-lg select-none"
            />
          </div>
        </>
      ) : (
        <>
          <div className="md:hidden w-full h-full max-w-full px-2 flex flex-col items-center justify-center">
            <div className="flex-1 min-h-0 w-full flex items-center justify-center">
              <img 
                src={activeImage}
                alt="Captured fabric asset"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  aspectRatio: '3/4'
                }}
                className="h-full max-h-full max-w-full object-contain transition-transform duration-300 rounded select-none"
                referrerPolicy="no-referrer"
              />
            </div>
            <MobileSkuAndQuantity 
              viewerTheme={viewerTheme}
              formData={formData}
              handleInputChange={handleInputChange}
            />
          </div>
          <div 
            className="hidden md:flex items-center justify-center h-[80%] max-h-full shrink-0 w-auto"
            style={{ 
              aspectRatio: (aspectRatio || '3:4').replace(':', '/')
            }}
          >
            <img 
              src={activeImage}
              alt="Captured fabric asset"
              style={{ 
                transform: `rotate(${rotation}deg)`
              }}
              className="w-full h-full object-cover transition-transform duration-300 rounded shadow-lg select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </>
      )}
      <button
        type="button"
        onClick={handleRotate}
        className={`hidden md:block absolute bottom-4 right-4 backdrop-blur-md p-2.5 rounded-full shadow-lg transition-colors cursor-pointer bg-white/10 hover:bg-white/20 text-white ${viewerTheme === 'light' ? 'md:bg-slate-900/10 md:hover:bg-slate-900/20 md:text-slate-700' : 'md:bg-white/10 md:hover:bg-white/20 md:text-white'}`}
        title="Rotate Image"
      >
        <RotateCw className="size-5" />
      </button>
    </div>
  );
}
