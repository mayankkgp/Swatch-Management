import React from 'react';
import INITIAL_SWATCHES_RAW from '../../data/mock-swatch.json';
import { getSwatchAspectRatio } from '../batches/swatchCardUtils';

export default function EnquirySkeletonCard() {
  return (
    <div
      key="swatch-skeleton-loading-card"
      className="group relative bg-white rounded-lg overflow-hidden border border-slate-200 shadow-2xs flex flex-row items-start select-none"
    >
      {/* Left side: Image Skeleton with exact aspect ratio match */}
      <div 
        className="w-[180px] shrink-0 relative flex items-center justify-center border-r border-slate-100 overflow-hidden bg-slate-100 animate-pulse"
        style={{ 
          aspectRatio: getSwatchAspectRatio(INITIAL_SWATCHES_RAW[0]?.aspectRatio, false)
        }}
      >
        <div className="size-8 rounded-full bg-slate-200/80 animate-pulse" />
      </div>

      {/* Right side: Information & Input Skeleton with exact layout & padding match */}
      <div className="px-3 pt-2 pb-4 flex-1 flex flex-col justify-between gap-2 self-stretch min-w-0 text-left">
        <div className="flex flex-col justify-between h-full w-full min-w-0 text-left">
          <div className="space-y-1.5 text-slate-700 font-mono text-[12px] leading-snug min-w-0 w-full">
            {/* Row 1: SKU & Qty Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-3.5 bg-slate-200 rounded w-20 animate-pulse" />
              <span className="text-slate-300 font-sans font-normal shrink-0 mx-1">•</span>
              <div className="h-3.5 bg-slate-200/70 rounded w-10 animate-pulse" />
            </div>

            {/* Row 2: Structure Skeleton */}
            <div className="h-3 bg-slate-100 rounded w-28 animate-pulse" />

            {/* Row 3: Material Content Skeleton */}
            <div className="h-3 bg-slate-100 rounded w-24 animate-pulse" />
          </div>

          {/* Row 4: ENQ Input Skeleton */}
          <div className="mt-auto pt-3 mb-1 flex items-center gap-2 w-full">
            <span className="text-[11px] font-mono font-bold text-slate-300 uppercase shrink-0">
              ENQ
            </span>
            <div className="flex-1 h-8 bg-slate-50 rounded-md border border-slate-200/80 animate-pulse flex items-center justify-between px-2.5">
              <div className="h-3 w-8 bg-slate-200/80 rounded" />
              <span className="text-[11px] font-mono text-slate-300 font-semibold shrink-0 ml-1">m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
