/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import CaptureZone from './CaptureZone';
import InputTray from './InputTray';
import ExecutionBar from './ExecutionBar';
import StagingQueueOverlay from './StagingQueueOverlay';
import { useCaptureSession } from './useCaptureSession';

export default function CaptureSession(props) {
  const {
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
    isNextLoading,
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
  } = useCaptureSession(props);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className={`flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden ${showStagingQueue ? 'hidden md:flex' : 'flex'}`}>
        <CaptureZone 
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          rotation={rotation}
          setRotation={setRotation}
          onActiveImageSet={handleActiveImageSet}
          onImagesQueued={handleImagesQueued}
          aspectRatio={formData.aspectRatio}
          viewerTheme={viewerTheme}
          formData={formData}
          handleInputChange={handleInputChange}
          isNextLoading={isImageLoading}
        />
        
        <InputTray 
          formData={formData}
          handleInputChange={handleInputChange}
          applyToCurrentOnly={applyToCurrentOnly}
          setApplyToCurrentOnly={setApplyToCurrentOnly}
          onClear={handleClearForm}
          viewerTheme={viewerTheme}
          setViewerTheme={setViewerTheme}
          isNextLoading={isSidebarLoading}
        />
      </div>

      <div className={showStagingQueue ? 'hidden md:block' : 'block'}>
        <ExecutionBar 
          stagedCount={stagedSwatches.length}
          queueCount={imageQueue.length}
          onReviewClick={() => setShowStagingQueue(true)}
          onSaveNextClick={handleSaveNext}
          isSaveDisabled={!activeImage || isImageLoading || isSidebarLoading || isSaving || isDeleting}
          isSaving={isSaving}
          isDeleting={isDeleting}
          isNextLoading={isImageLoading || isSidebarLoading}
          onClearImage={handleDeleteImage}
          hasActiveImage={!!activeImage}
          onRotate={() => setRotation((prev) => (prev + 90) % 360)}
        />
      </div>

      {showStagingQueue && (
        <StagingQueueOverlay 
          stagedSwatches={stagedSwatches}
          onRefresh={props.onRefresh}
          onClose={() => setShowStagingQueue(false)}
          batchName={batchName}
          setBatchName={setBatchName}
          onSaveBatch={handleFinalSaveBatch}
          onDeleteSwatch={handleDeleteStagedSwatch}
          isSavingBatch={isSavingBatch}
        />
      )}
    </div>
  );
}
