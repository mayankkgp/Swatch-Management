import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="fixed inset-0 z-50 flex flex-col bg-slate-50 animate-in slide-in-from-bottom-full duration-200">',
    '<div className="fixed inset-0 md:absolute z-50 flex flex-col bg-slate-50 md:animate-none animate-in slide-in-from-bottom-full duration-200">'
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
