/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function BatchDetailsViewRenameModal({
  showMobileModal,
  setShowMobileModal,
  isSavingName,
  newBatchName,
  setNewBatchName,
  batchName,
  handleEditNameSave,
  title = "Rename Batch",
  saveText = "Save",
  showCancel = true
}) {
  if (!showMobileModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity cursor-pointer" 
        onClick={() => {
          if (!isSavingName) {
            setShowMobileModal(false);
            setNewBatchName(batchName);
          }
        }}
      />
      
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-xl border border-slate-100 w-full max-w-sm p-5 relative z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button 
            type="button"
            onClick={() => {
              if (!isSavingName) {
                setShowMobileModal(false);
                setNewBatchName(batchName);
              }
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 cursor-pointer"
            disabled={isSavingName}
          >
            <X className="size-5" />
          </button>
        </div>
        
        <form onSubmit={handleEditNameSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Batch Name
            </label>
            <Input
              type="text"
              value={newBatchName}
              onChange={(e) => setNewBatchName(e.target.value)}
              placeholder="Enter batch name"
              className="w-full h-10 px-3 text-sm border border-slate-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium"
              disabled={isSavingName}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {showCancel && (
              <Button
                type="button"
                onClick={() => {
                  setShowMobileModal(false);
                  setNewBatchName(batchName);
                }}
                disabled={isSavingName}
                className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-md cursor-pointer border border-slate-200"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSavingName || !newBatchName.trim()}
              className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-md cursor-pointer flex items-center gap-1.5 justify-center"
            >
              {isSavingName ? (
                <>
                  <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{saveText}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
