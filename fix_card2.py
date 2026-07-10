import re

with open('./src/features/logging/StagingSwatchCard.jsx', 'r') as f:
    content = f.read()

replacement = """      {/* Desktop view - 3:4 portrait aspect ratio */}
      <div 
        className="hidden sm:flex h-full shrink-0 items-center justify-center relative overflow-hidden"
        style={{
          aspectRatio: (swatch.aspectRatio || '3:4').replace(':', '/'),
          background: !swatch.image || swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#') ? (swatch.image || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)') : undefined,
        }}
      >
        {swatch.image && !(swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#')) && (
          <img 
            src={swatch.image} 
            alt={`Swatch ${swatch.id}`} 
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-start p-2 pointer-events-none">
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">{swatch.id}</span>
        </div>
      </div>

      {/* Mobile full width view */}
      <div 
        className="sm:hidden h-20 w-full shrink-0 flex items-center justify-center relative overflow-hidden"
        style={{
          background: !swatch.image || swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#') ? (swatch.image || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)') : undefined,
        }}
      >
        {swatch.image && !(swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#')) && (
          <img 
            src={swatch.image} 
            alt={`Swatch ${swatch.id}`} 
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-2 pointer-events-none">
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">{swatch.id}</span>
        </div>
      </div>"""

content = re.sub(r'<div \n        className="h-20 w-full sm:h-full sm:w-auto shrink-0 flex items-center justify-center relative overflow-hidden".*?</div>\n      </div>', replacement, content, flags=re.DOTALL)

with open('./src/features/logging/StagingSwatchCard.jsx', 'w') as f:
    f.write(content)
