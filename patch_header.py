import re

with open('src/components/layout/Header.jsx', 'r') as f:
    content = f.read()

# 1. Change getModuleTitle
content = content.replace(
    "case 'logging':\n        return 'Capture Session';",
    "case 'logging':\n        return 'Add swatches';"
)

# 2. Remove '+' icon from logging
content = content.replace(
    "{activeModule !== 'batch' && activeModule !== 'all_swatches' && (",
    "{activeModule !== 'batch' && activeModule !== 'all_swatches' && activeModule !== 'logging' && ("
)

with open('src/components/layout/Header.jsx', 'w') as f:
    f.write(content)

