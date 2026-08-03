/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import SwatchCard from './SwatchCard';
import { 
  saveBatch, 
  saveSwatch, 
  deleteSwatch, 
  resolveBatchSwatches 
} from '../../services/swatchServices';

// Modular sub-components
import BatchDetailsViewHeader from './BatchDetailsViewHeader';
import BatchDetailsViewRenameModal from './BatchDetailsViewRenameModal';
import EnquirySkeletonCard from '../customer/EnquirySkeletonCard';

export function BatchSwatchSkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs animate-pulse flex flex-col w-full">
      {/* Image Skeleton */}
      <div
        className="w-full bg-slate-200 border-b border-slate-100"
        style={{ aspectRatio: '3/4' }}
      />
      {/* Details Skeleton */}
      <div className="px-3 pt-1.5 pb-2 flex-1 flex flex-col justify-between gap-1.5 bg-white">
        <div className="space-y-1">
          {/* Row 1: Vendor Name & Quantity */}
          <div className="flex items-center justify-between gap-2 h-[14px]">
            <div className="h-2.5 bg-slate-200 rounded-xs w-2/3" />
            <div className="h-2.5 bg-slate-200/70 rounded-xs w-1/4" />
          </div>
          {/* Row 2: Vendor SKU & Structure */}
          <div className="flex items-center justify-between gap-2 h-[14px]">
            <div className="h-2 bg-slate-200/60 rounded-xs w-1/2" />
            <div className="h-2 bg-slate-200/50 rounded-xs w-1/3" />
          </div>
          {/* Row 3: Material Content */}
          <div className="flex items-center h-[14px]">
            <div className="h-2 bg-slate-200/50 rounded-xs w-4/5" />
          </div>
          {/* Row 4: SKU ID Badge */}
          <div className="flex items-center h-[14px] pt-0.5">
            <div className="h-2.5 bg-indigo-100/80 rounded-xs w-2/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BatchDetailsView({
  batchId,
  batches = [],
  swatches = [],
  onClose,
  onRefresh,
  activeTab,
  isBulkEditMode = false,
  setIsBulkEditMode = () => {},
  selectedSwatchIds = [],
  setSelectedSwatchIds = () => {},
  isSavingBulk = false,
  isSavingSingle = false,
  isDeletingBulk = false,
  isDeletingSingle = false,
  editingSwatchId = null,
  onEditSwatch = () => {},
  viewingSwatchId = null,
  setViewingSwatchId = () => {}
}) {
  const batch = batches.find(b => b.id === batchId);
  const resolvedSwatches = resolveBatchSwatches(batch, swatches);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileEditingSwatchId, setMobileEditingSwatchId] = useState(null);
  const [deletingSwatchId, setDeletingSwatchId] = useState(null);

  useEffect(() => {
    setMobileEditingSwatchId(null);
  }, [batchId]);

  const isEditingAnySwatchOnMobile = isMobile && mobileEditingSwatchId !== null;

  useEffect(() => {
    if (isEditingAnySwatchOnMobile) {
      document.body.classList.add('mobile-swatch-editing');
    } else {
      document.body.classList.remove('mobile-swatch-editing');
    }
    return () => {
      document.body.classList.remove('mobile-swatch-editing');
    };
  }, [isEditingAnySwatchOnMobile]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Name editing states
  const [isEditingName, setIsEditingName] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Print simulation states
  const [isPrinting, setIsPrinting] = useState(false);

  // Pane simulated loading state for UI
  const [isPaneLoading, setIsPaneLoading] = useState(true);

  useEffect(() => {
    if (batchId) {
      setIsPaneLoading(true);
      const timer = setTimeout(() => {
        setIsPaneLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [batchId]);

  const viewingSwatch = resolvedSwatches.find(s => s.id === viewingSwatchId);

  useEffect(() => {
    if (batch) {
      setNewBatchName(batch.name);
    }
  }, [batchId, batch]);

  if (!batch) {
    return (
      <div className="p-4 text-center text-slate-500 font-mono text-xs">
        No Batch Selected or Found
      </div>
    );
  }

  const handleEditNameSave = async (e) => {
    if (e) e.preventDefault();
    if (!newBatchName.trim()) return;
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    if (isDesktop) {
      setIsSavingName(true);
      try {
        await saveBatch({ ...batch, name: newBatchName });
        await onRefresh(false, true);
        setIsEditingName(false);
      } catch (err) {
        console.error('[DETAILS] Desktop name update failed:', err);
      } finally {
        setIsSavingName(false);
      }
    } else {
      setIsSavingName(true);
      try {
        await saveBatch({ ...batch, name: newBatchName });
        await onRefresh(true);
        setIsEditingName(false);
        setShowMobileModal(false);
      } catch (err) {
        console.error('[DETAILS] Name update failed:', err);
      } finally {
        setIsSavingName(false);
      }
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPrinting(false);
    alert(`Success: Print job for batch "${batch.name}" sent to printer queue!`);
  };

  const handleToggleSelectSwatch = (swatchId) => {
    setSelectedSwatchIds(prev => {
      if (prev.includes(swatchId)) {
        return prev.filter(id => id !== swatchId);
      } else {
        return [...prev, swatchId];
      }
    });
  };

  const handleSaveSwatchInline = async (swatchId, updatedData) => {
    await saveSwatch(updatedData);
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
    await onRefresh(!isDesktop);
  };

  const handleDeleteSwatchInline = async (swatchId) => {
    setDeletingSwatchId(swatchId);
    try {
      await deleteSwatch(swatchId);
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
      await onRefresh(!isDesktop);
    } catch (err) {
      console.error('[BATCH] Delete swatch inline failed:', err);
    } finally {
      setDeletingSwatchId(null);
    }
  };

  return (
    <div id="batch-details-overlay" className="flex-1 flex flex-col bg-slate-50 relative h-full overflow-y-auto md:overflow-hidden">
      <BatchDetailsViewHeader
        batch={batch}
        resolvedSwatchesLength={resolvedSwatches.length}
        isEditingName={isEditingName}
        setIsEditingName={setIsEditingName}
        newBatchName={newBatchName}
        setNewBatchName={setNewBatchName}
        isSavingName={isSavingName}
        isSavingBulk={isSavingBulk}
        handleEditNameSave={handleEditNameSave}
        isEditingAnySwatchOnMobile={isEditingAnySwatchOnMobile}
        setShowMobileModal={setShowMobileModal}
        viewingSwatchId={viewingSwatchId}
        editingSwatchId={editingSwatchId}
        isBulkEditMode={isBulkEditMode}
        setIsBulkEditMode={setIsBulkEditMode}
        setSelectedSwatchIds={setSelectedSwatchIds}
        handlePrint={handlePrint}
        isPrinting={isPrinting}
        onClose={onClose}
        resolvedSwatches={resolvedSwatches}
        selectedSwatchIds={selectedSwatchIds}
        isPaneLoading={isPaneLoading}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-y-visible md:overflow-hidden min-h-0 relative">
        {isPaneLoading ? (
          <div className="flex-1 overflow-y-visible md:overflow-y-auto p-3">
            <div 
              className="grid justify-between gap-3"
              style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 200px))' }}
            >
              {Array.from({ length: Math.max(resolvedSwatches.length || 6, 4) }).map((_, idx) => (
                isMobile ? (
                  <EnquirySkeletonCard key={idx} />
                ) : (
                  <BatchSwatchSkeletonCard key={idx} />
                )
              ))}
            </div>
          </div>
        ) : viewingSwatch ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-100 relative overflow-hidden">
            <button
              onClick={() => setViewingSwatchId(null)}
              className="absolute top-4 right-4 z-10 bg-white/95 hover:bg-white text-slate-700 font-bold text-xs md:text-[10px] uppercase tracking-wider px-4 md:px-3 h-11 md:h-7 rounded-md border border-slate-200 shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <X className="size-5 md:size-3.5" />
              <span>Back to Grid</span>
            </button>

            <div 
              className="max-w-full max-h-[calc(100vh-180px)] rounded-lg shadow-xl overflow-hidden border border-slate-200/50 flex items-center justify-center transition-all bg-white"
              style={{
                aspectRatio: viewingSwatch.aspectRatio ? viewingSwatch.aspectRatio.replace(':', '/') : '3/4',
                background: !viewingSwatch.image || viewingSwatch.image.startsWith('linear-gradient') || viewingSwatch.image.startsWith('radial-gradient') || viewingSwatch.image.startsWith('#') ? (viewingSwatch.image || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)') : undefined,
                width: '100%',
                maxWidth: '520px'
              }}
            >
              {viewingSwatch.image && !(viewingSwatch.image.startsWith('linear-gradient') || viewingSwatch.image.startsWith('radial-gradient') || viewingSwatch.image.startsWith('#')) && (
                <button 
                  type="button"
                  className="w-full h-full outline-none flex items-center justify-center bg-transparent border-none p-0 m-0 cursor-pointer active:scale-[0.98] active:opacity-90 md:active:scale-100 md:active:opacity-100 transition-all duration-200 group/imgbtn relative"
                  onClick={(e) => {
                    if (window.innerWidth < 768) {
                      e.stopPropagation();
                      e.preventDefault();
                      const event = new CustomEvent('show-mobile-image-overlay', {
                        detail: {
                          src: viewingSwatch.image,
                          id: viewingSwatch.id
                        }
                      });
                      window.dispatchEvent(event);
                    }
                  }}
                >
                  <img 
                    src={viewingSwatch.image} 
                    alt={`Swatch ${viewingSwatch.id}`} 
                    className="w-full h-full object-contain max-h-full max-w-full select-none block"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 md:hidden flex items-center justify-center transition-colors">
                    <div className="bg-slate-900/40 backdrop-blur-sm p-2 rounded-full border border-white/20 shadow-lg opacity-80 active:opacity-100 active:scale-95 transition-all">
                      <ZoomIn className="size-5 text-white drop-shadow-md" />
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div className="mt-4 text-center">
              <span className="font-mono text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs">
                {viewingSwatch.id}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-visible md:overflow-y-auto p-3">
            {resolvedSwatches.length === 0 ? (
              <div className="py-20 text-center text-slate-400 font-mono text-xs">
                This batch has no registered fabric swatches.
              </div>
            ) : (
              <div 
                className={`grid justify-between gap-3 ${editingSwatchId ? 'pointer-events-none' : ''}`}
                style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 200px))' }}
              >
                {(isEditingAnySwatchOnMobile ? resolvedSwatches.filter(s => s.id === mobileEditingSwatchId) : resolvedSwatches).map(swatch => (
                  <SwatchCard
                    key={swatch.id}
                    swatch={swatch}
                    isBulkEditMode={isBulkEditMode}
                    isSelected={selectedSwatchIds.includes(swatch.id)}
                    isCurrentlyEditing={editingSwatchId === swatch.id}
                    onToggleSelect={() => handleToggleSelectSwatch(swatch.id)}
                    onSave={handleSaveSwatchInline}
                    onDelete={handleDeleteSwatchInline}
                    onView={() => setViewingSwatchId(swatch.id)}
                    onEdit={onEditSwatch}
                    onMobileEditStateChange={(swatchId, isEditing) => {
                      setMobileEditingSwatchId(isEditing ? swatchId : null);
                    }}
                    isSavingBulk={isSavingBulk}
                    isSavingSingle={isSavingSingle}
                    isDeletingBulk={isDeletingBulk}
                    isDeletingSingle={deletingSwatchId === swatch.id || isDeletingSingle}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BatchDetailsViewRenameModal
        showMobileModal={showMobileModal}
        setShowMobileModal={setShowMobileModal}
        isSavingName={isSavingName}
        newBatchName={newBatchName}
        setNewBatchName={setNewBatchName}
        batchName={batch.name}
        handleEditNameSave={handleEditNameSave}
      />
    </div>
  );
}
