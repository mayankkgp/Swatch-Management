/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SwatchCard from '../batches/SwatchCard';

export default function SwatchReviewGrid({
  isMobile,
  isEditingAnySwatchOnMobile,
  reviewSwatches,
  mobileEditingSwatchId,
  isBulkEditMode,
  selectedSwatchIds,
  editingSwatchId,
  handleToggleSelectSwatch,
  handleSaveSwatchInline,
  handleDeleteSwatchInline,
  setViewingSwatchId,
  setEditingSwatchId,
  setIsBulkEditMode,
  setMobileEditingSwatchId
}) {
  const displayedSwatches = isEditingAnySwatchOnMobile 
    ? reviewSwatches.filter(s => s.id === mobileEditingSwatchId) 
    : reviewSwatches;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-3 bg-white md:bg-slate-50 relative">
      <div 
        className={`grid justify-between gap-3 ${editingSwatchId ? 'pointer-events-none' : ''}`}
        style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 200px))' }}
      >
        {displayedSwatches.map(swatch => (
          <SwatchCard 
            key={swatch.id} 
            swatch={swatch} 
            isBulkEditMode={isBulkEditMode}
            isSelected={selectedSwatchIds.includes(swatch.id)}
            isCurrentlyEditing={editingSwatchId === swatch.id}
            onToggleSelect={() => handleToggleSelectSwatch(swatch.id)}
            onSave={(swatchId, data) => handleSaveSwatchInline(swatchId, data)}
            onDelete={() => handleDeleteSwatchInline(swatch.id)}
            onView={() => {
              setViewingSwatchId(swatch.id);
              setEditingSwatchId(null);
              setIsBulkEditMode(false);
            }}
            onEdit={() => {
              setEditingSwatchId(swatch.id);
              setViewingSwatchId(null);
              setIsBulkEditMode(false);
            }}
            onMobileEditStateChange={(swatchId, isEditing) => {
              setMobileEditingSwatchId(isEditing ? swatchId : null);
            }}
          />
        ))}
      </div>
    </div>
  );
}
