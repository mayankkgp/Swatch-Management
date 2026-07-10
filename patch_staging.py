import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# Add BulkEditPanel import
content = content.replace("import SwatchCard from '../batches/SwatchCard';", "import SwatchCard from '../batches/SwatchCard';\nimport BulkEditPanel from '../batches/BulkEditPanel';")

bulk_edit_funcs = """  const [isSavingBulk, setIsSavingBulk] = useState(false);

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
      setReviewSwatches(prev => prev.map(s => {
        if (selectedSwatchIds.includes(s.id)) {
          return { ...s, ...modifiedFields };
        }
        return s;
      }));
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

  const viewingSwatch = reviewSwatches.find(s => s.id === viewingSwatchId);"""

content = re.sub(
    r'  const viewingSwatch = reviewSwatches\.find\(s => s\.id === viewingSwatchId\);',
    bulk_edit_funcs,
    content
)

layout_replacement = """      <div className={`flex-1 overflow-y-visible md:overflow-hidden min-h-0 relative ${
        (isBulkEditMode || editingSwatchId || viewingSwatchId) ? 'grid grid-cols-1 md:grid-cols-[210px_1fr] gap-0 md:gap-3 bg-slate-50' : 'flex flex-col md:flex-row'
      }`}>
        {(isBulkEditMode || editingSwatchId || viewingSwatchId) && (
          <div className="absolute md:relative inset-y-0 left-0 w-[210px] md:w-full h-full z-50 md:z-30 bg-white border-r border-slate-200 shadow-2xl md:shadow-none animate-in slide-in-from-left duration-200">
            <BulkEditPanel
              selectedCount={isBulkEditMode ? selectedSwatchIds.length : 1}
              editingSwatch={reviewSwatches.find(s => s.id === (editingSwatchId || viewingSwatchId))}
              isViewOnly={!!viewingSwatchId && !editingSwatchId}
              onSave={isBulkEditMode ? handleSaveBulk : handleSaveSingle}
              onDiscard={() => {
                setIsBulkEditMode(false);
                setEditingSwatchId(null);
                setViewingSwatchId(null);
                setSelectedSwatchIds([]);
              }}
              onDelete={isBulkEditMode ? handleDeleteBulk : handleDeleteSingle}
              isSaving={isSavingBulk}
              onEdit={() => {
                setEditingSwatchId(viewingSwatchId);
                setViewingSwatchId(null);
              }}
              onView={setViewingSwatchId}
              batches={[]} 
            />
          </div>
        )}
        
        {viewingSwatchId && viewingSwatch ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-100 relative overflow-hidden h-full">"""

content = re.sub(
    r'      <div className="flex-1 flex flex-col md:flex-row overflow-y-visible md:overflow-hidden min-h-0 relative">\n        \{viewingSwatchId && viewingSwatch \? \(.*?<div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-100 relative overflow-hidden">',
    layout_replacement,
    content,
    flags=re.DOTALL
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
