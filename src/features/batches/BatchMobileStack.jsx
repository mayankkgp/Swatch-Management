/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layers, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function BatchMobileStack({
  sortedBatches,
  activeTab,
  onResumeDraft,
  selectedBatchId,
  onSelectBatch
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [pageInput, setPageInput] = useState('1');

  const totalPages = Math.ceil(sortedBatches.length / itemsPerPage);

  // Reset page when the actual set of batch IDs changes (due to search, filter, active tab, etc.)
  const batchIdsSerialized = sortedBatches.map(b => b.id).join(',');
  useEffect(() => {
    setCurrentPage(1);
  }, [batchIdsSerialized]);

  // Sync local input string state when currentPage changes
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputChange = (e) => {
    const valStr = e.target.value;
    setPageInput(valStr);
    const parsed = parseInt(valStr, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
    }
  };

  const handlePageInputBlur = () => {
    const parsed = parseInt(pageInput, 10);
    if (isNaN(parsed) || parsed < 1) {
      setCurrentPage(1);
      setPageInput('1');
    } else if (parsed > totalPages) {
      setCurrentPage(totalPages);
      setPageInput(String(totalPages));
    } else {
      setCurrentPage(parsed);
      setPageInput(String(parsed));
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBatches = sortedBatches.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="block md:hidden space-y-4">
      <div className="space-y-2">
        {paginatedBatches.map(batch => {
          const isSelected = selectedBatchId === batch.id;
          return (
            <div 
              key={batch.id}
              onClick={() => onSelectBatch && onSelectBatch(batch.id)}
              className={`rounded border py-1 px-2 shadow-2xs transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-indigo-50/50 border-indigo-400 ring-1 ring-indigo-400/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header Row */}
              <div className="flex justify-between items-center gap-2">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-[16px] font-medium text-slate-900 truncate leading-[1.25]">
                      {batch.name}
                    </h4>
                  </div>
                  <p className="text-[12px] font-mono text-slate-600 flex items-center gap-y-0.5 flex-wrap leading-[1.25]">
                    <span className="select-all">{batch.id}</span>
                    <span className="mx-1 text-slate-300">•</span>
                    <span>{batch.date}</span>
                    <span className="mx-1 text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 text-slate-600 font-normal">
                      <Layers className="size-3.5 text-slate-400 shrink-0" />
                      <span>{batch.swatchIds ? batch.swatchIds.length : 0}</span>
                    </span>
                  </p>
                </div>

                {activeTab === 'draft' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResumeDraft(batch.id);
                    }}
                    className="shrink-0 flex items-center justify-center rounded bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-colors shadow-xs p-1.5"
                    title="Resume"
                  >
                    <Play className="size-4 fill-white stroke-none" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sortedBatches.length > 0 && (
        <div className="pt-1">
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
      )}
    </div>
  );
}
