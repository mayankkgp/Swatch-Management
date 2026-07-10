import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

replacement = """
      ) : (
        <>
          <img 
            src={activeImage} 
            alt="Captured fabric asset" 
            className="md:hidden max-h-full max-w-full object-contain transition-transform duration-300 select-none"
            style={{ transform: `rotate(${rotation}deg)` }}
            referrerPolicy="no-referrer"
          />
          <img 
            src={activeImage} 
            alt="Captured fabric asset" 
            className="hidden md:block h-full max-h-[80%] w-auto object-cover transition-transform duration-300 rounded shadow-lg select-none"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              aspectRatio: (aspectRatio || '3:4').replace(':', '/')
            }}
            referrerPolicy="no-referrer"
          />
        </>
      )}
"""

content = re.sub(
    r"\) : \(\s*<img\s*src=\{activeImage\}\s*alt=\"Captured fabric asset\"\s*className=\"max-h-full max-w-full object-contain transition-transform duration-300 select-none\"\s*style=\{\{ transform: `rotate\(\$\{rotation\}deg\)` \}\}\s*referrerPolicy=\"no-referrer\"\s*\/>\s*\)\}",
    replacement.strip(),
    content
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
