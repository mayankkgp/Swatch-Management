import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

replacement = """        <>
          <div className="md:hidden w-[80%] max-w-full flex items-center justify-center">
            <img 
              src={activeImage}
              alt="Captured fabric asset"
              style={{ 
                transform: `rotate(${rotation}deg)`,
                aspectRatio: '1/1'
              }}
              className="w-full object-contain transition-transform duration-300 rounded shadow-lg select-none"
              referrerPolicy="no-referrer"
            />
          </div>
          <div 
            className="hidden md:flex items-center justify-center h-[80%] max-h-full"
            style={{ 
              aspectRatio: (aspectRatio || '3:4').replace(':', '/')
            }}
          >
            <img 
              src={activeImage}
              alt="Captured fabric asset"
              style={{ 
                transform: `rotate(${rotation}deg)`
              }}
              className="w-full h-full object-cover transition-transform duration-300 rounded shadow-lg select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </>"""

content = re.sub(
    r"\) : \(\s*<>\s*<div className=\"md:hidden.*?</>\s*\)\}",
    ") : (\n" + replacement + "\n      )}",
    content,
    flags=re.DOTALL
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
