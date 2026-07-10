/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function AllSwatchesStreamSort({
  showSortBar,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection
}) {
  if (!showSortBar) return null;

  return (
    <div id="sort-bar-expanded" className="hidden md:block shrink-0 bg-slate-50 border-b border-slate-200 py-2.5 px-3 animate-in slide-in-from-top duration-150">
      <div className="flex items-center justify-between gap-3 max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Sort Field</label>
            <div className="flex items-center gap-1.5">
              {[
                { key: 'none', label: 'Default' },
                { key: 'id', label: 'Fabrito SKU' },
                { key: 'vendorName', label: 'Vendor Name' },
                { key: 'vendorSku', label: 'Vendor SKU' },
                { key: 'quantity', label: 'Quantity' }
              ].map(field => (
                <button
                  key={field.key}
                  onClick={() => setSortField(field.key)}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                    sortField === field.key
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>

          {sortField !== 'none' && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Order</label>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSortDirection('asc')}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                    sortDirection === 'asc' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Ascending
                </button>
                <button
                  onClick={() => setSortDirection('desc')}
                  className={`px-3 py-1 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
                    sortDirection === 'desc' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Descending
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
