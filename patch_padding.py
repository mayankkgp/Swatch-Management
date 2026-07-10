import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# Update container classes
content = content.replace(
    '<div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white md:bg-slate-50 relative">',
    '<div className="flex-1 overflow-y-auto p-4 md:p-3 bg-white md:bg-slate-50 relative">'
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
