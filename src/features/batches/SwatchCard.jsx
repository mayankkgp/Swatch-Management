/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import SwatchCardImageSection from './SwatchCardImageSection';
import SwatchCardEditForm from './SwatchCardEditForm';
import SwatchCardDisplaySection from './SwatchCardDisplaySection';
import SwatchCardDeleteOverlay from './SwatchCardDeleteOverlay';
import useSwatchDeleteCountdown from './useSwatchDeleteCountdown';
import { getFilteredVendorNames, getFilteredStructures } from './swatchCardUtils';

export default function SwatchCard({
  swatch,
  isBulkEditMode = false,
  isSelected = false,
  isCurrentlyEditing = false,
  onToggleSelect,
  onSave,
  onDelete,
  isAllSwatchesView = false,
  batchName = '',
  batchDate = '',
  batchId = null,
  onView,
  onEdit,
  onMobileEditStateChange
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...swatch });
  const [isSaving, setIsSaving] = useState(false);
  const [vendorSearchFocused, setVendorSearchFocused] = useState(false);
  const [structureSearchFocused, setStructureSearchFocused] = useState(false);
  const [showImageSourcePicker, setShowImageSourcePicker] = useState(false);
  const imageSourcePickerRef = useRef(null);

  useEffect(() => {
    if (!showImageSourcePicker) return;

    const handleClickOutside = (e) => {
      if (imageSourcePickerRef.current && !imageSourcePickerRef.current.contains(e.target)) {
        setShowImageSourcePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showImageSourcePicker]);

  const filteredVendorNames = getFilteredVendorNames(formData.vendorName);
  const filteredStructures = getFilteredStructures(formData.structure);

  const handleImagePicked = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setShowImageSourcePicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const changeEditingState = (val) => {
    setIsEditing(val);
    if (onMobileEditStateChange) {
      onMobileEditStateChange(swatch.id, val);
    }
  };

  const {
    showDeleteConfirm,
    countdownProgress,
    startDeleteCountdown,
    cancelDeleteCountdown,
    triggerDelete
  } = useSwatchDeleteCountdown(onDelete, swatch.id, setIsSaving);

  // Sync state if swatch prop updates
  useEffect(() => {
    setFormData({ ...swatch });
  }, [swatch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(swatch.id, formData);
      changeEditingState(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setFormData({ ...swatch });
    changeEditingState(false);
  };

  return (
    <div 
      className={`group relative bg-white rounded-lg ${isEditing ? 'overflow-visible' : 'overflow-hidden'} transition-all duration-200 flex ${isEditing ? 'flex-col' : 'flex-row'} md:flex-col items-start md:items-stretch cursor-default md:cursor-pointer ${
        isEditing
          ? 'border border-slate-200 shadow-2xs md:border-indigo-600 md:ring-2 md:ring-indigo-600/30 md:shadow-md'
          : isCurrentlyEditing
            ? 'border border-indigo-600 ring-2 ring-indigo-600/30 shadow-md bg-indigo-50/5'
            : isSelected 
              ? 'border border-indigo-500 ring-1 ring-indigo-500/30 shadow-md' 
              : 'border border-slate-200 hover:border-slate-300 shadow-2xs'
      }`}
      onClick={(e) => {
        const closestBtn = e.target.closest('button');
        if (closestBtn && !closestBtn.classList.contains('js-swatch-image-btn')) {
          return;
        }
        if (e.target.closest('input') || e.target.closest('select') || e.target.closest('label')) {
          return;
        }
        if (window.innerWidth < 768 && !isBulkEditMode) {
          return;
        }
        if (isBulkEditMode) {
          onToggleSelect(e);
        } else if (onView) {
          onView();
        }
      }}
    >
      <SwatchCardImageSection
        swatch={swatch}
        isEditing={isEditing}
        showImageSourcePicker={showImageSourcePicker}
        setShowImageSourcePicker={setShowImageSourcePicker}
        imageSourcePickerRef={imageSourcePickerRef}
        handleImagePicked={handleImagePicked}
        isBulkEditMode={isBulkEditMode}
        isSelected={isSelected}
        onToggleSelect={onToggleSelect}
        isAllSwatchesView={isAllSwatchesView}
        batchId={batchId}
        changeEditingState={changeEditingState}
        onEdit={onEdit}
        startDeleteCountdown={startDeleteCountdown}
      />

      <SwatchCardDeleteOverlay
        isMobileOnly={true}
        isEditing={isEditing}
        showDeleteConfirm={showDeleteConfirm}
        countdownProgress={countdownProgress}
        triggerDelete={triggerDelete}
        cancelDeleteCountdown={cancelDeleteCountdown}
        startDeleteCountdown={startDeleteCountdown}
      />

      {isSaving && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex items-center justify-center">
          <span className="size-4 rounded-full border-2 border-slate-300 border-t-slate-800 animate-spin" />
        </div>
      )}

      <SwatchCardDeleteOverlay
        isMobileOnly={false}
        isEditing={isEditing}
        showDeleteConfirm={showDeleteConfirm}
        countdownProgress={countdownProgress}
        triggerDelete={triggerDelete}
        cancelDeleteCountdown={cancelDeleteCountdown}
      />

      <div className={`px-3 ${isEditing ? 'pt-0' : 'pt-1.5'} pb-2 flex-1 flex flex-col justify-between gap-2 self-stretch md:self-auto`}>
        {isEditing ? (
          <SwatchCardEditForm
            formData={formData}
            handleInputChange={handleInputChange}
            vendorSearchFocused={vendorSearchFocused}
            setVendorSearchFocused={setVendorSearchFocused}
            filteredVendorNames={filteredVendorNames}
            structureSearchFocused={structureSearchFocused}
            setStructureSearchFocused={setStructureSearchFocused}
            filteredStructures={filteredStructures}
            handleSave={handleSave}
            handleDiscard={handleDiscard}
          />
        ) : (
          <SwatchCardDisplaySection
            swatch={swatch}
            isAllSwatchesView={isAllSwatchesView}
            batchName={batchName}
            batchDate={batchDate}
            isBulkEditMode={isBulkEditMode}
            changeEditingState={changeEditingState}
            onEdit={onEdit}
            onSave={onSave}
          />
        )}
      </div>
    </div>
  );
}
