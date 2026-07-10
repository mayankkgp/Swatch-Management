import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const isEditingAnySwatchOnMobile = isMobile && mobileEditingSwatchId !== null;',
    'const isEditingAnySwatchOnMobile = isMobile && mobileEditingSwatchId !== null;\n  const isDesktopActionDisabled = !isMobile && (isBulkEditMode || !!editingSwatchId);'
)

# Back button
content = content.replace(
    '          <Button\n            onClick={onClose}\n            className="hidden md:flex md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0"',
    '          <Button\n            onClick={onClose}\n            disabled={isDesktopActionDisabled}\n            className="hidden md:flex md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0 disabled:opacity-50 disabled:pointer-events-none"'
)

# Input
content = content.replace(
    '            disabled={isSavingBatch}',
    '            disabled={isSavingBatch || isDesktopActionDisabled}'
)

# Save Batch Button
content = content.replace(
    '            disabled={isSaveDisabled}',
    '            disabled={isSaveDisabled || isDesktopActionDisabled}'
)

# Save & Print Button
content = content.replace(
    '            disabled={isSaveDisabled || isPrinting}',
    '            disabled={isSaveDisabled || isPrinting || isDesktopActionDisabled}'
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
