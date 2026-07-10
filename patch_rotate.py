import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

replacement = """      <button
        type="button"
        onClick={handleRotate}
        className={`absolute bottom-4 right-4 backdrop-blur-md p-2.5 rounded-full shadow-lg transition-colors cursor-pointer bg-white/10 hover:bg-white/20 text-white ${viewerTheme === 'light' ? 'md:bg-slate-900/10 md:hover:bg-slate-900/20 md:text-slate-700' : 'md:bg-white/10 md:hover:bg-white/20 md:text-white'}`}
        title="Rotate Image"
      >"""

content = re.sub(
    r'<button\s+type="button"\s+onClick={handleRotate}\s+className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full shadow-lg transition-colors cursor-pointer"\s+title="Rotate Image"\s*>',
    replacement,
    content
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
