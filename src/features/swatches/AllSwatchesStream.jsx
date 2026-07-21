/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { saveSwatch, deleteSwatch, deleteSwatchesBulk } from '../../services/swatchServices';

import AllSwatchesStreamHeader from './AllSwatchesStreamHeader';
import AllSwatchesStreamSort from './AllSwatchesStreamSort';
import AllSwatchesStreamPagination from './AllSwatchesStreamPagination';
import BulkDeleteConfirmModal from './BulkDeleteConfirmModal';
import AllSwatchesMobileFilterDrawer from './AllSwatchesMobileFilterDrawer';
import AllSwatchesMobileBulkFooter from './AllSwatchesMobileBulkFooter';
import AllSwatchesStreamSidebar from './AllSwatchesStreamSidebar';
import AllSwatchesStreamGrid from './AllSwatchesStreamGrid';
import AllSwatchesActiveFilters from './AllSwatchesActiveFilters';
import useProcessedSwatches from './useProcessedSwatches';

export default function AllSwatchesStream({ 
  batches = [], 
  swatches = [], 
  onRefresh, 
  onNavigate 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [structureFilter, setStructureFilter] = useState('all');
  const [sortField, setSortField] = useState('none');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [showSortBar, setShowSortBar] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isMobileLoadingFilters, setIsMobileLoadingFilters] = useState(false);
  const [editingSwatchId, setEditingSwatchId] = useState(null);
  const [isSavingSingle, setIsSavingSingle] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [viewingSwatchId, setViewingSwatchId] = useState(null);
  const viewingSwatch = swatches.find(s => s.id === viewingSwatchId);
  const [mobileEditingSwatchId, setMobileEditingSwatchId] = useState(null);
  const isEditingAnySwatchOnMobile = isMobile && mobileEditingSwatchId !== null;

  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [selectedSwatchIds, setSelectedSwatchIds] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsBulkEditMode(p => !p);
    window.addEventListener('toggle-all-swatches-bulk-edit', handleToggle);
    return () => window.removeEventListener('toggle-all-swatches-bulk-edit', handleToggle);
  }, []);

  useEffect(() => {
    if (!isBulkEditMode) setSelectedSwatchIds([]);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('all-swatches-bulk-edit-changed', { detail: isBulkEditMode }));
    }, 0);
  }, [isBulkEditMode]);

  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const effectiveItemsPerPage = isMobile ? 50 : itemsPerPage;

  const { processedSwatches, getBatchInfo } = useProcessedSwatches({
    swatches, batches, searchTerm, structureFilter, selectedVendors, fromDate, toDate, sortField
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, structureFilter, sortField, effectiveItemsPerPage]);

  const totalItems = processedSwatches.length;
  const totalPages = Math.ceil(totalItems / effectiveItemsPerPage) || 1;
  const startIndex = (currentPage - 1) * effectiveItemsPerPage;
  const endIndex = Math.min(startIndex + effectiveItemsPerPage, totalItems);
  const paginatedSwatches = processedSwatches.slice(startIndex, endIndex);

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageInputChange = (e) => {
    const valStr = e.target.value;
    setPageInput(valStr);
    const parsed = parseInt(valStr, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) setCurrentPage(parsed);
  };

  const handlePageInputBlur = () => {
    const parsed = parseInt(pageInput, 10);
    if (isNaN(parsed) || parsed < 1) {
      setCurrentPage(1);
      setPageInput('1');
    } else if (parsed > totalPages) {
      setCurrentPage(totalPages);
      setPageInput(String(totalPages));
    } else {
      setCurrentPage(parsed);
      setPageInput(String(parsed));
    }
  };

  const handleToggleSelectSwatch = (swatchId) => {
    setSelectedSwatchIds(prev => prev.includes(swatchId) ? prev.filter(id => id !== swatchId) : [...prev, swatchId]);
  };

  const handleSaveInline = async (swatchId, updatedData) => {
    await saveSwatch(updatedData);
    await onRefresh();
  };

  const handleDeleteInline = async (swatchId) => {
    await deleteSwatch(swatchId);
    await onRefresh();
  };

  const handleSaveSingle = async (modifiedFields) => {
    setIsSavingSingle(true);
    try {
      const swatchToUpdate = swatches.find(s => s.id === editingSwatchId);
      if (swatchToUpdate) await saveSwatch({ ...swatchToUpdate, ...modifiedFields });
      setEditingSwatchId(null);
      setViewingSwatchId(null);
      await onRefresh();
    } catch (err) {
      console.error('[STREAM] Single update failed:', err);
    } finally {
      setIsSavingSingle(false);
    }
  };

  const handleDeleteSingle = async () => {
    setIsSavingSingle(true);
    try {
      await deleteSwatch(editingSwatchId);
      setEditingSwatchId(null);
      setViewingSwatchId(null);
      await onRefresh();
    } catch (err) {
      console.error('[STREAM] Single delete failed:', err);
    } finally {
      setIsSavingSingle(false);
    }
  };

  const handleDeleteBulk = async () => {
    setIsDeletingBulk(true);
    try {
      await deleteSwatchesBulk(selectedSwatchIds);
      setSelectedSwatchIds([]);
      setIsBulkEditMode(false);
      setShowBulkDeleteModal(false);
      await onRefresh();
    } catch (err) {
      console.error('[STREAM] Bulk delete failed:', err);
    } finally {
      setIsDeletingBulk(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStructureFilter('all');
    setSelectedVendors([]);
    setFromDate('');
    setToDate('');
    setSortField('none');
  };

  return (
    <div id="all-swatches-workspace" className="flex-1 flex flex-col bg-slate-50 text-slate-800 h-full overflow-hidden">
      <div className={`flex-1 min-h-0 overflow-hidden relative ${editingSwatchId || viewingSwatchId ? 'grid grid-cols-1 md:grid-cols-[210px_1fr] gap-0 md:gap-3' : 'flex'}`}>
        
        <AllSwatchesStreamSidebar
          isEditingOrViewing={!!(editingSwatchId || viewingSwatchId)}
          editingSwatchId={editingSwatchId}
          viewingSwatchId={viewingSwatchId}
          swatches={swatches}
          batches={batches}
          isSavingSingle={isSavingSingle}
          handleSaveSingle={handleSaveSingle}
          handleDeleteSingle={handleDeleteSingle}
          setEditingSwatchId={setEditingSwatchId}
          setViewingSwatchId={setViewingSwatchId}
        />

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50">
          {!(isMobile && (isBulkEditMode || isEditingAnySwatchOnMobile)) && (
            <AllSwatchesStreamHeader
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showFilterBar={showFilterBar}
              setShowFilterBar={setShowFilterBar}
              showSortBar={showSortBar}
              setShowSortBar={setShowSortBar}
              structureFilter={structureFilter}
              setStructureFilter={setStructureFilter}
              sortField={sortField}
              editingSwatchId={editingSwatchId}
              onNavigate={onNavigate}
              isBulkEditMode={isBulkEditMode}
              setIsBulkEditMode={setIsBulkEditMode}
              setSelectedSwatchIds={setSelectedSwatchIds}
              selectedSwatchIds={selectedSwatchIds}
              selectedVendors={selectedVendors}
              setSelectedVendors={setSelectedVendors}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              resetFilters={resetFilters}
            />
          )}

          <AllSwatchesMobileFilterDrawer
            isOpen={showFilterBar}
            onClose={() => setShowFilterBar(false)}
            selectedVendors={selectedVendors}
            setSelectedVendors={setSelectedVendors}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            structureFilter={structureFilter}
            setStructureFilter={setStructureFilter}
            onApply={(data) => {
              setIsMobileLoadingFilters(true);
              setSelectedVendors(data.vendors);
              setFromDate(data.fromDate);
              setToDate(data.toDate);
              setStructureFilter(data.structure);
              setShowFilterBar(false);
              setTimeout(() => setIsMobileLoadingFilters(false), 600);
            }}
          />

          <AllSwatchesActiveFilters
            selectedVendors={selectedVendors}
            setSelectedVendors={setSelectedVendors}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            structureFilter={structureFilter}
            setStructureFilter={setStructureFilter}
          />

          <AllSwatchesStreamSort
            showSortBar={showSortBar}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />

          <AllSwatchesStreamGrid
            isMobileLoadingFilters={isMobileLoadingFilters}
            viewingSwatch={viewingSwatch}
            setViewingSwatchId={setViewingSwatchId}
            paginatedSwatches={paginatedSwatches}
            resetFilters={resetFilters}
            editingSwatchId={editingSwatchId}
            isMobile={isMobile}
            isEditingAnySwatchOnMobile={isEditingAnySwatchOnMobile}
            mobileEditingSwatchId={mobileEditingSwatchId}
            isBulkEditMode={isBulkEditMode}
            selectedSwatchIds={selectedSwatchIds}
            handleToggleSelectSwatch={handleToggleSelectSwatch}
            handleSaveInline={handleSaveInline}
            handleDeleteInline={handleDeleteInline}
            getBatchInfo={getBatchInfo}
            setEditingSwatchId={setEditingSwatchId}
            setMobileEditingSwatchId={setMobileEditingSwatchId}
            totalItems={totalItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            pageInput={pageInput}
            handlePageInputChange={handlePageInputChange}
            handlePageInputBlur={handlePageInputBlur}
          />

          <AllSwatchesStreamPagination
            viewingSwatch={!!viewingSwatch}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
          
          <AllSwatchesMobileBulkFooter
            isBulkEditMode={isBulkEditMode}
            selectedSwatchIds={selectedSwatchIds}
            onBulkDelete={() => setShowBulkDeleteModal(true)}
            onBulkPrint={async () => {
              await new Promise(resolve => setTimeout(resolve, 1500));
              alert(`Success: Print job for ${selectedSwatchIds.length} swatches sent to printer queue!`);
            }}
          />
        </div>
      </div>
      <BulkDeleteConfirmModal
        showModal={showBulkDeleteModal}
        setShowModal={setShowBulkDeleteModal}
        isDeleting={isDeletingBulk}
        handleDelete={handleDeleteBulk}
        selectedCount={selectedSwatchIds.length}
        showCancel={!isMobile}
      />
    </div>
  );
}
