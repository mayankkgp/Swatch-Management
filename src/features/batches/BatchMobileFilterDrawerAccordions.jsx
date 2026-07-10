import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { VENDOR_NAMES } from '../../data/seedData';
import Input from '../../components/ui/Input';

export function VendorAccordion({ tempVendors, setTempVendors }) {
  const [vendorSearch, setVendorSearch] = useState('');

  const filteredVendors = VENDOR_NAMES.filter(v =>
    v.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const handleToggle = (vendor) => {
    if (tempVendors.includes(vendor)) {
      setTempVendors(tempVendors.filter(v => v !== vendor));
    } else {
      setTempVendors([...tempVendors, vendor]);
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* iOS Safari safe search input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
          <Search className="size-4" />
        </span>
        <input
          type="text"
          value={vendorSearch}
          onChange={(e) => setVendorSearch(e.target.value)}
          placeholder="Filter vendors..."
          className="w-full pl-8 pr-3 h-9 border border-slate-200 rounded bg-slate-50 text-base focus:outline-hidden focus:border-slate-400 text-slate-700"
        />
      </div>

      <div className="max-h-48 overflow-y-auto border border-slate-100 rounded p-1.5 flex flex-col gap-1.5 bg-slate-50/50">
        {filteredVendors.map(vendor => {
          const checked = tempVendors.includes(vendor);
          return (
            <label
              key={vendor}
              className="flex items-center gap-2.5 py-1.5 px-2 hover:bg-slate-50 rounded-xs cursor-pointer text-slate-700 select-none text-sm"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleToggle(vendor)}
                className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium truncate">{vendor}</span>
            </label>
          );
        })}
        {filteredVendors.length === 0 && (
          <span className="text-[11px] text-slate-400 text-center py-4 block font-medium">
            No matching vendors
          </span>
        )}
      </div>
    </div>
  );
}

export function DateAccordion({ tempFromDate, setTempFromDate, tempToDate, setTempToDate }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <div className="flex flex-col">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
          From Date
        </label>
        <input
          type="date"
          value={tempFromDate}
          onChange={(e) => setTempFromDate(e.target.value)}
          className="w-full h-9 border border-slate-200 rounded bg-slate-50 text-base px-2.5 focus:outline-hidden focus:border-slate-400 text-slate-700"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
          To Date
        </label>
        <input
          type="date"
          value={tempToDate}
          onChange={(e) => setTempToDate(e.target.value)}
          className="w-full h-9 border border-slate-200 rounded bg-slate-50 text-base px-2.5 focus:outline-hidden focus:border-slate-400 text-slate-700"
        />
      </div>
    </div>
  );
}

export function AccordionSection({ title, isOpen, onToggle, hasActiveFilter, children }) {
  return (
    <div className="border-b border-slate-100 flex flex-col">
      <button
        onClick={onToggle}
        className="flex items-center justify-between py-3 px-1 hover:bg-slate-50/50 transition-colors cursor-pointer text-left w-full"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          {hasActiveFilter && (
            <span className="size-2 bg-indigo-600 rounded-full shrink-0" />
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="size-4 text-slate-400" />
        ) : (
          <ChevronDown className="size-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="px-1 pb-3.5 animate-in fade-in slide-in-from-top-1 duration-100">
          {children}
        </div>
      )}
    </div>
  );
}
