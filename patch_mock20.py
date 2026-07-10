import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# Make sure we add reviewSwatches state
state_replacement = """  const [reviewSwatches, setReviewSwatches] = useState(MOCK_SWATCHES.slice(0, 20));
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);"""

content = re.sub(
    r'  const \[isBulkEditMode, setIsBulkEditMode\] = useState\(false\);',
    state_replacement,
    content
)

# Update handleSaveSingle
handleSaveSingle_replacement = """  const handleSaveSingle = async (modifiedFields) => {
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
      setReviewSwatches(prev => prev.filter(s => s.id !== editingSwatchId));
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
      setReviewSwatches(prev => prev.filter(s => !selectedSwatchIds.includes(s.id)));
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

# Update handleSaveSwatchInline
handleSaveSwatchInline_replacement = """  const handleSaveSwatchInline = async (swatchId, updatedData) => {
    setReviewSwatches(prev => prev.map(s => s.id === swatchId ? { ...s, ...updatedData } : s));
    setEditingSwatchId(null);
  };"""
content = re.sub(
    r'  const handleSaveSwatchInline = async.*?setEditingSwatchId\(null\);\n  \};',
    handleSaveSwatchInline_replacement,
    content,
    flags=re.DOTALL
)

# Update handleDeleteSwatchInline
handleDeleteSwatchInline_replacement = """  const handleDeleteSwatchInline = async (swatchId) => {
    setReviewSwatches(prev => prev.filter(s => s.id !== swatchId));
    if (editingSwatchId === swatchId) setEditingSwatchId(null);
  };"""
content = re.sub(
    r'  const handleDeleteSwatchInline = async.*?if \(editingSwatchId === swatchId\) setEditingSwatchId\(null\);\n  \};',
    handleDeleteSwatchInline_replacement,
    content,
    flags=re.DOTALL
)

# replace stagedSwatches array accesses with reviewSwatches
content = content.replace("stagedSwatches.find", "reviewSwatches.find")
content = content.replace("stagedSwatches.filter", "reviewSwatches.filter")
content = content.replace("stagedSwatches.length", "reviewSwatches.length")
content = content.replace("stagedSwatches)", "reviewSwatches)")

# We also need to fix this line: `{(isEditingAnySwatchOnMobile ? stagedSwatches.filter(s => s.id === mobileEditingSwatchId) : stagedSwatches).map(swatch => (`
content = content.replace(
    "(isEditingAnySwatchOnMobile ? stagedSwatches.filter(s => s.id === mobileEditingSwatchId) : stagedSwatches)",
    "(isEditingAnySwatchOnMobile ? reviewSwatches.filter(s => s.id === mobileEditingSwatchId) : reviewSwatches)"
)
content = content.replace(
    ": stagedSwatches)",
    ": reviewSwatches)"
)

# Fix isSaveDisabled
content = content.replace(
    "const isSaveDisabled = reviewSwatches.length === 0 || !batchName.trim() || isSavingBatch;",
    "const isSaveDisabled = reviewSwatches.length === 0 || !batchName.trim() || isSavingBatch;"
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
