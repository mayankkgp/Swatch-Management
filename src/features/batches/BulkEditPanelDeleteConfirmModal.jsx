/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function BulkEditPanelDeleteConfirmModal({
  showConfirmDelete,
  setShowConfirmDelete,
  editingSwatch,
  selectedCount,
  onDelete
}) {
  if (!showConfirmDelete) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 text-slate-800 max-w-xs w-full rounded-lg p-4 shadow-2xl space-y-3.5 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-red-50 text-red-600 rounded-full shrink-0">
            <AlertTriangle className="size-4" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {editingSwatch ? 'Delete Swatch?' : 'Delete selected assets?'}
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              {editingSwatch 
                ? `Permanently remove swatch "${editingSwatch.id}" from this batch?`
                : `Permanently remove ${selectedCount} selected swatches from this batch?`
              }
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 justify-end pt-1">
          <Button
            onClick={() => setShowConfirmDelete(false)}
            className="h-7 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded uppercase tracking-wider cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setShowConfirmDelete(false);
              await onDelete();
            }}
            className="h-7 px-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="size-3" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
