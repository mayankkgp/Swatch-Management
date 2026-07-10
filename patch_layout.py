import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# 1. Update outer wrapper
old_outer = '    <div className="fixed inset-0 md:absolute z-50 flex flex-col bg-slate-50 md:animate-none animate-in slide-in-from-bottom-full duration-200">'
new_outer = '''    <div className={`fixed inset-0 md:absolute z-50 flex flex-col bg-slate-50 md:animate-none animate-in slide-in-from-bottom-full duration-200 ${
      (isBulkEditMode || editingSwatchId || viewingSwatchId) ? 'md:flex-row md:gap-3' : ''
    }`}>'''

content = content.replace(old_outer, new_outer)

# 2. Extract BulkEditPanel so it is a direct child of outer, but before the main wrapper.
# Find the BulkEditPanel block
bulk_edit_regex = re.compile(
    r'( +)\{\(isBulkEditMode \|\| editingSwatchId \|\| viewingSwatchId\) && \(\n +<div className="absolute md:relative inset-y-0 left-0.*?</div>\n +\)\}',
    re.DOTALL
)

match = bulk_edit_regex.search(content)
if match:
    bulk_edit_block = match.group(0)
    # Remove it from its original location
    content = content.replace(bulk_edit_block, '')
    
    # We want to change md:w-full to md:w-[210px] shrink-0 if it's there
    bulk_edit_block = bulk_edit_block.replace('md:w-full', 'md:w-[210px] shrink-0')
    bulk_edit_block = bulk_edit_block.replace('w-[210px]', 'w-full') # Fix for mobile maybe? Wait, what was it before? "w-[210px] md:w-full". Let's change it to "w-full md:w-[210px] shrink-0"
    bulk_edit_block = bulk_edit_block.replace('w-full md:w-[210px] shrink-0', 'w-[210px] shrink-0') # wait let's just use regex
    bulk_edit_block = re.sub(r'w-\[210px\] md:w-full', r'w-full md:w-[210px] shrink-0', bulk_edit_block)
    
    # Insert it right before the Header
    header_start = '            <div className="flex-none h-14 md:h-10 border-b border-slate-200 bg-white px-4 md:px-3 md:py-0 flex items-center justify-between shadow-xs shrink-0">'
    
    # Wrap the rest in a flex-col
    wrapper_start = '      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">'
    
    content = content.replace(header_start, bulk_edit_block + '\n\n' + wrapper_start + '\n' + header_start)

# 3. Add closing tag for the new wrapper_start, right before the last closing div
# The last part of the file is:
#       </div>
#     </div>
#   );
# }

content = content.replace(
    '      </div>\n    </div>\n  );\n}',
    '      </div>\n      </div>\n    </div>\n  );\n}'
)

# 4. Remove the old middle container's grid class logic
old_middle_wrapper = r'<div className={`flex-1 overflow-y-visible md:overflow-hidden min-h-0 relative \$\{\n        \(isBulkEditMode \|\| editingSwatchId \|\| viewingSwatchId\) \? \'grid grid-cols-1 md:grid-cols-\[210px_1fr\] gap-0 md:gap-3 bg-slate-50\' : \'flex flex-col md:flex-row\'\n      \}`}>'
new_middle_wrapper = '<div className="flex-1 overflow-y-visible md:overflow-hidden min-h-0 relative flex flex-col">'

content = re.sub(old_middle_wrapper, new_middle_wrapper, content, flags=re.DOTALL)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)

