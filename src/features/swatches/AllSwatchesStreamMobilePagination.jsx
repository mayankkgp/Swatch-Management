/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function AllSwatchesStreamMobilePagination({
  totalItems,
  isEditingAnySwatchOnMobile,
  currentPage,
  setCurrentPage,
  totalPages,
  pageInput,
  handlePageInputChange,
  handlePageInputBlur
}) {
  if (totalItems <= 0 || isEditingAnySwatchOnMobile) return null;

  return (
    <div className="block md:hidden pt-4 pb-2">
      <div className="flex items-center justify-between py-1 px-3 bg-white border border-slate-200 rounded shadow-2xs gap-3">
        <Button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="h-10 w-10 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xs shrink-0 cursor-pointer p-0"
          title="Previous Page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-600 leading-[1.25]">
          <span>Page</span>
          <input
            type="number"
            min={1}
            max={totalPages || 1}
            value={pageInput}
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            className="w-12 text-center bg-slate-50 border border-slate-200 rounded text-base font-bold text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-1"
          />
          <span>of</span>
          <span className="font-bold text-slate-900">{totalPages || 1}</span>
        </div>

        <Button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages <= 1}
          className="h-10 w-10 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xs shrink-0 cursor-pointer p-0"
          title="Next Page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
