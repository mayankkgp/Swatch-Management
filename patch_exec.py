import re

with open('src/features/logging/ExecutionBar.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="flex items-center gap-2 h-10 px-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-sm cursor-pointer md:h-6 md:text-xs md:px-2.5 md:rounded-sm md:gap-1 md:shadow-xs"',
    'className="flex items-center justify-center gap-2 py-1 px-1 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-sm cursor-pointer md:h-6 md:text-xs md:px-2.5 md:rounded-sm md:gap-1 md:shadow-xs md:py-0"'
)

content = content.replace(
    'className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm tracking-wide rounded-md shadow-sm transition-all flex items-center justify-center gap-2 md:h-6 md:text-xs md:px-2.5 md:rounded-sm md:bg-slate-950 md:hover:bg-slate-800 md:font-semibold md:tracking-normal md:gap-1 md:shadow-xs md:border md:border-transparent cursor-pointer"',
    'className="py-1 px-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm tracking-wide rounded-md shadow-sm transition-all flex items-center justify-center gap-2 md:h-6 md:text-xs md:px-2.5 md:rounded-sm md:bg-slate-950 md:hover:bg-slate-800 md:font-semibold md:tracking-normal md:gap-1 md:shadow-xs md:border md:border-transparent md:py-0 cursor-pointer"'
)

with open('src/features/logging/ExecutionBar.jsx', 'w') as f:
    f.write(content)

