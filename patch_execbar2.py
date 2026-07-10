import re

with open('./src/features/logging/ExecutionBar.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex items-center gap-2 md:gap-4">',
    '<div className="flex items-center gap-2 md:gap-6">'
)

with open('./src/features/logging/ExecutionBar.jsx', 'w') as f:
    f.write(content)
