import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import EnquiriesFilterPopover from './EnquiriesFilterPopover';

export default function EnquiriesHeader({
  searchTerm,
  setSearchTerm,
  showFilterBar,
  setShowFilterBar,
  activeTab,
  setActiveTab,
  isSplitView = false,
  customerOptions = [],
  selectedCustomers = [],
  setSelectedCustomers,
  amOptions = [],
  selectedAMs = [],
  setSelectedAMs,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedOutcomes = [],
  setSelectedOutcomes,
  resetFilters
}) {
  const hasActiveFilters =
    (selectedCustomers && selectedCustomers.length > 0) ||
    (selectedAMs && selectedAMs.length > 0) ||
    fromDate ||
    toDate ||
    (activeTab === 'past' && selectedOutcomes && selectedOutcomes.length > 0);

  if (isSplitView) {
    return (
      <div
        id="enquiries-subheader-compact"
        className="flex flex-col gap-1 py-1 px-3 bg-white border-b border-slate-200 relative z-30"
      >
        {/* Row 1: Search bar + Filter trigger */}
        <div className="flex items-center gap-1 w-full">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">
              <Search className="size-3.5" />
            </span>
            <Input
              id="enquiry-search-input-compact"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="!pl-7 !pr-6"
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
              onClick={() => setShowFilterBar((prev) => !prev)}
              className={`h-6 text-[10px] px-1.5 rounded-sm border transition-colors flex items-center justify-center gap-1 font-medium shrink-0 ${
                showFilterBar || hasActiveFilters
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Toggle Filters"
            >
              <Filter className="size-3" />
            </Button>
            {showFilterBar && (
              <EnquiriesFilterPopover
                onClose={() => setShowFilterBar(false)}
                isSplitView={true}
                customerOptions={customerOptions}
                selectedCustomers={selectedCustomers}
                setSelectedCustomers={setSelectedCustomers}
                amOptions={amOptions}
                selectedAMs={selectedAMs}
                setSelectedAMs={setSelectedAMs}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                selectedOutcomes={selectedOutcomes}
                setSelectedOutcomes={setSelectedOutcomes}
                activeTab={activeTab}
                resetFilters={resetFilters}
              />
            )}
          </div>
        </div>

        {/* Row 2: Status Toggles: [ Pending ] | [ In Progress ] | [ Past ] */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex-1 flex h-6 bg-slate-100 p-0.5 rounded-sm border border-slate-200/60 select-none">
            <Button
              id="tab-pending-compact"
              onClick={() => setActiveTab('pending')}
              className={`flex-1 flex items-center justify-center px-1 text-[9px] font-semibold rounded-xs transition-all ${
                activeTab === 'pending'
                  ? 'bg-white text-slate-900 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pending
            </Button>
            <Button
              id="tab-in-progress-compact"
              onClick={() => setActiveTab('in_progress')}
              className={`flex-1 flex items-center justify-center px-1 text-[9px] font-semibold rounded-xs transition-all ${
                activeTab === 'in_progress'
                  ? 'bg-white text-slate-900 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active
            </Button>
            <Button
              id="tab-past-compact"
              onClick={() => setActiveTab('past')}
              className={`flex-1 flex items-center justify-center px-1 text-[9px] font-semibold rounded-xs transition-all ${
                activeTab === 'past'
                  ? 'bg-white text-slate-900 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Past
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="enquiries-subheader"
      className="flex flex-row items-center justify-between gap-3 p-1.5 h-10 py-0 px-3 bg-white border-b border-slate-200/80 shadow-xs relative z-30"
    >
      {/* Left Side: Search & Filter Trigger */}
      <div className="flex items-center gap-2 flex-1 w-full max-w-xl">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none text-slate-400">
            <Search className="size-3.5" />
          </span>
          <Input
            id="enquiry-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search enquiries..."
            className="!pl-7 !pr-7 text-xs h-6 rounded-sm leading-none py-0"
          />
          {searchTerm && (
            <Button
              onClick={() => setSearchTerm('')}
              className="absolute right-0 inset-y-0 flex items-center justify-center pr-2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="size-3" />
            </Button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <div className="relative shrink-0">
          <Button
            id="filter-trigger-btn"
            onClick={() => setShowFilterBar((prev) => !prev)}
            className={`h-6 text-xs rounded-sm border transition-colors flex items-center justify-center gap-1.5 font-medium cursor-pointer shrink-0 py-0 px-2 ${
              showFilterBar || hasActiveFilters
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
            }`}
          >
            <Filter className="size-3.5" />
            <span>Filters</span>
          </Button>

          {showFilterBar && (
            <EnquiriesFilterPopover
              onClose={() => setShowFilterBar(false)}
              isSplitView={false}
              customerOptions={customerOptions}
              selectedCustomers={selectedCustomers}
              setSelectedCustomers={setSelectedCustomers}
              amOptions={amOptions}
              selectedAMs={selectedAMs}
              setSelectedAMs={setSelectedAMs}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              selectedOutcomes={selectedOutcomes}
              setSelectedOutcomes={setSelectedOutcomes}
              activeTab={activeTab}
              resetFilters={resetFilters}
            />
          )}
        </div>
      </div>

      {/* Right Side: Status Toggles: [ Pending ] | [ In Progress ] | [ Past ] */}
      <div className="flex flex-row items-center gap-3 shrink-0">
        <div
          id="enquiry-status-tab-selector"
          className="flex h-6 bg-slate-100 p-0.5 rounded-sm border border-slate-200/60 select-none"
        >
          <Button
            id="tab-pending"
            onClick={() => setActiveTab('pending')}
            className={`flex items-center justify-center px-3 text-xs font-semibold rounded-xs transition-all cursor-pointer h-full py-0 ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pending
          </Button>
          <Button
            id="tab-in-progress"
            onClick={() => setActiveTab('in_progress')}
            className={`flex items-center justify-center px-3 text-xs font-semibold rounded-xs transition-all cursor-pointer h-full py-0 ${
              activeTab === 'in_progress'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Active
          </Button>
          <Button
            id="tab-past"
            onClick={() => setActiveTab('past')}
            className={`flex items-center justify-center px-3 text-xs font-semibold rounded-xs transition-all cursor-pointer h-full py-0 ${
              activeTab === 'past'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Past
          </Button>
        </div>
      </div>
    </div>
  );
}
