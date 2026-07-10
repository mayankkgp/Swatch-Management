import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

replacement = """
        <>
          <div 
            style={{ 
              background: activeImage,
              transform: `rotate(${rotation}deg)`
            }}
            className="md:hidden max-h-[80%] max-w-[80%] h-full w-full transition-transform duration-300 rounded shadow-lg select-none"
          />
          <div 
            style={{ 
              background: activeImage,
              transform: `rotate(${rotation}deg)`,
              aspectRatio: (aspectRatio || '3:4').replace(':', '/')
            }}
            className="hidden md:block h-full max-h-[80%] w-auto transition-transform duration-300 rounded shadow-lg select-none"
          />
        </>
"""

content = re.sub(
    r"<div \s*style=\{\{ \s*background: activeImage,\s*transform: `rotate\(\$\{rotation\}deg\)`,?\s*aspectRatio: \(aspectRatio \|\| '3:4'\)\.replace\(':', '/'\)\s*\}\}\s*className=\"max-h-\[80%\] max-w-\[80%\] h-auto w-auto transition-transform duration-300 rounded shadow-lg select-none\"\s*\/>",
    replacement.strip(),
    content
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
