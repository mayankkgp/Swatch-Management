import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { getSwatchAspectRatio, getSwatchFallbackBackground, isRealImageSource } from '../batches/swatchCardUtils';

export default function EnquirySwatchCard({
  item,
  index,
  topInputRef,
  deleteConfirmId,
  setDeleteConfirmId,
  dropdownOpenId,
  setDropdownOpenId,
  longPressActiveId,
  deleteProgress,
  handleTouchStart,
  handleTouchEnd,
  handleDeleteItem,
  handleQtyChange,
}) {
  const isDeleteConfirm = deleteConfirmId === item.instanceId;
  const isDropdownOpen = dropdownOpenId === item.instanceId;
  const isLongPressing = longPressActiveId === item.instanceId;

  return (
    <motion.div
      key={item.instanceId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
      transition={{ duration: 0.15 }}
      onTouchStart={() => handleTouchStart(item.instanceId)}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseDown={() => handleTouchStart(item.instanceId)}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      className={`group relative bg-white rounded-lg overflow-hidden transition-all duration-200 flex flex-row items-start cursor-default border ${
        isLongPressing || isDropdownOpen
          ? 'border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
          : isDeleteConfirm
          ? 'border-rose-300 ring-2 ring-rose-500/20'
          : 'border-slate-200 hover:border-slate-300 shadow-2xs'
      } select-none`}
    >
      {/* Left side: Swatch Card Image Section */}
      <div 
        className="w-[180px] shrink-0 relative flex items-center justify-center border-r border-slate-100 overflow-hidden"
        style={{ 
          aspectRatio: getSwatchAspectRatio(item.aspectRatio, false),
          background: getSwatchFallbackBackground(item)
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const event = new CustomEvent('show-mobile-image-overlay', {
              detail: {
                src: item.image,
                id: item.id || item.skuId || item.vendorSku || 'SWATCH'
              }
            });
            window.dispatchEvent(event);
          }}
          className="w-full h-full block relative outline-none p-0 bg-transparent border-none cursor-pointer"
          title="Click to view full image"
        >
          {item.image && isRealImageSource(item.image) ? (
            <img
              src={item.image}
              alt={`Swatch ${item.id || item.instanceId}`}
              className="w-full h-full block object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ background: item.image }}
            />
          )}
        </button>
      </div>

      {/* Right side: Swatch Card Display Section */}
      <div className="px-3 pt-2 pb-4 flex-1 flex flex-col justify-between gap-2 self-stretch min-w-0 text-left">
        <div className="flex flex-col justify-between h-full w-full">
          <div className="flex flex-col justify-between h-full w-full min-w-0 text-left">
            <div className="space-y-1.5 text-slate-700 font-mono text-[12px] leading-snug min-w-0 w-full">
              {/* Row 1: SKU ID and Static Quantity */}
              <div className="break-words w-full flex flex-wrap items-center gap-x-1">
                <span className="text-slate-800 font-bold">{item.id || item.skuId || item.vendorSku || '-'}</span>
                <span className="text-slate-300 font-sans font-normal shrink-0 mx-1">•</span>
                <span className="text-slate-500 font-normal">
                  {item.quantity ? `${item.quantity}${item.unit || 'm'}` : '100m'}
                </span>
              </div>

              {/* Row 2: Structure */}
              <div className="text-slate-500 break-words w-full">
                {item.structure || '-'}
              </div>

              {/* Row 3: Material Content */}
              <div className="text-slate-500 break-words w-full">
                {item.content || '-'}
              </div>
            </div>

            {/* ENQ input CTA */}
            <div className="mt-auto pt-3 mb-1 flex items-center gap-2 w-full">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase shrink-0">
                ENQ
              </span>
              <div className="flex-1 h-8 bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white text-slate-700 font-semibold text-xs border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-indigo-500/10 rounded-md flex items-center justify-between px-2.5 transition-all">
                <input
                  ref={index === 0 ? topInputRef : null}
                  type="tel"
                  inputMode="numeric"
                  value={item.qty}
                  onChange={(e) => handleQtyChange(item.instanceId, e.target.value)}
                  placeholder="Qty"
                  className="flex-1 min-w-0 h-full p-0 bg-transparent border-none focus:outline-none focus:ring-0 font-mono text-base font-bold text-slate-900 placeholder:text-[11px] placeholder:text-slate-300 leading-normal"
                />
                <span className="text-[11px] font-mono text-slate-500 font-semibold shrink-0 ml-1 leading-normal flex items-center">
                  {item.unit || 'm'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Long-Press Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop to dismiss menu when clicking outside */}
            <div 
              className="fixed inset-0 z-20 bg-slate-950/20 backdrop-blur-[1px]" 
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpenId(null);
              }}
            />
            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -6 }}
              transition={{ duration: 0.12 }}
              className="absolute right-3 top-3 z-30 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 min-w-[130px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpenId(null);
                  setDeleteConfirmId(item.instanceId);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Trash2 className="size-4 text-rose-600 shrink-0" />
                <span>Delete</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {isDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-slate-950/95 text-white p-3.5 flex flex-col justify-between rounded-lg"
          >
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                Confirm Deletion
              </p>
              <p className="text-xs text-slate-300 font-mono leading-tight">
                Swatch will be removed from enquiry.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-1">
              <div
                className="bg-red-500 h-full transition-all duration-100 ease-linear"
                style={{ width: `${deleteProgress}%` }}
              />
            </div>

            <div className="flex items-center gap-2 mt-auto pt-1">
              <Button
                type="button"
                onClick={() => handleDeleteItem(item.instanceId)}
                className="flex-1 h-8 py-1 text-[10px] uppercase font-extrabold tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer flex items-center justify-center"
              >
                Delete
              </Button>
              <Button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 h-8 py-1 text-[10px] uppercase font-extrabold tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors cursor-pointer flex items-center justify-center"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
