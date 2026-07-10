import re

with open('./src/features/logging/InputTray.jsx', 'r') as f:
    content = f.read()

header_pattern = re.compile(r'<div className="flex items-center justify-between pb-1 md:pb-0[^>]*>.*?</button>\s*</div>', re.DOTALL)

replacement = """<div className="flex items-center justify-between pb-1 md:pb-0 md:h-10 md:border-b md:border-slate-200 md:bg-slate-50 md:px-3 md:-mx-1.5 md:-mt-3 md:mb-3 md:shrink-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-500 md:text-slate-700 leading-tight">
              <span className="hidden md:inline">Attributes</span>
              <span className="md:hidden">Attribute Parameters</span>
            </h2>
          </div>
          <button 
            type="button" 
            onClick={onClear}
            className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-700 tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="size-3 md:hidden" />
            <span>Clear</span>
          </button>
        </div>"""

content = header_pattern.sub(replacement, content)

with open('./src/features/logging/InputTray.jsx', 'w') as f:
    f.write(content)
