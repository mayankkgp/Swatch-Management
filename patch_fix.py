import re

with open('./src/features/logging/useCaptureSession.js', 'r') as f:
    content = f.read()

content = content.replace(
'''  const handleImagesQueued,
    viewerTheme,
    setViewerTheme = useCallback((newImages) => {''',
'''  const handleImagesQueued = useCallback((newImages) => {'''
)

with open('./src/features/logging/useCaptureSession.js', 'w') as f:
    f.write(content)
