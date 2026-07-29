import React, { useState, useEffect } from 'react';
import { Ban, CheckCircle2, Loader2 } from 'lucide-react';
import {
  getSwatchAspectRatio,
  getSwatchFallbackBackground,
  isRealImageSource
} from '../batches/swatchCardUtils';

export default function EnquirySwatchCard({
  swatch,
  isActiveEnquiry = false,
  isRejected = false,
  isCurrentlyViewing = false,
  actionPhase = null,
  onReject,
  onAccept,
  onView,
  cardRef
}) {
  const isRejectedState = isRejected;

  // Action states for simulated latency & animations
  const isActionTarget = Boolean(actionPhase);
  const isLoading = isActionTarget && actionPhase === 'latency';
  const isExiting = isActionTarget && actionPhase === 'exit';
  const isReentering = isActionTarget && actionPhase === 'reenter';

  const [flashOpacity, setFlashOpacity] = useState(false);

  useEffect(() => {
    if (isReentering) {
      setFlashOpacity(false);
      const raf = requestAnimationFrame(() => {
        setFlashOpacity(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isReentering]);

  let opacityClass = '';
  if (isLoading) {
    opacityClass = 'opacity-60 pointer-events-none cursor-not-allowed';
  } else if (isExiting) {
    opacityClass = 'opacity-0 transition-none duration-0 pointer-events-none';
  } else if (isReentering) {
    opacityClass = `${flashOpacity ? 'opacity-100' : 'opacity-0'} transition-opacity duration-50 ease-out`;
  }

  // Enquired quantity formatting
  const enquiredQty =
    swatch.enquiredQuantity ||
    `${(parseInt(String(swatch.id).replace(/\D/g, ''), 10) % 5) + 2} m`;

  return (
    <div
      ref={cardRef}
      className={`group relative bg-white rounded-lg overflow-hidden flex flex-row md:flex-col items-start md:items-stretch border ${
        isCurrentlyViewing
          ? isRejectedState
            ? 'border-2 border-rose-600 ring-2 ring-rose-600/30 shadow-md bg-rose-50/10'
            : 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-md bg-indigo-50/5'
          : isRejectedState
            ? 'border-2 border-rose-600 bg-slate-50/80 shadow-2xs'
            : 'border-slate-200 hover:border-slate-300 shadow-2xs'
      } ${
        isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${opacityClass || 'transition-all duration-200'}`}
      onClick={(e) => {
        if (isLoading || isExiting) return;
        const closestBtn = e.target.closest('button');
        if (closestBtn && !closestBtn.classList.contains('js-swatch-image-btn')) {
          return;
        }
        if (onView) onView();
      }}
    >
      {/* IMAGE SECTION */}
      <div
        className="md:w-full shrink-0 relative flex items-center justify-center border-slate-100 overflow-hidden w-[180px] border-r md:border-r-0 border-b-0 md:border-b"
        style={{
          aspectRatio: getSwatchAspectRatio(swatch.aspectRatio, false),
          background: getSwatchFallbackBackground(swatch)
        }}
      >
        {swatch.image && isRealImageSource(swatch.image) && (
          <button
            type="button"
            className="js-swatch-image-btn absolute inset-0 w-full h-full outline-none p-0 bg-transparent border-none m-0 block cursor-pointer"
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
          >
            <img
              src={swatch.image}
              alt={`Swatch ${swatch.id}`}
              className="w-full h-full block object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        )}

        {/* REJECTED BADGE (Active Enquiries Only) */}
        {isRejectedState && (
          <span className="absolute top-2 left-2 z-10 text-[10px] md:text-[9px] font-mono font-bold uppercase tracking-wider text-white bg-rose-600 px-1.5 py-0.5 rounded-xs shadow-2xs pointer-events-none">
            Rejected
          </span>
        )}

        {/* HOVER CTAs (Active Enquiries Only) */}
        {isActiveEnquiry && (
          <div
            className={`absolute top-2 right-2 z-20 hidden md:flex gap-1.5 transition-opacity duration-150 ${
              isLoading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {isLoading ? (
              <button
                type="button"
                disabled
                className="h-6 w-6 bg-white/90 text-indigo-600 border border-slate-200/60 rounded-full shadow-xs flex items-center justify-center cursor-not-allowed"
              >
                <Loader2 className="size-3.5 animate-spin" />
              </button>
            ) : !isRejected ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.blur();
                  if (onReject) onReject(swatch.id);
                }}
                className="h-6 w-6 bg-white/90 hover:bg-rose-600 text-slate-600 hover:text-white border border-slate-200/60 rounded-full transition-all shadow-xs flex items-center justify-center cursor-pointer"
                title="Reject Swatch"
              >
                <Ban className="size-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.blur();
                  if (onAccept) onAccept(swatch.id);
                }}
                className="h-6 w-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all shadow-md flex items-center justify-center cursor-pointer"
                title="Accept Swatch"
              >
                <CheckCircle2 className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Swatch ID Badge */}
        <span className="absolute top-2 right-2 md:bottom-2 md:left-2 md:top-auto md:right-auto px-1.5 py-0.5 bg-black/55 text-[12px] md:text-[9px] font-mono font-bold tracking-wider text-white rounded-sm select-all pointer-events-none">
          {swatch.id}
        </span>
      </div>

      {/* DISPLAY SECTION */}
      <div className="px-3 pt-1.5 pb-2 flex-1 flex flex-col justify-between gap-2 self-stretch md:self-auto w-full">
        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col justify-between h-full w-full min-w-0 text-left">
          <div className="space-y-1.5 text-slate-700 font-mono text-[12px] leading-snug min-w-0 w-full">
            <div className="text-slate-900 font-bold break-words w-full">
              {swatch.vendorName}
            </div>
            <div className="text-slate-600 break-words w-full flex flex-wrap items-center gap-x-1">
              <span className="font-semibold text-slate-800">
                {swatch.quantity ? `${swatch.quantity}${swatch.unit}` : '-'}
              </span>
              <span className="text-slate-300 font-sans font-normal shrink-0 mx-1">•</span>
              <span>{swatch.vendorSku || '-'}</span>
            </div>
            <div className="text-slate-500 break-words w-full">
              {swatch.structure || '-'}
            </div>
            <div className="text-slate-500 break-words w-full">
              {swatch.content || '-'}
            </div>
            <div className="text-indigo-700 font-semibold break-words w-full pt-0.5">
              Enquired Qty: {enquiredQty}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col justify-between h-full gap-1.5">
          <div className="space-y-1 text-slate-700 font-mono text-[11px] min-w-0">
            {/* Row 1: Req Qty */}
            <div className="flex items-baseline text-indigo-700 leading-tight w-full min-w-0">
              <span className="shrink-0 font-medium text-[11px] mr-1">Req Qty:</span>
              <span className="truncate min-w-0 font-extrabold text-sm" title={enquiredQty}>
                {enquiredQty}
              </span>
            </div>

            {/* Row 2: Vendor Name and Stock Quantity */}
            <div className="flex items-center flex-nowrap gap-x-1.5 leading-tight w-full min-w-0">
              <span className="truncate min-w-0 text-slate-900 font-medium" title={swatch.vendorName}>
                {swatch.vendorName}
              </span>
              <span className="text-slate-300 font-sans font-normal shrink-0">•</span>
              <span className="shrink-0 text-slate-500 font-normal" title={swatch.quantity ? `${swatch.quantity}${swatch.unit}` : '-'}>
                {swatch.quantity ? `${swatch.quantity}${swatch.unit}` : '-'}
              </span>
            </div>

            {/* Row 3: Vendor SKU and Structure */}
            <div className="flex items-center flex-nowrap gap-x-1.5 text-slate-500 leading-tight w-full min-w-0">
              <span className="truncate min-w-0" title={swatch.vendorSku || '-'}>
                {swatch.vendorSku || '-'}
              </span>
              <span className="text-slate-300 font-sans font-normal shrink-0">•</span>
              <span className="truncate min-w-0" title={swatch.structure || '-'}>
                {swatch.structure || '-'}
              </span>
            </div>

            {/* Row 4: Material Content */}
            <div className="flex items-center flex-nowrap text-slate-500 leading-tight w-full min-w-0">
              <span className="truncate block w-full" title={swatch.content || '-'}>
                {swatch.content || '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
