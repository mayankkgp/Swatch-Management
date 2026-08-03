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
  handleInputChange,
  isNextLoading = false
}) {
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  if (isNextLoading) {
    if (isDesktop) {
      return (
        <div className={`flex-1 flex items-center justify-center pt-2 pb-2.5 md:pt-0 md:pb-0 border-b border-slate-200 md:border-b-0 relative overflow-hidden min-h-[40vh] md:min-h-0 order-1 md:order-2 transition-colors duration-200 ${viewerTheme === 'light' ? 'bg-slate-50' : 'bg-slate-900'}`}>
          <div 
            className={`hidden md:flex flex-col items-center justify-center h-[80%] max-h-full shrink-0 w-auto rounded-lg border transition-all duration-200 relative overflow-hidden p-8 ${
              viewerTheme === 'light' 
                ? 'border-slate-200 bg-white shadow-xs' 
                : 'border-slate-800 bg-slate-800/50 shadow-inner'
            }`}
            style={{ 
              aspectRatio: (aspectRatio || '3:4').replace(':', '/')
            }}
          >
            <div className="flex flex-col items-center justify-center gap-3.5 text-center">
              <div className="relative flex items-center justify-center">
                <div className="size-9 rounded-full border-2 border-indigo-500/20 border-t-indigo-600 animate-spin" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className={`text-[11px] font-mono font-bold tracking-widest uppercase ${viewerTheme === 'light' ? 'text-slate-700' : 'text-slate-200'}`}>
                  Loading Image...
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex-1 flex items-center justify-center pt-2 pb-2.5 border-b border-slate-200 relative overflow-hidden min-h-[40vh] order-1 transition-colors duration-200 ${viewerTheme === 'light' ? 'bg-white' : 'bg-slate-900'}`}>
        <div className="md:hidden w-full h-full max-w-full px-2 flex flex-col items-center justify-center">
          <div className="flex-1 min-h-0 w-full flex items-center justify-center py-2">
            <div 
              className={`h-full max-h-full aspect-[3/4] rounded-lg border transition-all duration-200 flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-xs ${
                viewerTheme === 'light' 
                  ? 'border-slate-200 bg-slate-50/80' 
                  : 'border-slate-800/80 bg-slate-800/50'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="size-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                </div>
                <span className={`text-[11px] font-mono font-bold tracking-wider uppercase ${viewerTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>
                  Loading Image...
                </span>
              </div>
            </div>
          </div>
          <MobileSkuAndQuantity 
            viewerTheme={viewerTheme}
            formData={formData}
            handleInputChange={handleInputChange}
            isNextLoading={true}
          />
        </div>
      </div>
    );
  }

  if (!activeImage) {
    return (
      <AcquisitionPanel
        onActiveImageSet={(dataUrl) => {
          if (onActiveImageSet) {
            onActiveImageSet(dataUrl);
          } else {
            setActiveImage(dataUrl);
            setRotation(0);
          }
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
