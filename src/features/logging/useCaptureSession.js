/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  saveBatch, 
  saveSwatch, 
  saveSwatchesBulk,
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingBatch, setIsSavingBatch] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);

  const handleActiveImageSet = useCallback((imgData) => {
    setIsImageLoading(true);
    setIsSidebarLoading(false);
    setTimeout(() => {
      setIsImageLoading(false);
    }, 600);
    setActiveImage(imgData);
    setRotation(0);
  }, []);

  const handleImagesQueued = useCallback((newImages) => {
    if (!newImages || newImages.length === 0) return;

    setActiveImage(currentActive => {
      if (!currentActive) {
        const [first, ...rest] = newImages;
        const img = typeof first === 'string' ? first : first.image;
        const ratio = typeof first === 'object' && first ? first.aspectRatio : '3:4';

        setIsImageLoading(true);
        setIsSidebarLoading(false);
        setTimeout(() => {
          setIsImageLoading(false);
        }, 600);

        setFormData(prev => ({ ...prev, ...activeDefaults, aspectRatio: ratio }));
        setRotation(0);
        if (rest.length > 0) {
          setImageQueue(prev => [...prev, ...rest]);
        }
        return img;
      } else {
        setImageQueue(prev => [...prev, ...newImages]);
        return currentActive;
      }
    });
  }, [activeDefaults]);

  useEffect(() => {
    if (!activeImage && imageQueue.length > 0 && !isImageLoading) {
      const nextItem = imageQueue[0];
      const img = typeof nextItem === 'string' ? nextItem : nextItem.image;
      const ratio = typeof nextItem === 'object' && nextItem ? nextItem.aspectRatio : '3:4';

      setIsImageLoading(true);
      setIsSidebarLoading(false);
      setActiveImage(img);
      setFormData(prev => ({ ...prev, ...activeDefaults, aspectRatio: ratio }));
      setImageQueue(prev => prev.slice(1));
      setRotation(0);
      setTimeout(() => {
        setIsImageLoading(false);
      }, 600);
    }
  }, [activeImage, imageQueue, isImageLoading, activeDefaults]);


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
    const targetBatch = currentBatch || batches.find(b => b.id === currentBatchId);
    if (!targetBatch || !targetBatch.swatchIds) return [];
    return swatches.filter(s => targetBatch.swatchIds.includes(s.id));
  }, [currentBatch, batches, currentBatchId, swatches]);

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
    setIsImageLoading(true);
    setIsSidebarLoading(true);

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
      const targetBatch = currentBatch || batches.find(b => b.id === currentBatchId);
      if (!currentBatchId || !targetBatch) {
        const newBatchId = currentBatchId || generateNewId('B', batches);
        const dateStr = new Date().toISOString().split('T')[0];
        updatedBatch = {
          id: newBatchId,
          name: batchName || '',
          date: dateStr,
          status: 'draft',
          swatchIds: [newSwatchId]
        };
        setCurrentBatchId(newBatchId);
      } else {
        updatedBatch = {
          ...targetBatch,
          swatchIds: [...(targetBatch.swatchIds || []), newSwatchId]
        };
      }
      
      await saveBatch(updatedBatch);

      if (!applyToCurrentOnly) {
        await updateActiveDefaults(formData);
      } else {
        setFormData({ ...activeDefaults });
        setApplyToCurrentOnly(false);
      }

      const nextItem = imageQueue[0];
      if (nextItem) {
        const img = typeof nextItem === 'string' ? nextItem : nextItem.image;
        const ratio = typeof nextItem === 'object' && nextItem ? nextItem.aspectRatio : '3:4';
        setActiveImage(img);
        setFormData(prev => ({ ...prev, ...activeDefaults, aspectRatio: ratio }));
        setImageQueue(prev => prev.slice(1));
      } else {
        setActiveImage(null);
      }
      setRotation(0);
      
      await onRefresh();

      await new Promise(res => setTimeout(res, 600));
    } catch (err) {
      console.error('[CAPTURE] Failed to save swatch:', err);
    } finally {
      setIsSaving(false);
      setIsImageLoading(false);
      setIsSidebarLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!activeImage) return;

    setIsDeleting(true);
    setIsImageLoading(true);
    setIsSidebarLoading(true);

    try {
      const nextItem = imageQueue[0];
      if (nextItem) {
        const img = typeof nextItem === 'string' ? nextItem : nextItem.image;
        const ratio = typeof nextItem === 'object' && nextItem ? nextItem.aspectRatio : '3:4';
        setActiveImage(img);
        setFormData(prev => ({ ...prev, ...activeDefaults, aspectRatio: ratio }));
        setImageQueue(prev => prev.slice(1));
      } else {
        setActiveImage(null);
        if (!applyToCurrentOnly) {
          setFormData({ ...activeDefaults });
        }
      }
      setRotation(0);

      await new Promise(res => setTimeout(res, 600));
    } finally {
      setIsDeleting(false);
      setIsImageLoading(false);
      setIsSidebarLoading(false);
    }
  };

  const handleDeleteStagedSwatch = async (swatchId) => {
    await deleteSwatch(swatchId);
    await onRefresh();
  };

  const handleFinalSaveBatch = async (finalBatchName, updatedSwatches) => {
    let targetBatch = currentBatch || batches.find(b => b.id === currentBatchId);
    if (!targetBatch) {
      const activeSwatches = updatedSwatches && updatedSwatches.length > 0 ? updatedSwatches : stagedSwatches;
      const swatchIds = activeSwatches.map(s => s.id);
      const newBatchId = currentBatchId || generateNewId('B', batches);
      const dateStr = new Date().toISOString().split('T')[0];
      targetBatch = {
        id: newBatchId,
        name: finalBatchName,
        date: dateStr,
        status: 'draft',
        swatchIds: swatchIds
      };
    }

    setIsSavingBatch(true);
    try {
      if (updatedSwatches && updatedSwatches.length > 0) {
        await saveSwatchesBulk(updatedSwatches);
      }
      const updatedBatch = {
        ...targetBatch,
        name: finalBatchName,
        status: 'active',
        swatchIds: (updatedSwatches && updatedSwatches.length > 0)
          ? updatedSwatches.map(s => s.id)
          : (targetBatch.swatchIds || [])
      };
      await saveBatch(updatedBatch);
      await onRefresh();
      setShowStagingQueue(false);
      if (onNavigate) {
        onNavigate('batch');
      }
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
    isDeleting,
    isSavingBatch,
    isImageLoading,
    isSidebarLoading,
    isNextLoading: isImageLoading || isSidebarLoading,
    stagedSwatches,
    handleClearForm,
    handleSaveNext,
    handleDeleteImage,
    handleDeleteStagedSwatch,
    handleFinalSaveBatch,
    handleImagesQueued,
    handleActiveImageSet,
    viewerTheme,
    setViewerTheme,
    imageQueue
  };
}
