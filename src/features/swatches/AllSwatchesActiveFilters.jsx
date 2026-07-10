/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X } from 'lucide-react';

export default function AllSwatchesActiveFilters({
  selectedVendors,
  setSelectedVendors,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  structureFilter,
  setStructureFilter
}) {
  const activePills = [];
  
  if (selectedVendors && selectedVendors.length > 0) {
    selectedVendors.forEach(vendor => {
      activePills.push({
        id: `vendor-${vendor}`,
        label: `Vendor: ${vendor}`,
        onDismiss: () => setSelectedVendors(selectedVendors.filter(v => v !== vendor))
      });
    });
  }
  
  if (fromDate || toDate) {
    activePills.push({
      id: 'date-range',
      label: `Date: ${fromDate || 'Any'} to ${toDate || 'Any'}`,
      onDismiss: () => {
        setFromDate('');
        setToDate('');
      }
    });
  }
  
  if (structureFilter && structureFilter !== 'all') {
    activePills.push({
      id: 'structure-filter',
      label: `Structure: ${structureFilter.charAt(0).toUpperCase() + structureFilter.slice(1)}`,
      onDismiss: () => setStructureFilter('all')
    });
  }

  if (activePills.length === 0) return null;

  return (
    <div className="hidden md:flex bg-white border-b border-slate-200 py-1 px-3 items-center justify-between gap-2 text-xs select-none min-h-[32px] w-full shrink-0">
      <div className="flex flex-wrap items-center gap-1 flex-1 overflow-x-auto no-scrollbar">
        {activePills.map(pill => (
          <div 
            key={pill.id} 
            className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-xs py-[2px] px-1.5 text-[10px] font-medium transition-all hover:bg-slate-150 animate-in fade-in-50 duration-100 shrink-0 select-none"
          >
            <span>{pill.label}</span>
            <button
              onClick={() => pill.onDismiss()}
              className="p-0.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600 cursor-pointer flex items-center justify-center shrink-0"
              aria-label={`Remove ${pill.label}`}
            >
              <X className="size-2.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
