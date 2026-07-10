import re

with open('./src/features/logging/useCaptureSession.js', 'r') as f:
    content = f.read()

content = content.replace(
    "const [applyToCurrentOnly, setApplyToCurrentOnly] = useState(false);",
    "const [applyToCurrentOnly, setApplyToCurrentOnly] = useState(false);\n  const [viewerTheme, setViewerTheme] = useState('dark');"
)

content = content.replace(
    "handleImagesQueued",
    "handleImagesQueued,\n    viewerTheme,\n    setViewerTheme"
)

with open('./src/features/logging/useCaptureSession.js', 'w') as f:
    f.write(content)
