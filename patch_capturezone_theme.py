import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "aspectRatio = '3:4'",
    "aspectRatio = '3:4',\n  viewerTheme = 'dark'"
)

# bg-slate-900 border-b border-slate-200 md:border-b-0 relative overflow-hidden min-h-[40vh] md:min-h-0 order-1 md:order-2
# We want to change the bg conditionally based on viewerTheme, but md:bg-white or md:bg-slate-900?
# The prompt says: "change the background of image viewer area from black to white and vice-versa" and "changes are for desktop UI only"
# "in 'add swatches', 'in 'attribute' sidebar have a 'light/dark' toggle switch to change the background of image viewer area from black to white and vice-versa"
# Let's do `bg-slate-900 md:${viewerTheme === 'light' ? 'bg-white' : 'bg-slate-900'}`

content = content.replace(
    'className="flex-1 flex items-center justify-center bg-slate-900 border-b border-slate-200 md:border-b-0 relative overflow-hidden min-h-[40vh] md:min-h-0 order-1 md:order-2"',
    'className={`flex-1 flex items-center justify-center border-b border-slate-200 md:border-b-0 relative overflow-hidden min-h-[40vh] md:min-h-0 order-1 md:order-2 bg-slate-900 ${viewerTheme === \'light\' ? \'md:bg-white\' : \'md:bg-slate-900\'}`}'
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
