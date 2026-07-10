/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import MOCK_SWATCHES from '../../data/mock-swatch.json';

export default function useStagingQueueState({
  batchName,
  setBatchName,
  onSaveBatch,
  isSavingBatch
}) {
  const [reviewSwatches, setReviewSwatches] = useState(MOCK_SWATCHES.slice(0, 20));
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [selectedSwatchIds, setSelectedSwatchIds] = useState([]);
  const [editingSwatchId, setEditingSwatchId] = useState(null);
  const [viewingSwatchId, setViewingSwatchId] = useState(null);
  const [mobileEditingSwatchId, setMobileEditingSwatchId] = useState(null);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSavingBulk, setIsSavingBulk] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && !batchName.trim()) {
      const today = new Date();
      const dateStr = today.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      setBatchName(`Mobile Batch ${dateStr}`);
    }
  }, [isMobile, batchName, setBatchName]);

  const isEditingAnySwatchOnMobile = isMobile && mobileEditingSwatchId !== null;
  const isDesktopActionDisabled = !isMobile && (isBulkEditMode || !!editingSwatchId);
  const isSaveDisabled = reviewSwatches.length === 0 || !batchName.trim() || isSavingBatch;

  const handleToggleSelectSwatch = (swatchId) => {
    setSelectedSwatchIds(prev => prev.includes(swatchId) ? prev.filter(id => id !== swatchId) : [...prev, swatchId]);
  };

  const handleSaveSwatchInline = async (swatchId, updatedData) => {
    setReviewSwatches(prev => prev.map(s => s.id === swatchId ? { ...s, ...updatedData } : s));
    setEditingSwatchId(null);
  };

  const handleDeleteSwatchInline = async (swatchId) => {
    setReviewSwatches(prev => prev.filter(s => s.id !== swatchId));
    if (editingSwatchId === swatchId) setEditingSwatchId(null);
  };

  const handleSaveSingle = async (modifiedFields) => {
    setIsSavingBulk(true);
    try {
      const swatchToUpdate = reviewSwatches.find(s => s.id === editingSwatchId);
      if (swatchToUpdate) {
        setReviewSwatches(prev => prev.map(s => s.id === editingSwatchId ? { ...s, ...modifiedFields } : s));
      }
      setEditingSwatchId(null);
      setViewingSwatchId(null);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const handleDeleteSingle = async () => {
    setIsSavingBulk(true);
    try {
      setReviewSwatches(prev => prev.filter(s => s.id !== editingSwatchId));
      setEditingSwatchId(null);
      setViewingSwatchId(null);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const handleSaveBulk = async (modifiedFields) => {
    setIsSavingBulk(true);
    try {
      setReviewSwatches(prev => prev.map(s => selectedSwatchIds.includes(s.id) ? { ...s, ...modifiedFields } : s));
      setIsBulkEditMode(false);
      setSelectedSwatchIds([]);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const handleDeleteBulk = async () => {
    setIsSavingBulk(true);
    try {
      setReviewSwatches(prev => prev.filter(s => !selectedSwatchIds.includes(s.id)));
      setIsBulkEditMode(false);
      setSelectedSwatchIds([]);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const handleSaveAndPrint = async () => {
    if (isSaveDisabled) return;
    setIsPrinting(true);
    await onSaveBatch(batchName);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPrinting(false);
    alert(`Print job for batch "${batchName}" sent to queue!`);
  };

  const handleMobileModalSave = async (e) => {
    e.preventDefault();
    if (!batchName.trim()) return;
    if (pendingAction === 'print') {
      await handleSaveAndPrint();
    } else {
      await onSaveBatch(batchName);
    }
    setShowMobileModal(false);
    setPendingAction(null);
  };

  return {
    reviewSwatches,
    setReviewSwatches,
    isBulkEditMode,
    setIsBulkEditMode,
    selectedSwatchIds,
    setSelectedSwatchIds,
    editingSwatchId,
    setEditingSwatchId,
    viewingSwatchId,
    setViewingSwatchId,
    mobileEditingSwatchId,
    setMobileEditingSwatchId,
    showMobileModal,
    setShowMobileModal,
    pendingAction,
    setPendingAction,
    isMobile,
    isSavingBulk,
    isPrinting,
    isEditingAnySwatchOnMobile,
    isDesktopActionDisabled,
    isSaveDisabled,
    handleToggleSelectSwatch,
    handleSaveSwatchInline,
    handleDeleteSwatchInline,
    handleSaveSingle,
    handleDeleteSingle,
    handleSaveBulk,
    handleDeleteBulk,
    handleSaveAndPrint,
    handleMobileModalSave
  };
}
