import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

replacement = """        <>
          <div className="md:hidden w-[80%] max-w-full flex items-center justify-center">
            <div 
              style={{ 
                background: activeImage,
                transform: `rotate(${rotation}deg)`,
                aspectRatio: '1/1'
              }}
              className="w-full transition-transform duration-300 rounded shadow-lg select-none"
            />
          </div>
          <div 
            className="hidden md:flex items-center justify-center h-[80%] max-h-full"
            style={{ 
              aspectRatio: (aspectRatio || '3:4').replace(':', '/')
            }}
          >
            <div 
              style={{ 
                background: activeImage,
                transform: `rotate(${rotation}deg)`
              }}
              className="w-full h-full transition-transform duration-300 rounded shadow-lg select-none"
            />
          </div>
        </>"""

content = re.sub(
    r"<>.*?<img.*?className=\"md:hidden.*?\/>.*?<img.*?className=\"hidden md:block.*?\/>.*?</>",
    replacement,
    content,
    flags=re.DOTALL
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
