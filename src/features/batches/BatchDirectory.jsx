/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import BatchDetailsView from './BatchDetailsView';
import { 
  saveSwatchesBulk, 
  deleteSwatchesBulk,
  resolveBatchSwatches 
} from '../../services/swatchServices';
import BulkEditPanel from './BulkEditPanel';
import BatchDirectoryListContainer from './BatchDirectoryListContainer';

export default function BatchDirectory({ 
  batches = [], 
  swatches = [], 
  onRefresh, 
  onNavigate, 
  onResumeDraft 
}) {
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'draft'
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [filterMinSwatches, setFilterMinSwatches] = useState('all'); // 'all' | '1' | '5' | '10' | '15'
  const [filterMonth, setFilterMonth] = useState('all'); // 'all' | '06' | '07'
  
  // Custom Desktop Accordion Filters
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Sort state
  const [sortField, setSortField] = useState('id'); // 'name' | 'id' | 'date' | 'count'
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Bulk edit states
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [selectedSwatchIds, setSelectedSwatchIds] = useState([]);
  const [isSavingBulk, setIsSavingBulk] = useState(false);
  const [editingSwatchId, setEditingSwatchId] = useState(null);
  const [viewingSwatchId, setViewingSwatchId] = useState(null);

  // Reset bulk edit states when batch selection changes
  useEffect(() => {
    setIsBulkEditMode(false);
    setSelectedSwatchIds([]);
    setEditingSwatchId(null);
    setViewingSwatchId(null);
  }, [selectedBatchId]);

  // Parse batchId from URL query param to deep-link directly
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlBatchId = params.get('batchId');
    if (urlBatchId) {
      const targetBatch = batches.find(b => b.id === urlBatchId);
      if (targetBatch) {
        setSelectedBatchId(urlBatchId);
        setActiveTab(targetBatch.status || 'active');
      }
    }
  }, [batches]);

  const handleSaveSingle = async (modifiedFields) => {
    setIsSavingBulk(true);
    try {
      const swatchToUpdate = swatches.find(s => s.id === editingSwatchId);
      if (swatchToUpdate) {
        await saveSwatchesBulk([{ ...swatchToUpdate, ...modifiedFields }]);
      }
      setEditingSwatchId(null);
      setViewingSwatchId(null);
      await onRefresh();
    } catch (err) {
      console.error('[DIRECTORY] Single update failed:', err);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const handleDeleteSingle = async () => {
    setIsSavingBulk(true);
    try {
      await deleteSwatchesBulk([editingSwatchId]);
      setEditingSwatchId(null);
      setViewingSwatchId(null);
      await onRefresh();
    } catch (err) {
      console.error('[DIRECTORY] Single delete failed:', err);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const handleSaveBulk = async (modifiedFields) => {
    setIsSavingBulk(true);
    try {
      const activeBatch = batches.find(b => b.id === selectedBatchId);
      const resolvedSwatches = resolveBatchSwatches(activeBatch, swatches);
      const swatchesToUpdate = resolvedSwatches
        .filter(s => selectedSwatchIds.includes(s.id))
        .map(s => ({ ...s, ...modifiedFields }));
      
      await saveSwatchesBulk(swatchesToUpdate);
      setIsBulkEditMode(false);
      setSelectedSwatchIds([]);
      await onRefresh();
    } catch (err) {
      console.error('[DIRECTORY] Bulk update failed:', err);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const handleDeleteBulk = async () => {
    setIsSavingBulk(true);
    try {
      await deleteSwatchesBulk(selectedSwatchIds);
      setIsBulkEditMode(false);
      setSelectedSwatchIds([]);
      await onRefresh();
    } catch (err) {
      console.error('[DIRECTORY] Bulk delete failed:', err);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return 0;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return 0;
    const [day, month, year] = parts.map(Number);
    return new Date(2000 + year, month - 1, day).getTime();
  };

  const parseDDMMYY = (str) => {
    if (!str) return 0;
    if (str.includes('-') && str.split('-')[0].length === 4) {
      const parts = str.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
        return new Date(year, month - 1, day).getTime();
      }
    }
    const parts = str.split(/[\/\-]/);
    if (parts.length !== 3) return 0;
    let [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return 0;
    if (year < 100) year = 2000 + year;
    return new Date(year, month - 1, day).getTime();
  };

  let filtered = batches.filter(b => b.status === activeTab);

  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(b => 
      b.name.toLowerCase().includes(term) || 
      b.id.toLowerCase().includes(term)
    );
  }

  if (filterMinSwatches !== 'all') {
    const minCount = Number(filterMinSwatches);
    filtered = filtered.filter(b => b.swatchIds && b.swatchIds.length >= minCount);
  }

  if (filterMonth !== 'all') {
    filtered = filtered.filter(b => {
      if (!b.date) return false;
      const parts = b.date.split('-');
      return parts.length === 3 && parts[1] === filterMonth;
    });
  }

  // Filter by Selected Vendors (OR logic across batch swatches)
  if (selectedVendors && selectedVendors.length > 0) {
    filtered = filtered.filter(b => {
      if (!b.swatchIds || b.swatchIds.length === 0) return false;
      const batchSwatches = swatches.filter(s => b.swatchIds.includes(s.id));
      return batchSwatches.some(s => selectedVendors.includes(s.vendorName));
    });
  }

  // Filter by Date Range (evaluating batch creation timestamps)
  if (fromDate || toDate) {
    filtered = filtered.filter(b => {
      if (!b.date) return false;
      const t = parseDate(b.date);
      if (fromDate) {
        const fromTime = parseDDMMYY(fromDate);
        if (fromTime && t < fromTime) return false;
      }
      if (toDate) {
        const toTime = parseDDMMYY(toDate) + 86400000 - 1; // End of selected day
        if (toTime && t > toTime) return false;
      }
      return true;
    });
  }

  const sortedBatches = [...filtered].sort((a, b) => {
    let valA, valB;
    if (sortField === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sortField === 'id') {
      valA = a.id.toLowerCase();
      valB = b.id.toLowerCase();
    } else if (sortField === 'date') {
      valA = parseDate(a.date);
      valB = parseDate(b.date);
    } else if (sortField === 'count') {
      valA = a.swatchIds ? a.swatchIds.length : 0;
      valB = b.swatchIds ? b.swatchIds.length : 0;
    } else {
      valA = 0;
      valB = 0;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    // Basic standard text arrow fallback
    if (sortField !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterMinSwatches('all');
    setFilterMonth('all');
    setSelectedVendors([]);
    setFromDate('');
    setToDate('');
    setSortField('date');
    setSortDirection('desc');
  };

  return (
    <div id="batch-directory-workspace" className="flex-1 flex flex-col bg-slate-50 text-slate-800 h-full overflow-hidden">
      <div className={`flex-1 min-h-0 overflow-hidden ${selectedBatchId ? 'grid grid-cols-1 md:grid-cols-[210px_1fr] gap-0 md:gap-3' : 'flex flex-col'}`}>
        
        {(isBulkEditMode || editingSwatchId || viewingSwatchId) ? (
          <div className="absolute md:relative inset-y-0 left-0 w-[210px] md:w-full h-full z-50 md:z-30 bg-white border-r border-slate-200 shadow-2xl md:shadow-none animate-in slide-in-from-left duration-200">
            <BulkEditPanel
              selectedCount={isBulkEditMode ? selectedSwatchIds.length : 1}
              editingSwatch={swatches.find(s => s.id === (editingSwatchId || viewingSwatchId))}
              isViewOnly={!!viewingSwatchId && !editingSwatchId}
              onSave={isBulkEditMode ? handleSaveBulk : handleSaveSingle}
              onDiscard={() => {
                setIsBulkEditMode(false);
                setEditingSwatchId(null);
                setViewingSwatchId(null);
                setSelectedSwatchIds([]);
              }}
              onDelete={isBulkEditMode ? handleDeleteBulk : handleDeleteSingle}
              isSaving={isSavingBulk}
              onEdit={() => {
                setEditingSwatchId(viewingSwatchId);
                setViewingSwatchId(null);
              }}
              onView={setViewingSwatchId}
              batches={batches}
            />
          </div>
        ) : (
          <BatchDirectoryListContainer
            selectedBatchId={selectedBatchId}
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
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            resetFilters={resetFilters}
            sortedBatches={sortedBatches}
            handleSort={handleSort}
            getSortIcon={getSortIcon}
            onResumeDraft={onResumeDraft}
            setSelectedBatchId={setSelectedBatchId}
            selectedVendors={selectedVendors}
            setSelectedVendors={setSelectedVendors}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        )}

        {selectedBatchId && (
          <div className="flex-1 h-full overflow-hidden bg-slate-50">
            <BatchDetailsView
              batchId={selectedBatchId}
              batches={batches}
              swatches={swatches}
              onClose={() => setSelectedBatchId(null)}
              onRefresh={onRefresh}
              activeTab={activeTab}
              isBulkEditMode={isBulkEditMode}
              setIsBulkEditMode={(val) => {
                setIsBulkEditMode(val);
                if (val) {
                  setEditingSwatchId(null);
                  setViewingSwatchId(null);
                }
              }}
              selectedSwatchIds={selectedSwatchIds}
              setSelectedSwatchIds={setSelectedSwatchIds}
              isSavingBulk={isSavingBulk}
              editingSwatchId={editingSwatchId}
              onEditSwatch={(swatch) => {
                setEditingSwatchId(swatch.id);
                setViewingSwatchId(null);
                setIsBulkEditMode(false);
              }}
              viewingSwatchId={viewingSwatchId}
              setViewingSwatchId={(val) => {
                setViewingSwatchId(val);
                if (val && !editingSwatchId) {
                  setIsBulkEditMode(false);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
