import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="hidden md:flex items-center justify-center h-[80%] max-h-full"',
    'className="hidden md:flex items-center justify-center h-[80%] max-h-full shrink-0 w-auto"'
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
