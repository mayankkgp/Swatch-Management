import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

replacement1 = """          <div 
            className="hidden md:flex items-center justify-center h-[80%] max-h-full shrink-0 w-auto"
            style={{ 
              aspectRatio: (aspectRatio || '3:4').replace(':', '/')
            }}
          >"""

content = re.sub(
    r'<div \n            className="hidden md:flex items-center justify-center h-\[80%\] max-h-full"\n            style={{\n               aspectRatio: \(aspectRatio \|\| \'3:4\'\)\.replace\(\':\', \'/\'\)\n            }}\n          >',
    replacement1,
    content
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
