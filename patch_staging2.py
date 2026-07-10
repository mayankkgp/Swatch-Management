import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# Add imports for services
content = content.replace(
    "import BulkEditPanel from '../batches/BulkEditPanel';",
    "import BulkEditPanel from '../batches/BulkEditPanel';\nimport { saveSwatchesBulk, deleteSwatchesBulk, deleteSwatch } from '../../services/swatchServices';"
)

# Update the component signature
content = content.replace(
    "isSavingBatch\n}) {",
    "isSavingBatch,\n  onRefresh\n}) {"
)

# Remove reviewSwatches state
content = re.sub(r'  const \[reviewSwatches, setReviewSwatches\] = useState.*?;\n', '', content)

# Update handleSaveSingle
handleSaveSingle_replacement = """  const handleSaveSingle = async (modifiedFields) => {
    setIsSavingBulk(true);
    try {
      const swatchToUpdate = stagedSwatches.find(s => s.id === editingSwatchId);
      if (swatchToUpdate) {
        await saveSwatchesBulk([{ ...swatchToUpdate, ...modifiedFields }]);
        await onRefresh();
      }
      setEditingSwatchId(null);
      setViewingSwatchId(null);
    } finally {
      setIsSavingBulk(false);
    }
  };"""
content = re.sub(
    r'  const handleSaveSingle = async.*?finally \{\n      setIsSavingBulk\(false\);\n    \}\n  \};',
    handleSaveSingle_replacement,
    content,
    flags=re.DOTALL
)

# Update handleDeleteSingle
handleDeleteSingle_replacement = """  const handleDeleteSingle = async () => {
    setIsSavingBulk(true);
    try {
      await deleteSwatch(editingSwatchId);
      await onRefresh();
      setEditingSwatchId(null);
      setViewingSwatchId(null);
    } finally {
      setIsSavingBulk(false);
    }
  };"""
content = re.sub(
    r'  const handleDeleteSingle = async.*?finally \{\n      setIsSavingBulk\(false\);\n    \}\n  \};',
    handleDeleteSingle_replacement,
    content,
    flags=re.DOTALL
)

# Update handleSaveBulk
handleSaveBulk_replacement = """  const handleSaveBulk = async (modifiedFields) => {
    setIsSavingBulk(true);
    try {
      const swatchesToUpdate = stagedSwatches
        .filter(s => selectedSwatchIds.includes(s.id))
        .map(s => ({ ...s, ...modifiedFields }));
      
      await saveSwatchesBulk(swatchesToUpdate);
      await onRefresh();
      setIsBulkEditMode(false);
      setSelectedSwatchIds([]);
    } finally {
      setIsSavingBulk(false);
    }
  };"""
content = re.sub(
    r'  const handleSaveBulk = async.*?finally \{\n      setIsSavingBulk\(false\);\n    \}\n  \};',
    handleSaveBulk_replacement,
    content,
    flags=re.DOTALL
)

# Update handleDeleteBulk
handleDeleteBulk_replacement = """  const handleDeleteBulk = async () => {
    setIsSavingBulk(true);
    try {
      await deleteSwatchesBulk(selectedSwatchIds);
      await onRefresh();
      setIsBulkEditMode(false);
      setSelectedSwatchIds([]);
    } finally {
      setIsSavingBulk(false);
    }
  };"""
content = re.sub(
    r'  const handleDeleteBulk = async.*?finally \{\n      setIsSavingBulk\(false\);\n    \}\n  \};',
    handleDeleteBulk_replacement,
    content,
    flags=re.DOTALL
)

# Also update viewingSwatch line
content = content.replace(
    "const viewingSwatch = reviewSwatches.find(s => s.id === viewingSwatchId);",
    "const viewingSwatch = stagedSwatches.find(s => s.id === viewingSwatchId);"
)

# Replace all other reviewSwatches instances with stagedSwatches
content = content.replace("reviewSwatches", "stagedSwatches")

# handleSaveSwatchInline
handleSaveSwatchInline_replacement = """  const handleSaveSwatchInline = async (swatchId, updatedData) => {
    await saveSwatchesBulk([{ ...stagedSwatches.find(s => s.id === swatchId), ...updatedData }]);
    await onRefresh();
    setEditingSwatchId(null);
  };"""
content = re.sub(
    r'  const handleSaveSwatchInline = async.*?setEditingSwatchId\(null\);\n  \};',
    handleSaveSwatchInline_replacement,
    content,
    flags=re.DOTALL
)

# handleDeleteSwatchInline
handleDeleteSwatchInline_replacement = """  const handleDeleteSwatchInline = async (swatchId) => {
    await deleteSwatch(swatchId);
    await onRefresh();
    if (editingSwatchId === swatchId) setEditingSwatchId(null);
  };"""
content = re.sub(
    r'  const handleDeleteSwatchInline = async.*?if \(editingSwatchId === swatchId\) setEditingSwatchId\(null\);\n  \};',
    handleDeleteSwatchInline_replacement,
    content,
    flags=re.DOTALL
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
