/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Camera, Image, X, CheckSquare, Square, ExternalLink, Edit, Trash, ZoomIn } from 'lucide-react';
import { getSwatchAspectRatio, getSwatchFallbackBackground, isRealImageSource } from './swatchCardUtils';

export default function SwatchCardImageSection({
  swatch,
  isEditing,
  showImageSourcePicker,
  setShowImageSourcePicker,
  imageSourcePickerRef,
  handleImagePicked,
  isBulkEditMode,
  isSelected,
  onToggleSelect,
  isAllSwatchesView,
  batchId,
  changeEditingState,
  onEdit,
  startDeleteCountdown
}) {
  return (
    <div 
      className={`md:w-full shrink-0 relative flex items-center justify-center border-slate-100 overflow-hidden ${
        isEditing 
          ? 'order-last w-full border-t border-b-0 border-r-0 border-slate-100' 
          : 'w-[180px] border-r md:border-r-0 border-b-0 md:border-b'
      }`}
      style={{ 
        aspectRatio: getSwatchAspectRatio(swatch.aspectRatio, isEditing),
        background: getSwatchFallbackBackground(swatch)
      }}
    >
      {swatch.image && isRealImageSource(swatch.image) && (
        <button 
          type="button"
          disabled={isEditing}
          className={`js-swatch-image-btn absolute inset-0 w-full h-full outline-none p-0 bg-transparent border-none m-0 block group/imgbtn ${
            !isEditing && !isBulkEditMode 
              ? 'cursor-pointer active:scale-[0.98] active:opacity-90 md:active:scale-100 md:active:opacity-100 transition-all duration-200' 
              : ''
          }`}
          onClick={(e) => {
            if (window.innerWidth < 768 && !isEditing && !isBulkEditMode) {
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
        >
          <img 
            src={swatch.image} 
            alt={`Swatch ${swatch.id}`} 
            className={`w-full h-full block ${isEditing ? 'object-contain bg-slate-50' : 'object-cover'}`}
            referrerPolicy="no-referrer"
          />
          {!isEditing && !isBulkEditMode && (
            <div className="absolute inset-0 bg-black/0 md:hidden flex items-center justify-center transition-colors">
              <div className="bg-slate-900/40 backdrop-blur-sm p-2 rounded-full border border-white/20 shadow-lg opacity-80 active:opacity-100 active:scale-95 transition-all">
                <ZoomIn className="size-5 text-white drop-shadow-md" />
              </div>
            </div>
          )}
        </button>
      )}

      {/* Mobile edit image CTA */}
      {isEditing && (
        <div className={`absolute inset-0 md:hidden z-10 ${showImageSourcePicker ? 'bg-slate-950/30' : ''}`}>
          {!showImageSourcePicker ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowImageSourcePicker(true);
              }}
              className="absolute top-3 right-3 h-10 w-10 bg-white/95 rounded-full flex items-center justify-center text-slate-700 shadow-lg hover:bg-white active:scale-95 transition-all cursor-pointer border border-slate-200"
              title="Edit Swatch Image"
            >
              <Camera className="size-5" />
            </button>
          ) : (
            <div 
              ref={imageSourcePickerRef}
              className="absolute top-3 left-1/2 -translate-x-1/2 bg-white p-3.5 rounded-lg shadow-xl w-[200px] flex flex-col gap-3 relative border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageSourcePicker(false);
                }}
                className="absolute -top-1.5 -right-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full h-5 w-5 flex items-center justify-center border border-slate-200 cursor-pointer"
              >
                <X className="size-3" />
              </button>
              
              <label className="h-11 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 cursor-pointer">
                <Camera className="size-4" />
                <span>Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImagePicked}
                  className="hidden"
                />
              </label>

              <label className="h-11 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200">
                <Image className="size-4" />
                <span>Gallery</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagePicked}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      )}
      {/* Checkbox overlay for Bulk Edit Mode */}
      {isBulkEditMode && (
        <button 
          type="button"
          onClick={onToggleSelect}
          className="absolute top-2 left-2 z-10 bg-white/90 rounded p-1 shadow-sm text-slate-800 hover:text-indigo-600 transition-colors"
        >
          {isSelected ? (
            <CheckSquare className="size-4 text-indigo-600 fill-indigo-50" />
          ) : (
            <Square className="size-4 text-slate-400" />
          )}
        </button>
      )}

      {/* Floating Action Triggers (Edit / Delete) */}
      {!isBulkEditMode && (
        <div className="absolute top-2 right-2 z-10 hidden md:flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          {isAllSwatchesView && batchId && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const url = `${window.location.origin}${window.location.pathname}?batchId=${batchId}`;
                window.open(url, '_blank');
              }}
              className="p-1.5 bg-white/70 hover:bg-indigo-600 text-slate-500 hover:text-white border border-slate-200/40 rounded-full transition-all shadow-xs hover:shadow-sm"
              title="Open batch"
            >
              <ExternalLink className="size-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 768) {
                changeEditingState(true);
              } else if (onEdit) {
                onEdit(swatch);
              } else {
                changeEditingState(true);
              }
            }}
            className="h-8 w-8 md:h-6 md:w-6 bg-white/90 md:bg-white/70 hover:bg-indigo-600 text-slate-600 md:text-slate-500 hover:text-white border border-slate-200/40 rounded-full transition-all shadow-xs hover:shadow-sm flex items-center justify-center cursor-pointer"
            title="Edit Swatch"
          >
            <Edit className="size-4 md:size-3.5" />
          </button>
          <button
            type="button"
            onClick={startDeleteCountdown}
            className="h-8 w-8 md:h-6 md:w-6 bg-white/90 md:bg-white/70 hover:bg-red-600 text-slate-600 md:text-slate-500 hover:text-white border border-slate-200/40 rounded-full transition-all shadow-xs hover:shadow-sm flex items-center justify-center cursor-pointer"
            title="Delete Swatch"
          >
            <Trash className="size-4 md:size-3.5" />
          </button>
        </div>
      )}

      <span className={`absolute px-1.5 py-0.5 bg-black/55 text-[12px] md:text-[9px] font-mono font-bold tracking-wider text-white rounded-sm select-all ${
        isEditing 
          ? 'top-2 left-2 md:bottom-2 md:left-2 md:top-auto' 
          : 'top-2 right-2 md:bottom-2 md:left-2 md:top-auto md:right-auto'
      }`}>
        {swatch.id}
      </span>
    </div>
  );
}
