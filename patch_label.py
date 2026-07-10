import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

old_label = '<label className="text-[10px] md:text-[9px] md:leading-none font-bold uppercase tracking-wider text-slate-400 md:text-black block mb-1 md:mb-1">'
new_label = '<label className={`text-[10px] md:text-[9px] md:leading-none font-bold uppercase tracking-wider text-slate-400 block mb-1 md:mb-1 ${isDesktopActionDisabled ? \'md:text-slate-400\' : \'md:text-black\'}`}>'

content = content.replace(old_label, new_label)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
