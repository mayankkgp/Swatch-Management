/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function BatchExpandedFilters({
  showFilterBar,
  filterMinSwatches,
  setFilterMinSwatches,
  filterMonth,
  setFilterMonth,
  searchTerm,
  resetFilters,
  isSplitView = false
}) {
  if (!showFilterBar) return null;

  if (isSplitView) {
    return (
      <div 
        id="expanded-filter-tray" 
        className="md:hidden bg-slate-100 border-b border-slate-200 p-3 flex flex-col gap-2.5 text-[10px]"
      >
        {/* Min Swatch Count Segment */}
        <div className="flex flex-col gap-1 w-full">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 select-none">
            Min Swatches:
          </span>
          <div className="flex flex-wrap gap-0.5">
            {['all', '1', '5', '10', '15'].map(val => (
              <Button
                key={val}
                onClick={() => setFilterMinSwatches(val)}
                className={`px-1.5 py-0.5 rounded-xs border text-[10px] font-semibold ${
                  filterMinSwatches === val
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {val === 'all' ? 'All' : `${val}+`}
              </Button>
            ))}
          </div>
        </div>

        {/* Date Month Filter Segment */}
        <div className="flex flex-col gap-1 w-full">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 select-none">
            Month Group:
          </span>
          <div className="flex flex-col gap-0.5">
            {[
              { label: 'All Time', value: 'all' },
              { label: 'June 2026', value: '06' },
              { label: 'July 2026', value: '07' }
            ].map(item => (
              <Button
                key={item.value}
                onClick={() => setFilterMonth(item.value)}
                className={`px-1.5 py-0.5 rounded-xs border text-[10px] font-semibold text-left justify-start ${
                  filterMonth === item.value
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Clear Controls */}
        {(filterMinSwatches !== 'all' || filterMonth !== 'all' || searchTerm !== '') && (
          <Button
            onClick={resetFilters}
            className="text-[9px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 uppercase tracking-wide cursor-pointer py-1"
          >
            <X className="size-2.5" />
            Reset filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div 
      id="expanded-filter-tray" 
      className="md:hidden bg-slate-100/80 border-b border-slate-200/80 p-3 md:px-3 md:py-2 flex flex-col md:flex-row gap-4 md:gap-3 items-start md:items-center text-xs"
    >
      {/* Min Swatch Count Segment */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
        <span className="text-[12px] md:text-[10px] uppercase font-bold tracking-wide md:tracking-wider text-slate-400 select-none">
          Min Swatches:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {['all', '1', '5', '10', '15'].map(val => (
            <Button
              key={val}
              onClick={() => setFilterMinSwatches(val)}
              className={`h-8 md:h-auto px-3 md:px-2.5 rounded md:rounded-sm border text-[12px] md:text-xs font-semibold flex items-center justify-center cursor-pointer py-1 px-1 md:py-0.5 md:px-2.5 ${
                filterMinSwatches === val
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {val === 'all' ? 'All' : `${val}+`}
            </Button>
          ))}
        </div>
      </div>

      {/* Date Month Filter Segment */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
        <span className="text-[12px] md:text-[10px] uppercase font-bold tracking-wide md:tracking-wider text-slate-400 select-none">
          Month Group:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'All Time', value: 'all' },
            { label: 'June 2026', value: '06' },
            { label: 'July 2026', value: '07' }
          ].map(item => (
            <Button
              key={item.value}
              onClick={() => setFilterMonth(item.value)}
              className={`h-8 md:h-auto px-3 md:px-2.5 rounded md:rounded-sm border text-[12px] md:text-xs font-semibold flex items-center justify-center cursor-pointer py-1 px-1 md:py-0.5 md:px-2.5 ${
                filterMonth === item.value
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Controls */}
      {(filterMinSwatches !== 'all' || filterMonth !== 'all' || searchTerm !== '') && (
        <Button
          onClick={resetFilters}
          className="mt-2 md:mt-0 text-[12px] md:text-[10px] font-bold text-red-600 hover:text-red-800 flex items-center justify-center gap-1 uppercase tracking-wide cursor-pointer md:ml-auto md:h-auto rounded bg-transparent border border-transparent px-2 py-1 px-1 md:py-0 md:px-2"
        >
          <X className="size-4 md:size-3" />
          <span>Reset filters</span>
        </Button>
      )}
    </div>
  );
}
