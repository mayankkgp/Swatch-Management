/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trash, Printer } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function AllSwatchesMobileBulkFooter({
  isBulkEditMode,
  selectedSwatchIds = [],
  onBulkDelete,
  onBulkPrint
}) {
  if (!isBulkEditMode) return null;

  return (
    <div className="md:hidden flex-none h-12 bg-white border-t border-slate-200 px-4 py-1.5 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 sticky bottom-0">
      <div className="flex items-center gap-3">
        <span className="text-sm font-normal text-slate-700">
          {selectedSwatchIds.length} selected
        </span>
      </div>
      <div className="flex items-center gap-6">
        <Button
          id="mobile-bulk-delete-btn"
          onClick={onBulkDelete}
          disabled={selectedSwatchIds.length === 0}
          className="h-9 w-9 px-0 bg-white hover:bg-slate-50 disabled:opacity-50 text-red-600 rounded-md shadow-sm border border-slate-200 transition-all flex items-center justify-center cursor-pointer"
        >
          <Trash className="size-5" />
        </Button>
        <Button
          id="mobile-bulk-print-btn"
          onClick={onBulkPrint}
          disabled={selectedSwatchIds.length === 0}
          className="h-9 w-9 px-0 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-md shadow-sm transition-all flex items-center justify-center cursor-pointer"
        >
          <Printer className="size-5" />
        </Button>
      </div>
    </div>
  );
}
