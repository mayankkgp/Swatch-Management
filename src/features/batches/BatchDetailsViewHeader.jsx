/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Edit2, Check, Printer, CheckSquare, Square } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function BatchDetailsViewHeader({
  batch,
  resolvedSwatchesLength,
  isEditingName,
  setIsEditingName,
  newBatchName,
  setNewBatchName,
  isSavingName,
  handleEditNameSave,
  isEditingAnySwatchOnMobile,
  setShowMobileModal,
  viewingSwatchId,
  editingSwatchId,
  isBulkEditMode,
  setIsBulkEditMode,
  setSelectedSwatchIds,
  handlePrint,
  isPrinting,
  onClose,
  resolvedSwatches = [],
  selectedSwatchIds = []
}) {
  const isAllSelected = resolvedSwatches.length > 0 && selectedSwatchIds.length === resolvedSwatches.length;

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedSwatchIds([]);
    } else {
      setSelectedSwatchIds(resolvedSwatches.map(s => s.id));
    }
  };

  return (
    <div className="sticky top-0 md:relative z-30 bg-white border-b border-slate-200 p-3 flex items-center justify-between shadow-xs md:h-10 md:py-0 shrink-0">
      <div className="flex items-center gap-1.5 min-w-0">
        <div className="min-w-0">
          <div className="flex flex-col md:flex-row md:items-center md:gap-x-2 gap-y-0.5">
            <div className="flex items-center gap-1.5">
              {isEditingName ? (
                <form onSubmit={handleEditNameSave} className="flex items-center gap-1.5">
                  <Input
                    type="text"
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    className="px-2.5 md:px-2 font-bold text-base md:text-sm text-slate-900 border border-slate-300 rounded-md md:rounded-sm focus:border-slate-500 w-32 sm:w-44 md:w-56 h-8 md:h-6 py-1 px-1 md:py-0 md:px-2"
                    disabled={isSavingName}
                  />
                  <Button 
                    type="submit" 
                    disabled={isSavingName}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md md:rounded-sm flex items-center justify-center shrink-0 h-8 w-8 md:h-6 md:w-6 p-0"
                  >
                    {isSavingName ? (
                      <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check className="size-4 md:size-3" />
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setIsEditingName(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200 rounded-md md:rounded-sm flex items-center justify-center shrink-0 h-8 w-8 md:h-6 md:w-6 p-0"
                  >
                    <X className="size-4 md:size-3" />
                  </Button>
                </form>
              ) : (
                <>
                  <h3 className="text-base md:text-base font-bold text-slate-900 truncate max-w-[200px]" title={batch.name}>
                    {batch.name}
                  </h3>
                  <button 
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        setShowMobileModal(true);
                      } else {
                        setIsEditingName(true);
                      }
                    }} 
                    className={`text-slate-400 hover:text-slate-700 transition-colors cursor-pointer mr-1 shrink-0 items-center justify-center h-6 w-6 md:h-auto md:w-auto p-0 ${isEditingAnySwatchOnMobile ? 'hidden md:flex' : 'flex'}`}
                    title="Rename Batch"
                  >
                    <Edit2 className="size-4 md:size-3.5" />
                  </button>
                </>
              )}
            </div>
            
            {/* In-line metadata alignment with no labels or badge container, unified typography */}
            <div className={`flex items-center gap-1.5 text-slate-500 font-mono text-xs md:text-[10px] tracking-wide uppercase font-semibold shrink-0 select-all ${isEditingName ? 'hidden md:flex' : ''}`}>
              <span>{batch.id}</span>
              <span className="text-slate-300 font-sans font-normal">•</span>
              <span>{batch.date}</span>
              <span className="text-slate-300 font-sans font-normal">•</span>
              <span className="normal-case">{resolvedSwatchesLength} SKUs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center shrink-0">
        {!viewingSwatchId && !editingSwatchId && (
          <>
            {isBulkEditMode ? (
              <>
                <div className="hidden md:block">
                  <Button
                    onClick={handleToggleAll}
                    className={`h-6 text-xs rounded-sm border transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer py-0 px-2 whitespace-nowrap ${
                      isAllSelected
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
                    }`}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="size-3.5 shrink-0" strokeWidth={2} />
                    ) : (
                      <Square className="size-3.5 shrink-0" strokeWidth={2} />
                    )}
                    <span>{isAllSelected ? 'Unselect all' : 'Select all'}</span>
                  </Button>
                </div>
                <div className="hidden md:block w-1.5 md:w-2" />
                <div className="hidden md:block">
                  <Button
                    onClick={() => {
                      setIsBulkEditMode(false);
                      setSelectedSwatchIds([]);
                    }}
                    className="md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border font-semibold transition-all flex items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0 bg-slate-900 text-white border-slate-900"
                  >
                    <Edit2 className="size-4 md:size-3" />
                    <span>Cancel</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="hidden md:block">
                <Button
                  onClick={() => {
                    setIsBulkEditMode(true);
                    setSelectedSwatchIds([]);
                  }}
                  className="md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border font-semibold transition-all flex items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
                >
                  <Edit2 className="size-4 md:size-3" />
                  <span>Edit Bulk</span>
                </Button>
              </div>
            )}
   
            {!isBulkEditMode && (
              <>
                {/* Spacing gap separating Edit Bulk and Print CTAs */}
                <div className="hidden md:block w-1.5 md:w-2" />
       
                {!isEditingAnySwatchOnMobile && (
                  <Button
                    onClick={handlePrint}
                    disabled={isPrinting}
                    className="h-8 w-8 md:h-6 md:w-auto text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border border-transparent font-semibold transition-all items-center justify-center gap-2 md:gap-1 shadow-xs cursor-pointer shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white p-0 md:py-0 md:px-2.5 flex"
                  >
                    {isPrinting ? (
                      <span className="size-4 md:size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Printer className="size-4 md:size-3" />
                    )}
                    <span className="hidden md:inline">Print</span>
                  </Button>
                )}
       
                {/* Spacing gap between Close (Cross) and Print */}
                <div className="hidden md:block w-2 md:w-4" />
       
                <div className="hidden md:block">
                  <Button 
                    onClick={onClose} 
                    className="size-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-sm flex items-center justify-center shrink-0"
                    title="Close details view"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
