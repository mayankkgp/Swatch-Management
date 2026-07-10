/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { VENDOR_NAMES } from '../../data/seedData';
import Input from '../../components/ui/Input';

export default function BatchFilterPopover({
  onClose,
  selectedVendors,
  setSelectedVendors,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  filterMinSwatches,
  setFilterMinSwatches,
  filterMonth,
  setFilterMonth,
  resetFilters
}) {
  const popoverRef = useRef(null);
  const [openSection, setOpenSection] = useState('vendor'); // 'vendor' | 'date' | 'minSwatches'
  const [vendorSearch, setVendorSearch] = useState('');

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose();
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const filteredVendors = VENDOR_NAMES.filter(v =>
    v.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const handleVendorToggle = (vendor) => {
    if (selectedVendors.includes(vendor)) {
      setSelectedVendors(selectedVendors.filter(v => v !== vendor));
    } else {
      setSelectedVendors([...selectedVendors, vendor]);
    }
  };

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-md shadow-lg z-50 text-slate-800 flex flex-col font-sans"
    >
      {/* Popover Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 shrink-0">
        <span className="text-xs font-bold text-slate-700">Filters</span>
        {(selectedVendors.length > 0 || fromDate || toDate || filterMinSwatches !== 'all' || (filterMonth && filterMonth !== 'all')) && (
          <button
            onClick={resetFilters}
            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-[8px] py-[4px] cursor-pointer animate-in fade-in duration-100"
          >
            [ Clear All ]
          </button>
        )}
      </div>

      {/* Accordion Stack */}
      <div className="max-h-[320px] overflow-y-auto flex flex-col divide-y divide-slate-100">
        
        {/* Accordion Block: Vendor */}
        <div className="flex flex-col">
          <button
            onClick={() => toggleSection('vendor')}
            className="flex items-center justify-between w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vendor</span>
              {selectedVendors.length > 0 && (
                <span className="size-2 bg-indigo-600 rounded-full shrink-0" />
              )}
            </div>
            {openSection === 'vendor' ? <ChevronUp className="size-3.5 text-slate-400" /> : <ChevronDown className="size-3.5 text-slate-400" />}
          </button>

          {openSection === 'vendor' && (
            <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
              {/* Vendor Search Input */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400 pointer-events-none">
                  <Search className="size-3" />
                </span>
                <input
                  type="text"
                  placeholder="Search vendor..."
                  value={vendorSearch}
                  onChange={(e) => setVendorSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded border border-slate-200 focus:outline-hidden focus:border-slate-400 transition-all font-sans pl-7 pr-2 h-7"
                />
              </div>

              {/* Checkbox scroll list */}
              <div className="max-h-28 overflow-y-auto flex flex-col gap-1 pr-1">
                {filteredVendors.map(vendor => (
                  <label
                    key={vendor}
                    className="flex items-center gap-2 cursor-pointer py-[4px] px-[8px] hover:bg-slate-50 rounded transition-colors text-xs text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor)}
                      onChange={() => handleVendorToggle(vendor)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3"
                    />
                    <span className="truncate">{vendor}</span>
                  </label>
                ))}
                {filteredVendors.length === 0 && (
                  <span className="text-[10px] text-slate-400 italic px-2 py-1">No matches found</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Accordion Block: DATE */}
        <div className="flex flex-col">
          <button
            onClick={() => toggleSection('date')}
            className="flex items-center justify-between w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">DATE</span>
              {(fromDate || toDate) && (
                <span className="size-2 bg-indigo-600 rounded-full shrink-0" />
              )}
            </div>
            {openSection === 'date' ? <ChevronUp className="size-3.5 text-slate-400" /> : <ChevronDown className="size-3.5 text-slate-400" />}
          </button>

          {openSection === 'date' && (
            <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full h-7 text-xs py-[4px] px-[8px] border border-slate-200 rounded bg-slate-50 focus:outline-hidden focus:border-slate-400 text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full h-7 text-xs py-[4px] px-[8px] border border-slate-200 rounded bg-slate-50 focus:outline-hidden focus:border-slate-400 text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Block: Min Swatches */}
        <div className="flex flex-col">
          <button
            onClick={() => toggleSection('minSwatches')}
            className="flex items-center justify-between w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Min Swatches</span>
              {filterMinSwatches !== 'all' && (
                <span className="size-2 bg-indigo-600 rounded-full shrink-0" />
              )}
            </div>
            {openSection === 'minSwatches' ? <ChevronUp className="size-3.5 text-slate-400" /> : <ChevronDown className="size-3.5 text-slate-400" />}
          </button>

          {openSection === 'minSwatches' && (
            <div className="px-3 pb-3 pt-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap gap-1">
                {['all', '1', '5', '10', '15'].map(val => (
                  <button
                    key={val}
                    onClick={() => setFilterMinSwatches(val)}
                    className={`text-xs py-[4px] px-[8px] rounded border font-semibold cursor-pointer ${
                      filterMinSwatches === val
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val === 'all' ? 'All' : `${val}+`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
