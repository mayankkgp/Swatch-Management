import re

with open('./src/features/logging/ExecutionBar.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'export default function ExecutionBar({ \n  stagedCount, ',
    'export default function ExecutionBar({ \n  stagedCount, \n  queueCount = 0,\n'
)

# Fix the left side of the execution bar to include the queue count
replacement_left = """      <div className="flex items-center gap-3">
        <button 
          type="button"
          onClick={onReviewClick}
          className="flex items-center gap-2 h-10 px-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-semibold text-sm cursor-pointer md:h-6 md:text-xs md:px-2.5 md:rounded-sm md:gap-1 md:shadow-xs"
        >
          <Layers className="size-4 md:size-3 text-slate-500" />
          <span>Review</span>
          <div className="bg-slate-900 text-white text-[10px] md:text-[9px] rounded-full min-w-5 h-5 md:min-w-4 md:h-4 px-1.5 md:px-1 flex items-center justify-center font-mono ml-1 md:ml-0.5 shadow-xs">
            {stagedCount}
          </div>
        </button>
        {queueCount > 0 && (
          <span className="hidden md:inline-block text-xs font-medium text-slate-500">
            {queueCount} in queue
          </span>
        )}
      </div>"""

content = re.sub(
    r'<button \n        type="button"\n        onClick={onReviewClick}.*?      </button>',
    replacement_left,
    content,
    flags=re.DOTALL
)

content = content.replace(
    '<div className="flex items-center gap-2 md:gap-2">',
    '<div className="flex items-center gap-2 md:gap-4">'
)

with open('./src/features/logging/ExecutionBar.jsx', 'w') as f:
    f.write(content)
