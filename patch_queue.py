import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

header_replacement = """      <div className="flex-none h-14 md:h-10 border-b border-slate-200 bg-white px-4 md:px-3 md:py-0 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <Button
            onClick={onClose}
            className="hidden md:flex md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border font-semibold transition-all items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
          >
            <ArrowLeft className="size-4 md:size-3" />
            <span>Back</span>
          </Button>

          <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="md:hidden">Staging Queue</span>
            <span className="hidden md:inline">Review Batch</span>
            <span className="md:hidden bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-mono">
              {stagedSwatches.length} Items
            </span>
            <span className="hidden md:inline text-slate-500 font-mono text-[10px] uppercase tracking-wide font-semibold ml-1">
              <span className="text-slate-300 font-sans font-normal mr-2">•</span>
              {stagedSwatches.length} SKUs
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="hidden md:flex md:h-6 text-sm md:text-xs md:px-2.5 rounded-md md:rounded-sm border font-semibold transition-all items-center justify-center gap-2 md:gap-1 shadow-xs shrink-0 py-1 px-1 md:py-0 bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
          >
            <Edit2 className="size-4 md:size-3" />
            <span>Edit Bulk</span>
          </Button>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>"""

content = re.sub(
    r'<div className="flex-none h-14 md:h-10 border-b border-slate-200 bg-white px-4 md:px-3 md:py-0 flex items-center justify-between shadow-xs shrink-0">.*?</div>      <div className="flex-1 overflow-y-auto p-4">',
    header_replacement + '\n      <div className="flex-1 overflow-y-auto p-4">',
    content,
    flags=re.DOTALL,
    count=1
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
