/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, X, ArrowUpDown } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import BatchFilterPopover from './BatchFilterPopover';

export default function BatchDirectoryHeader({
  searchTerm,
  setSearchTerm,
  showFilterBar,
  setShowFilterBar,
  filterMinSwatches,
  setFilterMinSwatches,
  filterMonth,
  setFilterMonth,
  activeTab,
  setActiveTab,
  onNavigate,
  isSplitView = false,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  selectedVendors = [],
  setSelectedVendors,
  fromDate = '',
  setFromDate,
  toDate = '',
  setToDate,
  resetFilters
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const activeFilterCount = (filterMinSwatches !== 'all' ? 1 : 0) +
    (filterMonth !== 'all' ? 1 : 0) +
    (selectedVendors && selectedVendors.length > 0 ? 1 : 0) +
    (fromDate || toDate ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getSortLabel = () => {
    if (sortField === 'date') return sortDirection === 'desc' ? 'Newest first' : 'Oldest first';
    if (sortField === 'name') return sortDirection === 'asc' ? 'Name A-Z' : 'Name Z-A';
    if (sortField === 'count') return sortDirection === 'desc' ? 'Most Swatches' : 'Least Swatches';
    return 'Sort';
  };

  const handleMobileSortCycle = () => {
    if (!setSortField || !setSortDirection) return;
    const sequence = [
      { field: 'date', dir: 'desc' },
      { field: 'date', dir: 'asc' },
      { field: 'name', dir: 'asc' },
      { field: 'name', dir: 'desc' },
      { field: 'count', dir: 'desc' },
      { field: 'count', dir: 'asc' }
    ];
    
    const currentIndex = sequence.findIndex(
      s => s.field === sortField && s.dir === sortDirection
    );
    
    const nextIndex = (currentIndex + 1) % sequence.length;
    const nextState = sequence[nextIndex];
    
    setSortField(nextState.field);
    setSortDirection(nextState.dir);
  };
  if (isSplitView) {
    return (
      <div 
        id="directory-subheader" 
        className="flex flex-col gap-1 py-1 px-3 bg-white border-b border-slate-200"
      >
        {/* Row 1: Search bar + Filter trigger */}
        <div className="flex items-center gap-1 w-full">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">
              <Search className="size-3.5" />
            </span>
            <Input
              id="batch-search-input-compact"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="pl-7 md:pl-7 pr-6 md:pr-6"
              style={{ height: '24px', fontSize: '11px' }}
            />
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm('')}
                className="absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="size-3" />
              </Button>
            )}
          </div>

          <div className="relative shrink-0">
            <Button
              id="filter-trigger-btn-compact"
              onClick={() => setShowFilterBar(prev => !prev)}
              className={`h-6 text-[10px] px-1.5 rounded-sm border transition-colors flex items-center justify-center gap-1 font-medium shrink-0 ${
                showFilterBar
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : hasActiveFilters
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Toggle Filters"
            >
              <Filter className={`size-3 ${hasActiveFilters && !showFilterBar ? 'text-indigo-600' : ''}`} />
              {hasActiveFilters && (
                <span className="bg-indigo-600 text-white text-[8px] min-w-3.5 h-3.5 px-1 rounded-full font-bold flex items-center justify-center leading-none md:hidden">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            {!isMobile && showFilterBar && (
              <BatchFilterPopover
                onClose={() => setShowFilterBar(false)}
                selectedVendors={selectedVendors}
                setSelectedVendors={setSelectedVendors}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                filterMinSwatches={filterMinSwatches}
                setFilterMinSwatches={setFilterMinSwatches}
                filterMonth={filterMonth}
                setFilterMonth={setFilterMonth}
                resetFilters={resetFilters}
              />
            )}
          </div>
        </div>

        {/* Row 2: Tab switcher + Add Button */}
        <div className="flex items-center justify-between gap-1.5">
          {/* Active/Draft segmented tab */}
          <div className="flex-1 flex h-6 bg-slate-100 p-0.5 rounded-sm border border-slate-200/60 select-none">
            <Button
              id="tab-active-compact"
              onClick={() => setActiveTab('active')}
              className={`flex-1 flex items-center justify-center px-1 text-[10px] font-semibold rounded-xs transition-all ${
                activeTab === 'active'
                  ? 'bg-white text-slate-900 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active
            </Button>
            <Button
              id="tab-draft-compact"
              onClick={() => setActiveTab('draft')}
              className={`flex-1 flex items-center justify-center px-1 text-[10px] font-semibold rounded-xs transition-all ${
                activeTab === 'draft'
                  ? 'bg-white text-slate-900 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Draft
            </Button>
          </div>

          {/* Add Swatch button */}
          <div className="hidden md:block">
            <Button
              id="add-swatch-shortcut-btn-compact"
              onClick={() => onNavigate('logging')}
              className="h-6 w-6 rounded-sm bg-slate-950 hover:bg-slate-800 text-white font-semibold transition-all items-center justify-center shrink-0 border border-transparent"
              title="Add Swatch"
            >
              <span className="leading-none text-sm font-medium">+</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="directory-subheader" 
      className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-3 p-1.5 md:h-10 md:py-0 md:px-3 bg-white border-b border-slate-200/80 shadow-xs"
    >
      {/* Left Hand: Search & Filter Trigger */}
      <div className="flex items-center gap-3 md:gap-2 flex-1 w-full md:max-w-xl">
        {/* Search box with legibility bounds */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 md:pl-2 pointer-events-none text-slate-400">
            <Search className="size-4 md:size-3.5" />
          </span>
          <Input
            id="batch-search-input"
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
            onClick={() => setShowFilterBar(prev => !prev)}
            className={`h-10 w-10 md:h-6 md:w-auto text-base md:text-xs rounded md:rounded-sm border transition-colors flex items-center justify-center gap-2 md:gap-1.5 font-medium cursor-pointer shrink-0 relative md:py-0 md:px-2 ${
              showFilterBar || hasActiveFilters
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-transparent md:bg-white hover:bg-slate-50 text-slate-700 border-slate-200 md:shadow-2xs'
            }`}
          >
            <Filter className="size-5 md:size-3.5" />
            <span className="hidden md:inline">Filters</span>
          </Button>
          {!isMobile && showFilterBar && (
            <BatchFilterPopover
              onClose={() => setShowFilterBar(false)}
              selectedVendors={selectedVendors}
              setSelectedVendors={setSelectedVendors}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              filterMinSwatches={filterMinSwatches}
              setFilterMinSwatches={setFilterMinSwatches}
              filterMonth={filterMonth}
              setFilterMonth={setFilterMonth}
              resetFilters={resetFilters}
            />
          )}
        </div>

        {/* Filter toggle Button (Mobile ONLY) */}
        <Button
          id="filter-trigger-btn-mobile"
          onClick={() => setShowFilterBar(prev => !prev)}
          className={`md:hidden h-10 w-10 text-base rounded border transition-all duration-200 flex items-center justify-center gap-2 font-medium cursor-pointer shrink-0 relative ${
            showFilterBar
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
              : hasActiveFilters
                ? 'bg-indigo-50/90 border-indigo-300/90 text-indigo-700 shadow-2xs hover:bg-indigo-100/90'
                : 'bg-transparent hover:bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          <Filter className={`size-5 ${hasActiveFilters && !showFilterBar ? 'text-indigo-600' : ''}`} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs pointer-events-none">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Right Hand: Active/Draft Tabs & Shortcut Button */}
      <div className="flex flex-row items-center gap-3 md:gap-8 shrink-0 w-full sm:w-auto">
        
        {/* Segmented active/draft Tab Toggle */}
        <div 
          id="status-tab-selector" 
          className="flex-1 sm:flex-initial flex h-10 md:h-6 bg-slate-100 p-0.5 rounded md:rounded-sm border border-slate-200/60 select-none"
        >
          <Button
            id="tab-active"
            onClick={() => setActiveTab('active')}
            className={`flex-1 sm:flex-initial flex items-center justify-center px-4 md:px-3 text-base md:text-xs font-semibold rounded md:rounded-xs transition-all cursor-pointer h-full py-0 ${
              activeTab === 'active'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active
          </Button>
          <Button
            id="tab-draft"
            onClick={() => setActiveTab('draft')}
            className={`flex-1 sm:flex-initial flex items-center justify-center px-4 md:px-3 text-base md:text-xs font-semibold rounded md:rounded-xs transition-all cursor-pointer h-full py-0 ${
              activeTab === 'draft'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Draft
          </Button>
        </div>

        {/* Add Swatch shortcut button (Desktop ONLY) */}
        <div className="hidden md:block">
          <Button
            id="add-swatch-shortcut-btn"
            onClick={() => onNavigate('logging')}
            className="md:h-6 text-[14px] md:text-xs sm:px-4 md:px-2.5 rounded-md md:rounded-sm bg-slate-950 hover:bg-slate-800 text-white font-semibold transition-all flex items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 border border-transparent cursor-pointer py-1 px-1 md:py-0 md:px-2.5"
          >
            <Plus className="size-4 md:size-3" />
            <span className="hidden sm:inline">Add Swatch</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
