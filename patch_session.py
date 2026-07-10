import re

with open('./src/features/logging/CaptureSession.jsx', 'r') as f:
    content = f.read()

replacement = """        <CaptureZone 
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          rotation={rotation}
          setRotation={setRotation}
          onImagesQueued={handleImagesQueued}
          aspectRatio={formData.aspectRatio}
          viewerTheme={viewerTheme}
        />"""

# Replace the mangled CaptureZone component
content = re.sub(r'<CaptureZone.*?/>', replacement, content, flags=re.DOTALL)

with open('./src/features/logging/CaptureSession.jsx', 'w') as f:
    f.write(content)
