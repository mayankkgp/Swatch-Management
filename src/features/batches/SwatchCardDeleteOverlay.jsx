/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trash } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function SwatchCardDeleteOverlay({
  isMobileOnly,
  isEditing,
  showDeleteConfirm,
  countdownProgress,
  triggerDelete,
  cancelDeleteCountdown,
  startDeleteCountdown
}) {
  if (isMobileOnly) {
    if (!isEditing) return null;
    return (
      <div className="order-last w-full px-3 pb-3 pt-2 bg-slate-50 border-t border-slate-100 md:hidden flex flex-col gap-2">
        {showDeleteConfirm ? (
          <div className="relative w-full h-12 flex items-center justify-between rounded-md overflow-hidden bg-red-50/50 border border-red-200 p-1">
            {/* Progress background */}
            <div 
              className="absolute inset-y-0 left-0 bg-red-200/40 transition-all duration-100 ease-linear" 
              style={{ width: `${countdownProgress}%` }} 
            />
            
            {/* Buttons overlaid on top of progress */}
            <div className="relative z-10 flex w-full justify-between items-center px-1">
              <Button
                type="button"
                onClick={triggerDelete}
                className="h-10 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-md cursor-pointer shrink-0"
              >
                Delete
              </Button>
              <Button
                type="button"
                onClick={cancelDeleteCountdown}
                className="h-10 px-4 bg-white hover:bg-slate-50 text-slate-600 font-bold text-sm rounded-md border border-slate-200 shadow-xs cursor-pointer shrink-0"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            onClick={startDeleteCountdown}
            className="w-full h-12 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-md flex items-center justify-center gap-1.5 border border-red-100 cursor-pointer"
          >
            <Trash className="size-4" />
            <span>Delete Swatch</span>
          </Button>
        )}
      </div>
    );
  }

  // Desktop Absolute Overlay
  if (!showDeleteConfirm) return null;

  return (
    <div className="absolute inset-0 bg-slate-950/95 text-white z-30 p-3 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-red-400">Confirm Deletion</p>
        <p className="text-xs text-slate-300 font-mono leading-tight">Swatch will be deleted permanently.</p>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-1">
        <div className="bg-red-500 h-full transition-all duration-100" style={{ width: `${countdownProgress}%` }} />
      </div>
      <div className="flex gap-1.5">
        <Button
          onClick={triggerDelete}
          className="flex-1 py-1 h-7 text-[10px] uppercase font-extrabold tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-sm"
        >
          Delete
        </Button>
        <Button
          onClick={cancelDeleteCountdown}
          className="flex-1 py-1 h-7 text-[10px] uppercase font-extrabold tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-sm"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
