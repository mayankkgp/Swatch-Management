import re

with open('src/App.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    '          className={`flex-1 bg-slate-50 transition-all duration-300 flex flex-col relative ${\n            (activeModule === \'batch\' || activeModule === \'all_swatches\') ? \'p-0 md:p-3 overflow-hidden h-full\' : \'p-4 md:p-3 overflow-y-auto\'\n          }`}',
    '          className={`flex-1 bg-slate-50 transition-all duration-300 flex flex-col relative ${\n            (activeModule === \'batch\' || activeModule === \'all_swatches\' || activeModule === \'logging\') ? \'p-0 md:p-3 overflow-hidden h-full\' : \'p-4 md:p-3 overflow-y-auto\'\n          }`}'
)

with open('src/App.jsx', 'w') as f:
    f.write(content)

