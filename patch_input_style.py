import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# 1. Update the label font color to black for desktop
content = content.replace(
    '<label className="text-[10px] md:text-[9px] md:leading-none font-bold uppercase tracking-wider text-slate-400 block mb-1 md:mb-1">',
    '<label className="text-[10px] md:text-[9px] md:leading-none font-bold uppercase tracking-wider text-slate-400 md:text-black block mb-1 md:mb-1">'
)

# 2. Update Input background color
content = content.replace(
    'className="w-full h-10 md:h-6 px-3 md:px-2 border-slate-300 text-sm md:text-xs md:leading-none font-medium md:font-normal focus:ring-indigo-100 focus:border-indigo-500 md:rounded-sm md:py-0"',
    'className="w-full h-10 md:h-6 px-3 md:px-2 border-slate-300 text-sm md:text-xs md:leading-none font-medium md:font-normal focus:ring-indigo-100 focus:border-indigo-500 md:rounded-sm md:py-0 bg-white md:disabled:bg-slate-100 md:disabled:text-slate-400"'
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
