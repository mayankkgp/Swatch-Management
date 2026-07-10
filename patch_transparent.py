import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

replacement = """        <>
          <img 
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            style={{ 
              background: activeImage,
              transform: `rotate(${rotation}deg)`
            }}
            className="md:hidden max-h-[80%] max-w-[80%] h-full w-full transition-transform duration-300 rounded shadow-lg select-none"
          />
          <img 
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            style={{ 
              background: activeImage,
              transform: `rotate(${rotation}deg)`,
              aspectRatio: (aspectRatio || '3:4').replace(':', '/')
            }}
            className="hidden md:block h-full max-h-[80%] w-auto transition-transform duration-300 rounded shadow-lg select-none"
          />
        </>"""

content = re.sub(
    r"<>.*?<div.*?className=\"md:hidden.*?\/>.*?<div.*?className=\"hidden md:block.*?\/>.*?</>",
    replacement,
    content,
    flags=re.DOTALL
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
