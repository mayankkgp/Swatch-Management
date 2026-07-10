/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { STRUCTURES } from '../../data/seedData';

export default function AllSwatchesStreamFilters({
  showFilterBar,
  structureFilter,
  setStructureFilter,
  searchTerm,
  setSearchTerm
}) {
  if (!showFilterBar) return null;

  return (
    <div id="filter-bar-expanded" className="md:hidden shrink-0 bg-slate-50 border-b border-slate-200 py-3 px-3 animate-in slide-in-from-top duration-150">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-6xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Weave Structure</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setStructureFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  structureFilter === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Structures
              </button>
              {STRUCTURES.map(struct => (
                <button
                  key={struct}
                  onClick={() => setStructureFilter(struct)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    structureFilter === struct
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {struct}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset filters action */}
        {(structureFilter !== 'all' || searchTerm) && (
          <Button
            id="reset-all-filters-btn"
            onClick={() => {
              setStructureFilter('all');
              setSearchTerm('');
            }}
            className="h-8 md:h-6 px-3 bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-md md:rounded-sm border border-slate-200 shadow-3xs cursor-pointer inline-flex items-center justify-center gap-1 self-start md:self-auto shrink-0"
          >
            <X className="size-3" />
            <span>Reset Rules</span>
          </Button>
        )}
      </div>
    </div>
  );
}
