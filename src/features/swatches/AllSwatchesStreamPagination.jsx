/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function AllSwatchesStreamPagination({
  viewingSwatch,
  totalItems,
  startIndex,
  endIndex,
  itemsPerPage,
  setItemsPerPage,
  currentPage,
  setCurrentPage,
  totalPages
}) {
  if (viewingSwatch || totalItems === 0) return null;

  return (
    <div className="shrink-0 hidden md:flex items-center justify-between border-t border-slate-200 px-4 pt-2 pb-1 bg-slate-50/50 text-xs text-slate-500 font-medium select-none w-full gap-2">
      <div className="flex items-center gap-4">
        <span>
          Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">{endIndex}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalItems}</span> swatches
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px]">Show:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-200 text-slate-600 rounded-sm text-xs outline-none cursor-pointer hover:bg-slate-50 transition-colors font-medium py-1 px-1 md:py-0.5 md:px-1.5"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="h-6 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer py-1 px-1 md:py-0 md:px-2"
        >
          <ChevronLeft className="size-3" />
          <span>Prev</span>
        </Button>
        
        {/* Page number buttons */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <Button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`h-6 w-6 rounded-sm text-[11px] font-semibold transition-colors cursor-pointer py-1 px-1 md:py-0 ${
              currentPage === pageNum
                ? 'bg-indigo-600 text-white border border-indigo-600'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="h-6 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer py-1 px-1 md:py-0 md:px-2"
        >
          <span>Next</span>
          <ChevronRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}
