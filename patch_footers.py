import re

with open('./src/features/logging/ExecutionBar.jsx', 'r') as f:
    exec_content = f.read()

exec_content = exec_content.replace(
    'className="flex-none h-16 md:h-10 bg-white border-t border-slate-200 px-4 md:px-3 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none md:border-t md:border-slate-200/80 z-20 sticky bottom-0"',
    'className="flex-none h-16 md:h-auto bg-white md:bg-slate-50/50 border-t border-slate-200 px-4 md:px-4 md:pt-2 md:pb-1 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none z-20 sticky bottom-0 md:text-xs md:text-slate-500 md:font-medium md:select-none"'
)

with open('./src/features/logging/ExecutionBar.jsx', 'w') as f:
    f.write(exec_content)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    stage_content = f.read()

stage_content = stage_content.replace(
    '<div className="flex-none bg-white border-t border-slate-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] p-4 md:p-3 flex flex-col sm:flex-row sm:items-end gap-3 md:gap-2">',
    '<div className="flex-none bg-white md:bg-slate-50/50 border-t border-slate-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] md:shadow-none p-4 md:px-4 md:pt-2 md:pb-1 flex flex-col sm:flex-row sm:items-end gap-3 md:gap-6 md:text-xs md:text-slate-500 md:font-medium md:select-none">'
)

stage_content = stage_content.replace(
    '<div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">',
    '<div className="flex gap-2 md:gap-6 w-full sm:w-auto mt-2 sm:mt-0">'
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(stage_content)

