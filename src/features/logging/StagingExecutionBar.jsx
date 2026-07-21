/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, Printer, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function StagingExecutionBar({
  isMobile,
  onClose,
  isEditingAnySwatchOnMobile,
  batchName,
  setBatchName,
  isSavingBatch,
  isDesktopActionDisabled,
  reviewSwatches,
  isSaveDisabled,
  isPrinting,
  setPendingAction,
  setShowMobileModal,
  onSaveBatch,
  handleSaveAndPrint
}) {
  if (isEditingAnySwatchOnMobile) {
    return null;
  }

  return (
    <div className="flex-none bg-white md:bg-slate-50/50 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none h-12 md:h-auto py-1.5 px-4 md:p-4 md:px-4 md:pt-2 md:pb-1 flex items-center justify-between md:items-end gap-3 md:gap-6 md:text-xs md:text-slate-500 md:font-medium md:select-none sticky bottom-0 z-20">
      <div className="flex md:hidden items-center">
        <Button
          onClick={onClose}
          className="h-9 w-9 px-0 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs uppercase rounded-md shadow-xs transition-all flex items-center justify-center border border-transparent cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="size-5" />
        </Button>
      </div>

      <div className="hidden md:block flex-1 w-full">
        <label className={`text-[10px] md:text-[9px] md:leading-none font-bold uppercase tracking-wider text-slate-400 block mb-1 md:mb-1 ${isDesktopActionDisabled ? 'md:text-slate-400' : 'md:text-black'}`}>
          Batch Name <span className="text-red-500">*</span>
        </label>
        <Input 
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          onFocus={(e) => {
            const target = e.target;
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }}
          placeholder="Enter a descriptive batch name..."
          className="w-full h-10 md:h-6 px-3 md:px-2 border-slate-300 text-sm md:text-xs md:leading-none font-medium md:font-normal focus:ring-indigo-100 focus:border-indigo-500 md:rounded-sm md:py-0 bg-white md:disabled:bg-slate-100 md:disabled:text-slate-400"
          disabled={isSavingBatch || isDesktopActionDisabled}
        />
      </div>
      
      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        <div className="flex md:hidden items-center mr-1">
          <span className="text-xs font-bold text-slate-500 font-mono">
            {reviewSwatches.length} Swatches
          </span>
        </div>

        <Button
          onClick={() => {
            if (isMobile) {
              setPendingAction('save');
              setShowMobileModal(true);
            } else {
              onSaveBatch(batchName);
            }
          }}
          disabled={isSaveDisabled || isDesktopActionDisabled}
          className="h-9 w-9 px-0 md:h-6 md:w-auto md:px-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold md:font-semibold text-xs md:text-xs uppercase md:normal-case tracking-wider md:tracking-normal rounded-md md:rounded-sm shadow-xs transition-all flex items-center justify-center gap-1.5 md:gap-1 md:py-0 border md:border-transparent cursor-pointer"
          title="Save Batch"
        >
          {isSavingBatch ? (
            <span className="size-5 md:size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check className="size-5 md:size-3" />
          )}
          <span className="hidden md:inline">Save Batch</span>
        </Button>
        
        <Button
          onClick={() => {
            if (isMobile) {
              setPendingAction('print');
              setShowMobileModal(true);
            } else {
              handleSaveAndPrint();
            }
          }}
          disabled={isSaveDisabled || isPrinting || isDesktopActionDisabled}
          className="h-9 w-9 px-0 md:h-6 md:w-auto md:px-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 disabled:text-indigo-400 text-white font-bold md:font-semibold text-xs md:text-xs uppercase md:normal-case tracking-wider md:tracking-normal rounded-md md:rounded-sm shadow-xs transition-all flex items-center justify-center gap-1.5 md:gap-1 md:py-0 border md:border-transparent cursor-pointer"
          title="Save & Print"
        >
          {isPrinting ? (
            <span className="size-5 md:size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Printer className="size-5 md:size-3" />
          )}
          <span className="hidden md:inline">Save & Print</span>
        </Button>
      </div>
    </div>
  );
}
