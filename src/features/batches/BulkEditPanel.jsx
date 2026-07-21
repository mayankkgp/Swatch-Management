/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

// Imported modular sub-components
import BulkEditPanelViewSection from './BulkEditPanelViewSection';
import BulkEditPanelFormSection from './BulkEditPanelFormSection';
import BulkEditPanelFooterActions from './BulkEditPanelFooterActions';
import BulkEditPanelDeleteConfirmModal from './BulkEditPanelDeleteConfirmModal';

export default function BulkEditPanel({
  selectedCount,
  editingSwatch, // Single swatch details if we are in single edit mode
  isViewOnly = false,
  onSave,
  onDiscard,
  onDelete,
  isSaving = false,
  onEdit,
  onView,
  batches = []
}) {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorSku: '',
    quantity: '',
    unit: 'yd',
    content: '',
    structure: '',
    image: ''
  });

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editingSwatch) {
      setFormData({
        vendorName: editingSwatch.vendorName || '',
        vendorSku: editingSwatch.vendorSku || '',
        quantity: editingSwatch.quantity || '',
        unit: editingSwatch.unit || 'yd',
        content: editingSwatch.content || '',
        structure: editingSwatch.structure || '',
        image: editingSwatch.image || ''
      });
    } else {
      setFormData({
        vendorName: '',
        vendorSku: '',
        quantity: '',
        unit: 'yd',
        content: '',
        structure: '',
        image: ''
      });
    }
  }, [editingSwatch]);

  const adjustHeight = (el) => {
    if (!el) return;
    el.style.height = '32px';
    const scrollHeight = el.scrollHeight;
    const calculatedHeight = Math.max(32, Math.min(scrollHeight, 68));
    el.style.height = `${calculatedHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current);
    }
  }, [formData.content]);

  const handleInputChange = (field, value) => {
    if (isViewOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContentChange = (e) => {
    if (isViewOnly) return;
    const val = e.target.value;
    handleInputChange('content', val);
    adjustHeight(e.target);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (isViewOnly) return;
    
    if (editingSwatch) {
      onSave(formData);
    } else {
      const modifiedFields = {};
      if (formData.vendorName !== '') modifiedFields.vendorName = formData.vendorName;
      if (formData.structure !== '') modifiedFields.structure = formData.structure;
      if (formData.content !== '') modifiedFields.content = formData.content;
      onSave(modifiedFields);
    }
  };

  const selectClass = "appearance-none w-full text-xs bg-slate-50 md:bg-white hover:bg-slate-100/70 md:hover:bg-white focus:bg-white rounded border border-slate-200 md:border-slate-300 md:hover:border-slate-400 focus:outline-hidden focus:border-slate-400 text-slate-800 md:text-slate-900 md:placeholder:text-slate-600 md:placeholder:italic md:placeholder:text-[11px] placeholder:text-slate-500 transition-all duration-150 font-sans cursor-pointer py-1 px-1 md:h-8 md:py-0 md:pl-2 md:pr-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:md:bg-slate-100 disabled:md:text-slate-500 disabled:md:border-slate-200 disabled:md:placeholder:text-slate-400/70";
  const inputClass = "w-full text-xs bg-slate-50 md:bg-white hover:bg-slate-100/70 md:hover:bg-white focus:bg-white rounded border border-slate-200 md:border-slate-300 md:hover:border-slate-400 focus:outline-hidden focus:border-slate-400 text-slate-800 md:text-slate-900 md:placeholder:text-slate-600 md:placeholder:italic md:placeholder:text-[11px] placeholder:text-slate-500 transition-all duration-150 font-sans py-1 px-1 md:h-8 md:py-0 md:px-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:md:bg-slate-100 disabled:md:text-slate-500 disabled:md:border-slate-200 disabled:md:placeholder:text-slate-400/70";
  const textareaClass = "w-full text-xs bg-slate-50 md:bg-white hover:bg-slate-100/70 md:hover:bg-white focus:bg-white rounded border border-slate-200 md:border-slate-300 md:hover:border-slate-400 focus:outline-hidden focus:border-slate-400 text-slate-800 md:text-slate-900 md:placeholder:text-slate-600 md:placeholder:italic md:placeholder:text-[11px] placeholder:text-slate-500 transition-all duration-150 font-sans py-1 px-1 md:px-2 md:py-1.5 resize-none overflow-y-auto min-h-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:md:bg-slate-100 disabled:md:text-slate-500 disabled:md:border-slate-200 disabled:md:placeholder:text-slate-400/70";

  const isDisabled = selectedCount === 0 || isSaving || isViewOnly;

  const parentBatch = (batches && editingSwatch)
    ? batches.find(b => b.swatchIds && b.swatchIds.includes(editingSwatch.id))
    : null;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-white text-slate-800 border-r border-slate-200">
      {isSaving && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center gap-3">
          <span className="size-6 border-2 border-slate-800 border-t-slate-400 rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-wider text-slate-600">Applying changes...</span>
        </div>
      )}

      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50 md:h-10 md:py-0">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-mono font-bold uppercase text-slate-700 leading-tight">
            {isViewOnly ? 'Swatch Details' : (editingSwatch ? 'Edit Swatch' : 'Bulk Edit')}
          </h2>
          {!isViewOnly && !editingSwatch && (
            <span className="text-[10px] font-mono text-slate-500 leading-none">
              {selectedCount} selected
            </span>
          )}
        </div>
        <button
          onClick={onDiscard}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-slate-200/50 rounded cursor-pointer"
          title="Close Sidebar"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form Fields / Read Only Area */}
      {isViewOnly ? (
        <BulkEditPanelViewSection
          editingSwatch={editingSwatch}
          parentBatch={parentBatch}
          formData={formData}
        />
      ) : (
        <BulkEditPanelFormSection
          handleSave={handleSave}
          editingSwatch={editingSwatch}
          isDisabled={isDisabled}
          formData={formData}
          handleInputChange={handleInputChange}
          selectClass={selectClass}
          inputClass={inputClass}
          textareaClass={textareaClass}
          textareaRef={textareaRef}
          handleContentChange={handleContentChange}
          isViewOnly={isViewOnly}
          onView={onView}
        />
      )}

      {/* Footer Buttons */}
      <BulkEditPanelFooterActions
        isViewOnly={isViewOnly}
        onEdit={onEdit}
        editingSwatch={editingSwatch}
        onDiscard={onDiscard}
        isSaving={isSaving}
        handleSave={handleSave}
        isDisabled={isDisabled}
        setShowConfirmDelete={setShowConfirmDelete}
      />

      <BulkEditPanelDeleteConfirmModal
        showConfirmDelete={showConfirmDelete}
        setShowConfirmDelete={setShowConfirmDelete}
        editingSwatch={editingSwatch}
        selectedCount={selectedCount}
        onDelete={onDelete}
      />
    </div>
  );
}
