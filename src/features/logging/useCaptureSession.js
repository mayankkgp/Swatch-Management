/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  saveBatch, 
  saveSwatch, 
  deleteSwatch,
  updateActiveDefaults
} from '../../services/swatchServices';

export function useCaptureSession({
  batches = [], 
  swatches = [], 
  activeDefaults = {}, 
  resumeBatchId = null, 
  onClearResumeBatchId,
  onRefresh, 
  onNavigate,
  viewerTheme: propViewerTheme,
  setViewerTheme: propSetViewerTheme,
  showStagingQueue: propShowStagingQueue,
  setShowStagingQueue: propSetShowStagingQueue
}) {
  const [activeImage, setActiveImage] = useState(null);
  const [imageQueue, setImageQueue] = useState([]);
  const [rotation, setRotation] = useState(0);
  
  const [formData, setFormData] = useState({ ...activeDefaults });
  const [applyToCurrentOnly, setApplyToCurrentOnly] = useState(false);
  
  const [localViewerTheme, setLocalViewerTheme] = useState('dark');
  const viewerTheme = propViewerTheme !== undefined ? propViewerTheme : localViewerTheme;
  const setViewerTheme = propSetViewerTheme !== undefined ? propSetViewerTheme : setLocalViewerTheme;
  
  const [localShowStagingQueue, setLocalShowStagingQueue] = useState(false);
  const showStagingQueue = propShowStagingQueue !== undefined ? propShowStagingQueue : localShowStagingQueue;
  const setShowStagingQueue = propSetShowStagingQueue !== undefined ? propSetShowStagingQueue : setLocalShowStagingQueue;
  const [batchName, setBatchName] = useState('');
  
  const [currentBatchId, setCurrentBatchId] = useState(resumeBatchId);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingBatch, setIsSavingBatch] = useState(false);

  const handleImagesQueued = useCallback((newImages) => {
    setImageQueue(prev => [...prev, ...newImages]);
  }, []);

  useEffect(() => {
    if (!activeImage && imageQueue.length > 0) {
      const nextItem = imageQueue[0];
      const img = typeof nextItem === 'string' ? nextItem : nextItem.image;
      const ratio = typeof nextItem === 'object' && nextItem ? nextItem.aspectRatio : '3:4';
      
      setActiveImage(img);
      setFormData(prev => ({ ...prev, aspectRatio: ratio }));
      setImageQueue(prev => prev.slice(1));
      setRotation(0);
    }
  }, [activeImage, imageQueue]);


  useEffect(() => {
    if (!applyToCurrentOnly && !activeImage) {
      setFormData(prev => ({ ...prev, ...activeDefaults }));
    }
  }, [activeDefaults, applyToCurrentOnly, activeImage]);

  useEffect(() => {
    return () => {
      if (onClearResumeBatchId) {
        onClearResumeBatchId();
      }
    };
  }, [onClearResumeBatchId]);

  const currentBatch = useMemo(() => {
    return batches.find(b => b.id === currentBatchId);
  }, [batches, currentBatchId]);

  const stagedSwatches = useMemo(() => {
    if (!currentBatch || !currentBatch.swatchIds) return [];
    return swatches.filter(s => currentBatch.swatchIds.includes(s.id));
  }, [currentBatch, swatches]);

  useEffect(() => {
    if (currentBatch && currentBatch.name && !batchName) {
      setBatchName(currentBatch.name);
    }
  }, [currentBatch, batchName]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleClearForm = useCallback(() => {
    setFormData({
      vendorName: '',
      vendorSku: '',
      quantity: '',
      unit: 'yd',
      content: '',
      structure: ''
    });
  }, []);

  const generateNewId = (prefix, list) => {
    let maxNum = 0;
    list.forEach(item => {
      const num = parseInt(item.id.replace(prefix + '-', ''), 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    });
    return `${prefix}-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleSaveNext = async () => {
    if (!activeImage) return;
    setIsSaving(true);

    try {
      const newSwatchId = generateNewId('S', swatches);
      const newSwatch = {
        id: newSwatchId,
        image: activeImage,
        vendorName: formData.vendorName,
        vendorSku: formData.vendorSku,
        quantity: formData.quantity,
        unit: formData.unit,
        content: formData.content,
        structure: formData.structure,
        aspectRatio: formData.aspectRatio || '3:4'
      };
      
      await saveSwatch(newSwatch);

      let updatedBatch;
      if (!currentBatchId) {
        const newBatchId = generateNewId('B', batches);
        const dateStr = new Date().toISOString().split('T')[0];
        updatedBatch = {
          id: newBatchId,
          name: '',
          date: dateStr,
          status: 'draft',
          swatchIds: [newSwatchId]
        };
        setCurrentBatchId(newBatchId);
      } else {
        updatedBatch = {
          ...currentBatch,
          swatchIds: [...(currentBatch.swatchIds || []), newSwatchId]
        };
      }
      
      await saveBatch(updatedBatch);

      if (!applyToCurrentOnly) {
        await updateActiveDefaults(formData);
      } else {
        setFormData({ ...activeDefaults });
        setApplyToCurrentOnly(false);
      }

      setActiveImage(null);
      setRotation(0);
      
      await onRefresh();
    } catch (err) {
      console.error('[CAPTURE] Failed to save swatch:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStagedSwatch = async (swatchId) => {
    await deleteSwatch(swatchId);
    await onRefresh();
  };

  const handleFinalSaveBatch = async (finalBatchName) => {
    if (!currentBatch) return;
    setIsSavingBatch(true);
    try {
      const updatedBatch = {
        ...currentBatch,
        name: finalBatchName,
        status: 'active'
      };
      await saveBatch(updatedBatch);
      await onRefresh();
      setShowStagingQueue(false);
      onNavigate('batch');
    } catch (err) {
      console.error('[CAPTURE] Failed to commit batch:', err);
    } finally {
      setIsSavingBatch(false);
    }
  };

  return {
    activeImage,
    setActiveImage,
    rotation,
    setRotation,
    formData,
    handleInputChange,
    applyToCurrentOnly,
    setApplyToCurrentOnly,
    showStagingQueue,
    setShowStagingQueue,
    batchName,
    setBatchName,
    isSaving,
    isSavingBatch,
    stagedSwatches,
    handleClearForm,
    handleSaveNext,
    handleDeleteStagedSwatch,
    handleFinalSaveBatch,
    handleImagesQueued,
    viewerTheme,
    setViewerTheme,
    imageQueue
  };
}
