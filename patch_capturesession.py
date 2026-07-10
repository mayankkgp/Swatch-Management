import re

with open('./src/features/logging/CaptureSession.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "handleImagesQueued",
    "handleImagesQueued,\n    viewerTheme,\n    setViewerTheme"
)

content = content.replace(
    "aspectRatio={formData.aspectRatio}\n        />",
    "aspectRatio={formData.aspectRatio}\n          viewerTheme={viewerTheme}\n        />"
)

content = content.replace(
    "onClear={handleClearForm}\n        />",
    "onClear={handleClearForm}\n          viewerTheme={viewerTheme}\n          setViewerTheme={setViewerTheme}\n        />"
)

with open('./src/features/logging/CaptureSession.jsx', 'w') as f:
    f.write(content)
