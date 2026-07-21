/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Save, Layers, ArrowRight, Trash2, ClipboardList, RotateCw } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function ExecutionBar({ 
  stagedCount, 
  queueCount = 0,

  onReviewClick, 
  onSaveNextClick,
  isSaveDisabled,
  isSaving,
  onClearImage,
  hasActiveImage,
  onRotate
}) {
  return (
    <div className="flex-none h-12 md:h-auto bg-white md:bg-slate-50/50 border-t border-slate-200 px-4 md:px-4 py-1.5 md:pt-2 md:pb-1 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none z-20 sticky bottom-0 md:text-xs md:text-slate-500 md:font-medium md:select-none">
      
      <div className="flex items-center gap-3">
        <Button 
          type="button"
          onClick={onReviewClick}
          className="flex items-center justify-center gap-1.5 h-9 w-14 md:h-6 md:w-auto px-1 md:px-2.5 rounded-md md:rounded-sm border border-slate-200 hover:bg-slate-50 bg-white transition-colors text-slate-700 font-extrabold uppercase tracking-wider text-sm cursor-pointer md:normal-case md:tracking-normal md:font-semibold md:text-xs md:gap-1 md:shadow-xs md:py-0"
        >
          <ClipboardList className="size-5 md:hidden text-slate-600" />
          <Layers className="hidden md:block size-3" />
          <span className="hidden md:inline">Review</span>
          <div className="bg-slate-900 text-white text-[10px] md:text-[9px] rounded-full min-w-5 h-5 md:min-w-4 md:h-4 px-1 flex items-center justify-center font-mono md:font-sans md:font-semibold shadow-xs">
            {stagedCount}
          </div>
        </Button>
        {queueCount > 0 && (
          <>
            <span className="hidden md:inline-block text-xs font-medium text-slate-500">
              {queueCount} in queue
            </span>
            <span className="md:hidden text-xs font-bold text-slate-500 font-mono">
              {queueCount} left
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-5 md:gap-6">
        <Button
          onClick={onClearImage}
          disabled={!hasActiveImage || isSaving}
          className="flex h-9 w-9 px-0 md:h-6 md:w-auto md:px-2.5 bg-white hover:bg-slate-50 disabled:opacity-50 text-red-500 hover:text-red-600 font-semibold text-sm md:text-xs tracking-normal rounded-md md:rounded-sm shadow-xs border border-slate-200 transition-all items-center justify-center gap-1 cursor-pointer"
        >
          <Trash2 className="size-5 md:hidden" />
          <span className="hidden md:inline">Delete Image</span>
        </Button>
        <Button
          onClick={onRotate}
          disabled={!hasActiveImage || isSaving}
          className="flex md:hidden h-9 w-9 px-0 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 hover:text-slate-800 font-semibold text-sm md:text-xs tracking-normal rounded-md md:rounded-sm shadow-xs border border-slate-200 transition-all items-center justify-center gap-1 cursor-pointer"
        >
          <RotateCw className="size-5" />
          <span className="hidden md:inline">Rotate</span>
        </Button>
        <Button
          onClick={onSaveNextClick}
          disabled={isSaveDisabled || isSaving}
          className="h-9 w-9 px-0 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold uppercase tracking-wider text-sm rounded-md shadow-sm transition-all flex items-center justify-center gap-2 md:normal-case md:h-6 md:w-auto md:px-2.5 md:rounded-sm md:bg-slate-950 md:hover:bg-slate-800 md:font-semibold md:tracking-normal md:gap-1 md:shadow-xs md:border md:border-transparent md:py-0 cursor-pointer"
        >
          {isSaving ? (
            <>
              <span className="size-4 md:size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="hidden md:inline">Processing...</span>
            </>
          ) : (
            <>
              <ArrowRight className="size-5 md:hidden" />
              <Save className="hidden md:block size-3" />
              <span className="hidden md:inline">Save & Next</span>
            </>
          )}
        </Button>
      </div>
      
    </div>
  );
}
