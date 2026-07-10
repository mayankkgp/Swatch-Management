import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# Update container classes
content = content.replace(
    '<div className="flex-1 overflow-y-visible md:overflow-y-auto p-4">',
    '<div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white relative">'
)

# Update gap
content = content.replace(
    'className={`grid justify-between gap-4 ${editingSwatchId ? \'pointer-events-none\' : \'\'}`}',
    'className={`grid justify-between gap-3 ${editingSwatchId ? \'pointer-events-none\' : \'\'}`}'
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
