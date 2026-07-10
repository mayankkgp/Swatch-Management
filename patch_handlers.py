import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# Update onEdit for SwatchCard
content = content.replace(
    'onEdit={() => setEditingSwatchId(swatch.id)}',
    'onEdit={() => {\n                    setEditingSwatchId(swatch.id);\n                    setViewingSwatchId(null);\n                    setIsBulkEditMode(false);\n                  }}'
)

# Update onView for SwatchCard
content = content.replace(
    'onView={() => setViewingSwatchId(swatch.id)}',
    'onView={() => {\n                    setViewingSwatchId(swatch.id);\n                    setEditingSwatchId(null);\n                    setIsBulkEditMode(false);\n                  }}'
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
