import re

with open('./src/features/logging/StagingSwatchCard.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="h-20 sm:h-full sm:w-2/5 shrink-0 flex items-center justify-center relative overflow-hidden"',
    'className="h-20 sm:h-full shrink-0 flex items-center justify-center relative overflow-hidden"\n        style={{ aspectRatio: "3/4" }}'
)

# wait, we already have a style prop on that div!
