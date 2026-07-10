import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex-none bg-white border-t border-slate-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] p-4 md:p-3 flex flex-col sm:flex-row items-center gap-3 md:gap-2">',
    '<div className="flex-none bg-white border-t border-slate-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] p-4 md:p-3 flex flex-col sm:flex-row sm:items-end gap-3 md:gap-2">'
)

content = content.replace(
    '<div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-5">',
    '<div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">'
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
