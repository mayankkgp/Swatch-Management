/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import BulkEditPanel from '../batches/BulkEditPanel';

export default function AllSwatchesStreamSidebar({
  isEditingOrViewing,
  editingSwatchId,
  viewingSwatchId,
  swatches = [],
  batches = [],
  isSavingSingle,
  handleSaveSingle,
  handleDeleteSingle,
  setEditingSwatchId,
  setViewingSwatchId
}) {
  if (!isEditingOrViewing) return null;

  return (
    <div className="absolute md:relative inset-y-0 left-0 w-[210px] md:w-full h-full min-h-0 overflow-hidden z-50 md:z-30 bg-white border-r border-slate-200 shadow-2xl md:shadow-none animate-in slide-in-from-left duration-200">
      <BulkEditPanel
        selectedCount={1}
        editingSwatch={swatches.find(s => s.id === (editingSwatchId || viewingSwatchId))}
        isViewOnly={!!viewingSwatchId && !editingSwatchId}
        onSave={handleSaveSingle}
        onDiscard={() => {
          setEditingSwatchId(null);
          setViewingSwatchId(null);
        }}
        onDelete={handleDeleteSingle}
        isSaving={isSavingSingle}
        onEdit={() => {
          setEditingSwatchId(viewingSwatchId);
          setViewingSwatchId(null);
        }}
        onView={setViewingSwatchId}
        batches={batches}
      />
    </div>
  );
}
