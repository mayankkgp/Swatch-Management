/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, X, Plus, CheckSquare, Square, Printer } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SwatchFilterPopover from './SwatchFilterPopover';

export default function AllSwatchesStreamHeader({
  searchTerm,
  setSearchTerm,
  showFilterBar,
  setShowFilterBar,
  showSortBar,
  setShowSortBar,
  structureFilter,
  setStructureFilter,
  sortField,
  editingSwatchId,
  onNavigate,
  isBulkEditMode,
  setIsBulkEditMode,
  setSelectedSwatchIds,
  selectedSwatchIds = [],
  selectedVendors = [],
  setSelectedVendors,
  fromDate = '',
  setFromDate,
  toDate = '',
  setToDate,
  resetFilters
}) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-3 p-1.5 md:h-10 md:py-0 md:px-3 bg-white border-b border-slate-200/80 shadow-xs shrink-0">
      {/* Left Hand: Search & Filter Trigger */}
      <div className="flex items-center gap-3 md:gap-2 flex-1 w-full md:max-w-xl">
        {/* Search box with legibility bounds */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-2 pointer-events-none text-slate-400">
            <Search className="size-4 md:size-3.5" />
          </span>
          <Input
            id="swatch-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="pl-9 md:pl-7 pr-10 md:pr-3 text-base md:text-xs h-10 md:h-6 rounded md:rounded-sm leading-none py-0 px-3 md:px-2"
          />
          {searchTerm && (
            <Button
              onClick={() => setSearchTerm('')}
              className="absolute right-0 top-0 bottom-0 w-10 md:inset-y-0 md:right-0 md:top-auto md:bottom-auto md:w-auto md:h-auto flex items-center justify-center md:justify-end p-1.5 md:p-0 md:pr-2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="size-4 md:size-3" />
            </Button>
          )}
        </div>

        {/* Filter toggle Button (Desktop - Floating Popover wrapper) */}
        <div className="relative shrink-0 hidden md:block">
          <Button
            id="filter-trigger-btn"
            onClick={() => {
              setShowFilterBar(prev => !prev);
              setShowSortBar(false); // Close sort bar when opening filter bar
            }}
            className={`h-10 w-10 md:h-6 md:w-auto text-base md:text-xs rounded md:rounded-sm border transition-colors flex items-center justify-center gap-2 md:gap-1.5 font-medium cursor-pointer shrink-0 relative md:py-0 md:px-2 ${
              showFilterBar || structureFilter !== 'all' || (selectedVendors && selectedVendors.length > 0) || fromDate || toDate
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-transparent md:bg-white hover:bg-slate-50 text-slate-700 border-slate-200 md:shadow-2xs'
            }`}
          >
            <Filter className="size-5 md:size-3.5" />
            <span className="hidden md:inline">Filters</span>
          </Button>
          {!isMobile && showFilterBar && (
            <SwatchFilterPopover
              onClose={() => setShowFilterBar(false)}
              selectedVendors={selectedVendors}
              setSelectedVendors={setSelectedVendors}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              structureFilter={structureFilter}
              setStructureFilter={setStructureFilter}
              resetFilters={resetFilters}
            />
          )}
        </div>

        {/* Filter toggle Button (Mobile ONLY) */}
        <Button
          id="filter-trigger-btn-mobile"
          onClick={() => {
            setShowFilterBar(prev => !prev);
            setShowSortBar(false);
          }}
          className={`md:hidden h-10 w-10 text-base rounded border transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer shrink-0 relative ${
            showFilterBar || structureFilter !== 'all'
              ? 'bg-slate-900 text-white border-slate-900' 
              : 'bg-transparent hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <Filter className="size-5" />
          {structureFilter !== 'all' && (
            <Badge className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] size-4 rounded-full flex items-center justify-center font-bold pointer-events-none">
              !
            </Badge>
          )}
        </Button>



        {/* Select toggle Button (Desktop ONLY) */}
        <div className="hidden md:block w-[76px] h-6 shrink-0 relative">
          <Button
            onClick={() => {
              if (isBulkEditMode) {
                setIsBulkEditMode(false);
                setSelectedSwatchIds([]);
              } else {
                setIsBulkEditMode(true);
              }
            }}
            className={`absolute left-0 top-0 bottom-0 flex h-6 text-xs rounded-sm border transition-colors items-center justify-center gap-1.5 font-medium cursor-pointer py-0 px-2 whitespace-nowrap ${
              isBulkEditMode
                ? 'bg-slate-900 text-white border-slate-900 z-10' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs z-10'
            }`}
          >
            {isBulkEditMode ? <CheckSquare className="size-3.5 shrink-0" strokeWidth={2} /> : <Square className="size-3.5 shrink-0" strokeWidth={2} />}
            <span>{isBulkEditMode ? 'Unselect all' : 'Select'}</span>
          </Button>
        </div>
      </div>

      {/* Right Hand: CTAs */}
      <div className="hidden md:flex items-center shrink-0">
        {!editingSwatchId && (
            isBulkEditMode ? (
              <Button
                id="print-swatches-shortcut-btn"
                onClick={async () => {
                  setIsPrinting(true);
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  setIsPrinting(false);
                  alert(`Success: Print job for ${selectedSwatchIds.length} swatches sent to printer queue!`);
                }}
                disabled={selectedSwatchIds.length === 0 || isPrinting}
                className="md:h-6 text-[14px] md:text-xs sm:px-4 md:px-2.5 rounded-md md:rounded-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold transition-all flex items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 border border-transparent cursor-pointer py-1 px-1 md:py-0 md:px-2.5"
              >
                {isPrinting ? (
                  <span className="size-4 md:size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Printer className="size-4 md:size-3" />
                )}
                <span className="hidden sm:inline">Print</span>
              </Button>
            ) : (
              <Button
                id="add-swatch-shortcut-btn"
                onClick={() => onNavigate('logging')}
                className="md:h-6 text-[14px] md:text-xs sm:px-4 md:px-2.5 rounded-md md:rounded-sm bg-slate-950 hover:bg-slate-800 text-white font-semibold transition-all flex items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 border border-transparent cursor-pointer py-1 px-1 md:py-0 md:px-2.5"
              >
                <Plus className="size-4 md:size-3" />
                <span className="hidden sm:inline">Add Swatch</span>
              </Button>
            )
          )}
      </div>
    </div>
  );
}
