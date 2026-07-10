/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SwatchCard from '../batches/SwatchCard';
import AllSwatchesStreamViewing from './AllSwatchesStreamViewing';
import AllSwatchesStreamEmpty from './AllSwatchesStreamEmpty';
import AllSwatchesStreamMobilePagination from './AllSwatchesStreamMobilePagination';

export default function AllSwatchesStreamGrid({
  isMobileLoadingFilters,
  viewingSwatch,
  setViewingSwatchId,
  paginatedSwatches = [],
  resetFilters,
  editingSwatchId,
  isMobile,
  isEditingAnySwatchOnMobile,
  mobileEditingSwatchId,
  isBulkEditMode,
  selectedSwatchIds = [],
  handleToggleSelectSwatch,
  handleSaveInline,
  handleDeleteInline,
  getBatchInfo,
  setEditingSwatchId,
  setMobileEditingSwatchId,
  totalItems,
  currentPage,
  setCurrentPage,
  totalPages,
  pageInput,
  handlePageInputChange,
  handlePageInputBlur
}) {
  return (
    <div className="flex-1 overflow-y-auto p-3 relative">
      {isMobileLoadingFilters && (
        <div className="absolute inset-0 z-40 bg-white/80 flex flex-col items-center justify-center animate-in fade-in duration-150">
          <div className="flex flex-col items-center gap-2">
            <span className="size-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Refreshing data...</span>
          </div>
        </div>
      )}
      
      {viewingSwatch ? (
        <AllSwatchesStreamViewing
          viewingSwatch={viewingSwatch}
          setViewingSwatchId={setViewingSwatchId}
        />
      ) : paginatedSwatches.length === 0 ? (
        <AllSwatchesStreamEmpty onClear={resetFilters} />
      ) : (
        <>
          <div 
            className={`grid justify-between gap-3 ${editingSwatchId ? 'pointer-events-none' : ''}`}
            style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 200px))' }}
          >
            {(isEditingAnySwatchOnMobile ? paginatedSwatches.filter(s => s.id === mobileEditingSwatchId) : paginatedSwatches).map(swatch => {
              const batchInfo = getBatchInfo(swatch.id);
              return (
                <SwatchCard
                  key={swatch.id}
                  swatch={swatch}
                  isBulkEditMode={isBulkEditMode}
                  isSelected={selectedSwatchIds.includes(swatch.id)}
                  onToggleSelect={(e) => {
                    e.stopPropagation();
                    handleToggleSelectSwatch(swatch.id);
                  }}
                  isCurrentlyEditing={editingSwatchId === swatch.id}
                  onSave={handleSaveInline}
                  onDelete={handleDeleteInline}
                  isAllSwatchesView={true}
                  batchName={batchInfo.name}
                  batchDate={batchInfo.date}
                  batchId={batchInfo.id}
                  onView={() => {
                    setViewingSwatchId(swatch.id);
                    setEditingSwatchId(null);
                  }}
                  onEdit={(sw) => {
                    setEditingSwatchId(sw.id);
                    setViewingSwatchId(null);
                  }}
                  onMobileEditStateChange={(swatchId, isEditing) => {
                    setMobileEditingSwatchId(isEditing ? swatchId : null);
                  }}
                />
              );
            })}
          </div>

          <AllSwatchesStreamMobilePagination
            totalItems={totalItems}
            isEditingAnySwatchOnMobile={isEditingAnySwatchOnMobile}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            pageInput={pageInput}
            handlePageInputChange={handlePageInputChange}
            handlePageInputBlur={handlePageInputBlur}
          />
        </>
      )}
    </div>
  );
}
