import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# Update Input class
content = content.replace(
    'className="w-full h-10 px-3 border-slate-300 text-sm font-medium focus:ring-indigo-100 focus:border-indigo-500"',
    'className="w-full h-10 md:h-6 px-3 md:px-2 border-slate-300 text-sm md:text-xs md:leading-none font-medium md:font-normal focus:ring-indigo-100 focus:border-indigo-500 md:rounded-sm md:py-0"'
)

# Update Save Batch button class
content = content.replace(
    'className="flex-1 sm:flex-none h-10 px-5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-xs transition-all flex items-center justify-center gap-1.5"',
    'className="flex-1 sm:flex-none h-10 md:h-6 px-5 md:px-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold md:font-semibold text-xs md:text-xs uppercase md:normal-case tracking-wider md:tracking-normal rounded-md md:rounded-sm shadow-xs transition-all flex items-center justify-center gap-1.5 md:gap-1 md:py-0 border md:border-transparent cursor-pointer"'
)

# Update Save & Print button class
content = content.replace(
    'className="flex-1 sm:flex-none h-10 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 disabled:text-indigo-400 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-xs transition-all flex items-center justify-center gap-1.5"',
    'className="flex-1 sm:flex-none h-10 md:h-6 px-5 md:px-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 disabled:text-indigo-400 text-white font-bold md:font-semibold text-xs md:text-xs uppercase md:normal-case tracking-wider md:tracking-normal rounded-md md:rounded-sm shadow-xs transition-all flex items-center justify-center gap-1.5 md:gap-1 md:py-0 border md:border-transparent cursor-pointer"'
)

# Update size-4 icons in the buttons to size-4 md:size-3
content = re.sub(
    r'<Check className="size-4" />',
    r'<Check className="size-4 md:size-3" />',
    content
)

content = re.sub(
    r'<Printer className="size-4" />',
    r'<Printer className="size-4 md:size-3" />',
    content
)

content = re.sub(
    r'<span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />',
    r'<span className="size-4 md:size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />',
    content
)

# Also let's tighten the footer padding on desktop
content = content.replace(
    '<div className="flex-none bg-white border-t border-slate-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] p-4 flex flex-col sm:flex-row items-center gap-3">',
    '<div className="flex-none bg-white border-t border-slate-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] p-4 md:p-3 flex flex-col sm:flex-row items-center gap-3 md:gap-2">'
)

content = content.replace(
    '<label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">',
    '<label className="text-[10px] md:text-[9px] md:leading-none font-bold uppercase tracking-wider text-slate-400 block mb-1 md:mb-1">',
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
