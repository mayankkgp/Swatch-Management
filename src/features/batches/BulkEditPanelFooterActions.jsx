/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Save, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function BulkEditPanelFooterActions({
  isViewOnly,
  onEdit,
  editingSwatch,
  onDiscard,
  isSaving,
  handleSave,
  isDisabled,
  setShowConfirmDelete
}) {
  if (isViewOnly) {
    return (
      <div className="py-2 px-1.5 border-t border-slate-200 flex gap-1.5 shrink-0 bg-slate-50">
        <Button
          type="button"
          onClick={onEdit}
          className="flex-1 h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider rounded flex items-center justify-center border border-transparent transition-all cursor-pointer"
        >
          <span>Edit</span>
        </Button>
      </div>
    );
  }

  if (editingSwatch) {
    return (
      <div className="py-2 px-1.5 border-t border-slate-200 flex gap-1.5 shrink-0 bg-slate-50">
        <Button
          type="button"
          onClick={onDiscard}
          disabled={isSaving}
          className="flex-1 h-8 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-wider rounded flex items-center justify-center border border-slate-200 transition-all cursor-pointer"
        >
          <span>Cancel</span>
        </Button>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isDisabled}
          className="flex-1 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent text-white font-bold text-[10px] uppercase tracking-wider rounded flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
        >
          <Save className="size-3" />
          <span>Save</span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden py-3 px-1.5 border-t border-slate-200 space-y-1.5 shrink-0 bg-slate-50">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isDisabled}
          className="w-full h-8.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Save className="size-3.5" />
          <span>Apply Edits</span>
        </Button>

        <div className="flex gap-1.5">
          <Button
            type="button"
            onClick={() => setShowConfirmDelete(true)}
            disabled={isDisabled}
            className="flex-1 h-8 bg-red-50 hover:bg-red-100 disabled:bg-transparent disabled:text-slate-300 disabled:border-slate-100 text-red-600 border border-red-200/50 font-bold text-[10px] uppercase tracking-wider rounded flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Trash2 className="size-3" />
            <span>Delete</span>
          </Button>

          <Button
            type="button"
            onClick={onDiscard}
            disabled={isSaving}
            className="flex-1 h-8 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-wider rounded flex items-center justify-center border border-slate-200 transition-all cursor-pointer"
          >
            <span>Cancel</span>
          </Button>
        </div>
      </div>

      <div className="hidden md:flex py-2 px-1.5 border-t border-slate-200 gap-1.5 shrink-0 bg-slate-50">
        <Button
          type="button"
          onClick={onDiscard}
          disabled={isSaving}
          className="flex-1 h-8 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-wider rounded flex items-center justify-center border border-slate-200 transition-all cursor-pointer"
        >
          <span>Cancel</span>
        </Button>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isDisabled}
          className="flex-1 h-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent text-white font-bold text-[10px] uppercase tracking-wider rounded flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
        >
          <Save className="size-3" />
          <span>Apply</span>
        </Button>
      </div>
    </>
  );
}
