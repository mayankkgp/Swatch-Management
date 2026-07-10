import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

footer = """
      <div className="flex-none bg-white border-t border-slate-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.05)] p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Batch Name <span className="text-red-500">*</span>
          </label>
          <Input 
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="Enter a descriptive batch name..."
            className="w-full h-10 px-3 border-slate-300 text-sm font-medium focus:ring-indigo-100 focus:border-indigo-500"
            disabled={isSavingBatch}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-5">
          <Button
            onClick={() => onSaveBatch(batchName)}
            disabled={isSaveDisabled}
            className="flex-1 sm:flex-none h-10 px-5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            {isSavingBatch ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            <span>Save Batch</span>
          </Button>
          
          <Button
            onClick={handleSaveAndPrint}
            disabled={isSaveDisabled || isPrinting}
            className="flex-1 sm:flex-none h-10 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 disabled:text-indigo-400 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            {isPrinting ? (
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Printer className="size-4" />
            )}
            <span>Save & Print</span>
          </Button>
        </div>
      </div>
"""

content = content.replace("    </div>\n  );\n}", footer + "    </div>\n  );\n}")

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
