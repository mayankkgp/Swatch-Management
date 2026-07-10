/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ArrowLeft, Edit2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import BulkEditPanel from '../batches/BulkEditPanel';
import BatchDetailsViewRenameModal from '../batches/BatchDetailsViewRenameModal';
import ViewingSwatchPreview from './ViewingSwatchPreview';
import SwatchReviewGrid from './SwatchReviewGrid';
import StagingExecutionBar from './StagingExecutionBar';
import useStagingQueueState from './useStagingQueueState';

export default function StagingQueueOverlay({
  stagedSwatches,
  onClose,
  batchName,
  setBatchName,
  onSaveBatch,
  onDeleteSwatch,
  isSavingBatch,
  onRefresh
}) {
  const state = useStagingQueueState({
    batchName,
    setBatchName,
    onSaveBatch,
    isSavingBatch
  });

  const showingSidebar = (state.isBulkEditMode || state.editingSwatchId || state.viewingSwatchId);
  const activeEditingOrViewingSwatch = state.reviewSwatches.find(s => s.id === (state.editingSwatchId || state.viewingSwatchId));

  return (
    <div className={`absolute inset-0 z-40 flex flex-col bg-slate-50 md:animate-none animate-in slide-in-from-bottom-full duration-200 ${showingSidebar ? 'md:flex-row md:gap-3' : ''}`}>
      {showingSidebar && (
        <div className="absolute md:relative inset-y-0 left-0 w-full md:w-[210px] shrink-0 h-full z-50 md:z-30 bg-white border-r border-slate-200 shadow-2xl md:shadow-none animate-in slide-in-from-left duration-200">
          <BulkEditPanel
            selectedCount={state.isBulkEditMode ? state.selectedSwatchIds.length : 1}
            editingSwatch={activeEditingOrViewingSwatch}
            isViewOnly={!!state.viewingSwatchId && !state.editingSwatchId}
            onSave={state.isBulkEditMode ? state.handleSaveBulk : state.handleSaveSingle}
            onDiscard={() => {
              state.setIsBulkEditMode(false);
              state.setEditingSwatchId(null);
              state.setViewingSwatchId(null);
              state.setSelectedSwatchIds([]);
            }}
            onDelete={state.isBulkEditMode ? state.handleDeleteBulk : state.handleDeleteSingle}
            isSaving={state.isSavingBulk}
            onEdit={() => {
              state.setEditingSwatchId(state.viewingSwatchId);
              state.setViewingSwatchId(null);
            }}
            onView={state.setViewingSwatchId}
            batches={[]} 
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="hidden md:flex flex-none h-10 border-b border-slate-200 bg-white px-3 md:py-0 items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              disabled={state.isDesktopActionDisabled}
              className="hidden md:flex md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0 disabled:opacity-50 disabled:pointer-events-none"
            >
              <ArrowLeft className="size-4 md:size-3" />
              <span>Back</span>
            </Button>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <span className="hidden md:inline">Review Batch</span>
              <span className="hidden md:inline text-slate-500 font-mono text-[10px] uppercase tracking-wide font-semibold ml-1">
                <span className="text-slate-300 font-sans font-normal mr-2">•</span>
                {state.reviewSwatches.length} SKUs
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!state.viewingSwatchId && !state.editingSwatchId && (
              <Button
                onClick={() => {
                  state.setIsBulkEditMode(p => !p);
                  state.setSelectedSwatchIds([]);
                }}
                className={`hidden md:flex md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border font-semibold transition-all items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0 ${
                  state.isBulkEditMode ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Edit2 className="size-4 md:size-3" />
                <span>{state.isBulkEditMode ? 'Cancel' : 'Edit Bulk'}</span>
              </Button>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer md:hidden">
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-visible md:overflow-hidden min-h-0 relative flex flex-col">
          {state.viewingSwatchId ? (
            <ViewingSwatchPreview
              viewingSwatch={state.reviewSwatches.find(s => s.id === state.viewingSwatchId)}
              onClosePreview={() => state.setViewingSwatchId(null)}
            />
          ) : (
            <SwatchReviewGrid
              isMobile={state.isMobile}
              isEditingAnySwatchOnMobile={state.isEditingAnySwatchOnMobile}
              reviewSwatches={state.reviewSwatches}
              mobileEditingSwatchId={state.mobileEditingSwatchId}
              isBulkEditMode={state.isBulkEditMode}
              selectedSwatchIds={state.selectedSwatchIds}
              editingSwatchId={state.editingSwatchId}
              handleToggleSelectSwatch={state.handleToggleSelectSwatch}
              handleSaveSwatchInline={state.handleSaveSwatchInline}
              handleDeleteSwatchInline={state.handleDeleteSwatchInline}
              setViewingSwatchId={state.setViewingSwatchId}
              setEditingSwatchId={state.setEditingSwatchId}
              setIsBulkEditMode={state.setIsBulkEditMode}
              setMobileEditingSwatchId={state.setMobileEditingSwatchId}
            />
          )}
        </div>

        <StagingExecutionBar
          isMobile={state.isMobile}
          isEditingAnySwatchOnMobile={state.isEditingAnySwatchOnMobile}
          batchName={batchName}
          setBatchName={setBatchName}
          isSavingBatch={isSavingBatch}
          isDesktopActionDisabled={state.isDesktopActionDisabled}
          reviewSwatches={state.reviewSwatches}
          isSaveDisabled={state.isSaveDisabled}
          isPrinting={state.isPrinting}
          setPendingAction={state.setPendingAction}
          setShowMobileModal={state.setShowMobileModal}
          onSaveBatch={onSaveBatch}
          handleSaveAndPrint={state.handleSaveAndPrint}
        />
        
        <BatchDetailsViewRenameModal
          showMobileModal={state.showMobileModal}
          setShowMobileModal={state.setShowMobileModal}
          isSavingName={isSavingBatch || state.isPrinting}
          newBatchName={batchName}
          setNewBatchName={setBatchName}
          batchName={batchName}
          handleEditNameSave={state.handleMobileModalSave}
          title="Add Batch Name"
          saveText="Done"
          showCancel={false}
        />
      </div>
    </div>
  );
}
