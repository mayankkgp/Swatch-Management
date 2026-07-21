/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function BatchDesktopGrid({
  sortedBatches,
  activeTab,
  handleSort,
  getSortIcon,
  onResumeDraft,
  selectedBatchId,
  onSelectBatch
}) {
  const isCollapsed = !!selectedBatchId;
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when data filters, tab or split state changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortedBatches.length, activeTab, isCollapsed, itemsPerPage]);

  const totalItems = sortedBatches.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedBatches = sortedBatches.slice(startIndex, endIndex);

  if (isCollapsed) {
    return (
      <div className="hidden md:flex flex-col flex-1 overflow-hidden bg-white border-b border-slate-200/80 shadow-2xs w-full h-full">
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full border-collapse text-left table-fixed">
            <tbody className="divide-y divide-slate-100">
              {paginatedBatches.map(batch => {
                const isSelected = selectedBatchId === batch.id;
                return (
                  <tr 
                    key={batch.id} 
                    onClick={() => onSelectBatch && onSelectBatch(batch.id)}
                    className={`cursor-pointer transition-all text-xs text-slate-700 ${
                      isSelected ? 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 font-medium' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="py-1.5 px-3">
                      <div className="flex items-center justify-between gap-1.5 min-w-0">
                        <div className="flex flex-col min-w-0 flex-1">
                          {/* Top Line: Batch Name */}
                          <div className="font-bold text-slate-900 truncate" title={batch.name}>
                            {batch.name}
                          </div>
                          {/* Bottom Line: Batch ID & Date */}
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono mt-0.5 select-all truncate">
                            <span className="truncate">{batch.id}</span>
                            <span className="text-slate-300 font-sans font-normal">•</span>
                            <span>{batch.date}</span>
                            <span className="text-slate-300 font-sans font-normal">•</span>
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <Layers className="size-2.5 text-slate-500 shrink-0" />
                              <span>{batch.swatchIds ? batch.swatchIds.length : 0}</span>
                            </span>
                          </div>
                        </div>
                        {activeTab === 'draft' && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onResumeDraft(batch.id);
                            }}
                            className="h-5 w-5 shrink-0 inline-flex items-center justify-center rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-3xs transition-colors border border-transparent"
                            title="Resume Draft"
                          >
                            <Play className="size-2 fill-white stroke-none" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Compact Pagination Controls */}
        {totalItems > 0 && (
          <div className="shrink-0 flex items-center justify-between border-t border-slate-100 px-2.5 py-1.5 bg-slate-50/50 text-[10px] text-slate-500 font-medium select-none w-full">
            <div className="flex items-center gap-1.5">
              <span>
                {startIndex + 1}–{endIndex} of {totalItems}
              </span>
              <span className="text-slate-300">•</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-600 rounded-sm px-1 py-0.5 outline-none cursor-pointer hover:bg-slate-50 transition-colors text-[9px] font-bold"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-3" />
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight className="size-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="hidden md:flex flex-col flex-1 overflow-hidden bg-white border-y border-slate-200/80 shadow-2xs w-full h-full">
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full border-collapse text-left table-fixed">
          <thead>
            <tr className="sticky top-0 z-10 h-6 bg-slate-50/90 backdrop-blur-xs border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
              <th 
                onClick={() => handleSort('name')} 
                className={`sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors group ${activeTab === 'active' ? 'w-[45%]' : 'w-[35%]'}`}
              >
                <div className="flex items-center gap-1 font-bold">
                  <span>Batch Name</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('id')} 
                className={`sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors group ${activeTab === 'active' ? 'w-[25%]' : 'w-[20%]'}`}
              >
                <div className="flex items-center gap-1 font-bold">
                  <span>Batch ID</span>
                  {getSortIcon('id')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('date')} 
                className="sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors w-[15%] group"
              >
                <div className="flex items-center gap-1 font-bold">
                  <span>Date</span>
                  {getSortIcon('date')}
                </div>
              </th>
              <th 
                onClick={() => handleSort('count')} 
                className="sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 cursor-pointer hover:bg-slate-100 transition-colors w-[15%] group"
              >
                <div className="flex items-center gap-1 font-bold">
                  <span>#Swatches</span>
                  {getSortIcon('count')}
                </div>
              </th>
              {activeTab === 'draft' && (
                <th className="sticky top-0 z-10 bg-slate-50/95 py-0.5 px-3 w-[15%] text-center">
                  <span>Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedBatches.map(batch => {
              const isSelected = selectedBatchId === batch.id;
              return (
                <tr 
                  key={batch.id} 
                  onClick={() => onSelectBatch && onSelectBatch(batch.id)}
                  className={`h-6 cursor-pointer transition-all text-xs text-slate-700 ${
                    isSelected ? 'bg-indigo-50/80 hover:bg-indigo-100 text-indigo-950 font-medium' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <td className="py-0.5 px-3 font-semibold text-slate-900 truncate max-w-xs" title={batch.name}>
                    <span className="truncate">{batch.name}</span>
                  </td>
                  <td className="py-0.5 px-3 font-mono text-black select-all truncate" title={batch.id}>
                    {batch.id}
                  </td>
                  <td className="py-0.5 px-3 font-mono text-black">
                    {batch.date}
                  </td>
                  <td className="py-0.5 px-3 font-mono text-black">
                    {batch.swatchIds ? batch.swatchIds.length : 0}
                  </td>
                  {activeTab === 'draft' && (
                    <td className="py-0.5 px-3 text-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onResumeDraft(batch.id);
                        }}
                        className="h-5 inline-flex items-center justify-center gap-1 px-2.5 text-[9px] font-extrabold uppercase tracking-wider rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-3xs transition-colors"
                      >
                        <Play className="size-2 fill-white stroke-none" />
                        <span>Resume</span>
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Non-collapsed Pagination Controls */}
      {totalItems > 0 && (
        <div className="shrink-0 flex items-center justify-between border-t border-slate-100 px-4 py-2 bg-slate-50/50 text-xs text-slate-500 font-medium select-none w-full">
          <div className="flex items-center gap-4">
            <span>
              Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-slate-700">{endIndex}</span> of{' '}
              <span className="font-semibold text-slate-700">{totalItems}</span> batches
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-600 rounded-sm px-1.5 py-0.5 text-xs outline-none cursor-pointer hover:bg-slate-50 transition-colors font-medium"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-6 px-2 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            >
              <ChevronLeft className="size-3" />
              <span>Prev</span>
            </Button>
            
            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <Button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-6 w-6 rounded-sm text-[11px] font-semibold transition-colors cursor-pointer ${
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
              className="h-6 px-2 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-45 disabled:hover:bg-white transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
