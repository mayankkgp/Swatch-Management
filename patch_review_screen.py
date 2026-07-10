import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# Add useEffect import
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")

# State setup
state_replacement = """export default function StagingQueueOverlay({
  stagedSwatches,
  onClose,
  batchName,
  setBatchName,
  onSaveBatch,
  onDeleteSwatch,
  isSavingBatch
}) {
  const [reviewSwatches, setReviewSwatches] = useState(MOCK_SWATCHES.slice(0, 20));
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [selectedSwatchIds, setSelectedSwatchIds] = useState([]);
  const [editingSwatchId, setEditingSwatchId] = useState(null);
  const [viewingSwatchId, setViewingSwatchId] = useState(null);
  const [mobileEditingSwatchId, setMobileEditingSwatchId] = useState(null);
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isEditingAnySwatchOnMobile = isMobile && mobileEditingSwatchId !== null;

  const handleToggleSelectSwatch = (swatchId) => {
    setSelectedSwatchIds(prev =>
      prev.includes(swatchId)
        ? prev.filter(id => id !== swatchId)
        : [...prev, swatchId]
    );
  };

  const handleSaveSwatchInline = async (swatchId, updatedData) => {
    setReviewSwatches(prev => prev.map(s => s.id === swatchId ? { ...s, ...updatedData } : s));
    setEditingSwatchId(null);
  };

  const handleDeleteSwatchInline = async (swatchId) => {
    setReviewSwatches(prev => prev.filter(s => s.id !== swatchId));
    if (editingSwatchId === swatchId) setEditingSwatchId(null);
  };

  const viewingSwatch = reviewSwatches.find(s => s.id === viewingSwatchId);

  const [isPrinting, setIsPrinting] = useState(false);

  const isSaveDisabled = reviewSwatches.length === 0 || !batchName.trim() || isSavingBatch;"""

content = re.sub(
    r'export default function StagingQueueOverlay.*?const isSaveDisabled = stagedSwatches\.length === 0 \|\| !batchName\.trim\(\) \|\| isSavingBatch;',
    state_replacement,
    content,
    flags=re.DOTALL
)

# Header update: replace the SKU count with reviewSwatches.length, and edit bulk logic
header_replacement = """        <div className="flex items-center gap-3">
          <Button
            onClick={onClose}
            className="hidden md:flex md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0"
          >
            <ArrowLeft className="size-4 md:size-3" />
            <span>Back</span>
          </Button>

          <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="md:hidden">Staging Queue</span>
            <span className="hidden md:inline">Review Batch</span>
            <span className="md:hidden bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {reviewSwatches.length} Items
            </span>
            <span className="hidden md:inline text-slate-500 font-mono text-[10px] uppercase tracking-wide font-semibold ml-1">
              <span className="text-slate-300 font-sans font-normal mr-2">•</span>
              {reviewSwatches.length} SKUs
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {!viewingSwatchId && !editingSwatchId && (
            <Button
              onClick={() => {
                setIsBulkEditMode(p => !p);
                setSelectedSwatchIds([]);
              }}
              className={`hidden md:flex md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border font-semibold transition-all items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0 ${
                isBulkEditMode 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <Edit2 className="size-4 md:size-3" />
              <span>{isBulkEditMode ? 'Cancel' : 'Edit Bulk'}</span>
            </Button>
          )}

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>"""

content = re.sub(
    r'<div className="flex items-center gap-3">.*?<X className="size-5" />\n          </button>\n        </div>',
    header_replacement,
    content,
    flags=re.DOTALL
)

# Content area
content_replacement = """      <div className="flex-1 flex flex-col md:flex-row overflow-y-visible md:overflow-hidden min-h-0 relative">
        {viewingSwatchId && viewingSwatch ? (
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
                <img 
                  src={viewingSwatch.image} 
                  alt={`Swatch ${viewingSwatch.id}`} 
                  className="w-full h-full object-contain max-h-full max-w-full select-none"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            
            <div className="mt-4 text-center">
              <span className="font-mono text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded shadow-2xs">
                {viewingSwatch.id}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-visible md:overflow-y-auto p-4">
            <div 
              className={`grid justify-between gap-4 ${editingSwatchId ? 'pointer-events-none' : ''}`}
              style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(180px, 200px))' }}
            >
              {(isEditingAnySwatchOnMobile ? reviewSwatches.filter(s => s.id === mobileEditingSwatchId) : reviewSwatches).map(swatch => (
                <SwatchCard 
                  key={swatch.id} 
                  swatch={swatch} 
                  isBulkEditMode={isBulkEditMode}
                  isSelected={selectedSwatchIds.includes(swatch.id)}
                  isCurrentlyEditing={editingSwatchId === swatch.id}
                  onToggleSelect={() => handleToggleSelectSwatch(swatch.id)}
                  onSave={(swatchId, data) => handleSaveSwatchInline(swatchId, data)}
                  onDelete={() => handleDeleteSwatchInline(swatch.id)}
                  onView={() => setViewingSwatchId(swatch.id)}
                  onEdit={() => setEditingSwatchId(swatch.id)}
                  onMobileEditStateChange={(swatchId, isEditing) => {
                    setMobileEditingSwatchId(isEditing ? swatchId : null);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>"""

content = re.sub(
    r'<div className="flex-1 overflow-y-auto p-4">.*?</div>\n      </div>',
    content_replacement,
    content,
    flags=re.DOTALL
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
