import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'const mockImages = INITIAL_SWATCHES.slice(0, 5).map(swatch => ({',
    'console.log("Desktop upload triggered", files.length, "INITIAL_SWATCHES:", INITIAL_SWATCHES.length);\n      const mockImages = INITIAL_SWATCHES.slice(0, 5).map(swatch => ({'
)
content = content.replace(
    'if (onImagesQueued) {',
    'console.log("Queuing images:", mockImages);\n      if (onImagesQueued) {'
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
