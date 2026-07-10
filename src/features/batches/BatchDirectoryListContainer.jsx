/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Folder, X } from 'lucide-react';
import BatchDirectoryHeader from './BatchDirectoryHeader';
import BatchExpandedFilters from './BatchExpandedFilters';
import BatchDesktopGrid from './BatchDesktopGrid';
import BatchMobileStack from './BatchMobileStack';
import Button from '../../components/ui/Button';
import BatchMobileFilterDrawer from './BatchMobileFilterDrawer';

export default function BatchDirectoryListContainer({
  selectedBatchId,
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
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  resetFilters,
  sortedBatches,
  handleSort,
  getSortIcon,
  onResumeDraft,
  setSelectedBatchId,
  selectedVendors = [],
  setSelectedVendors,
  fromDate = '',
  setFromDate,
  toDate = '',
  setToDate
}) {
  const [isMobileLoadingFilters, setIsMobileLoadingFilters] = useState(false);

  const handleMobileApply = (data) => {
    setIsMobileLoadingFilters(true);
    setSelectedVendors(data.vendors);
    setFromDate(data.fromDate);
    setToDate(data.toDate);
    setFilterMinSwatches(data.minSwatches);
    setFilterMonth(data.month);
    setShowFilterBar(false);
    setTimeout(() => {
      setIsMobileLoadingFilters(false);
    }, 600);
  };

  // Construct active filter pills list
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
  
  if (filterMinSwatches && filterMinSwatches !== 'all') {
    activePills.push({
      id: 'min-swatches',
      label: `Min Swatches: ${filterMinSwatches}+`,
      onDismiss: () => setFilterMinSwatches('all')
    });
  }
  
  if (filterMonth && filterMonth !== 'all') {
    activePills.push({
      id: 'month-group',
      label: `Month: ${filterMonth === '06' ? 'June 2026' : 'July 2026'}`,
      onDismiss: () => setFilterMonth('all')
    });
  }

  return (
    <div className={`flex flex-col overflow-hidden h-full ${selectedBatchId ? 'hidden md:flex border-r border-slate-200/80 bg-white p-0' : 'p-0'}`}>
      
      <div className="flex flex-col shrink-0">
        <BatchDirectoryHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showFilterBar={showFilterBar}
          setShowFilterBar={setShowFilterBar}
          filterMinSwatches={filterMinSwatches}
          setFilterMinSwatches={setFilterMinSwatches}
          filterMonth={filterMonth}
          setFilterMonth={setFilterMonth}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigate={onNavigate}
          isSplitView={!!selectedBatchId}
          sortField={sortField}
          setSortField={setSortField}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          selectedVendors={selectedVendors}
          setSelectedVendors={setSelectedVendors}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          resetFilters={resetFilters}
        />

        {/* Mobile Filter Drawer Overlay */}
        <BatchMobileFilterDrawer
          isOpen={showFilterBar}
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
          onApply={handleMobileApply}
        />

        {/* Desktop ONLY: active filter tracking strip */}
        {activePills.length > 0 && (
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
        )}
      </div>

      <div className={`flex-1 flex flex-col min-h-0 relative ${selectedBatchId ? 'p-0 overflow-hidden' : 'p-3 md:p-0 md:mt-3 overflow-y-auto md:overflow-hidden'}`}>
        {/* Active Filter Refreshing Loading Overlay */}
        {isMobileLoadingFilters && (
          <div className="absolute inset-0 z-40 bg-white/80 flex flex-col items-center justify-center animate-in fade-in duration-150">
            <div className="flex flex-col items-center gap-2">
              <span className="size-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Refreshing data...</span>
            </div>
          </div>
        )}
        {sortedBatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4 shadow-inner">
              <Folder className="size-10" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No Batches Located</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting search rules.</p>
            <Button onClick={resetFilters} className="mt-4 px-3 py-1 bg-white border border-slate-200 rounded text-xs">
              Reset
            </Button>
          </div>
        ) : (
          <>
            {/* DESKTOP VIEWPORT: ULTRA-COMPACT TABULAR GRID VIEW */}
            <BatchDesktopGrid
              sortedBatches={sortedBatches}
              activeTab={activeTab}
              handleSort={handleSort}
              getSortIcon={getSortIcon}
              onResumeDraft={onResumeDraft}
              selectedBatchId={selectedBatchId}
              onSelectBatch={setSelectedBatchId}
            />

            {/* MOBILE VIEWPORT: STACKED CARD VIEW */}
            <BatchMobileStack
              sortedBatches={sortedBatches}
              activeTab={activeTab}
              onResumeDraft={onResumeDraft}
              selectedBatchId={selectedBatchId}
              onSelectBatch={setSelectedBatchId}
            />
          </>
        )}
      </div>
    </div>
  );
}
