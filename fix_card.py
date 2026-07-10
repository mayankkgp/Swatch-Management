import re

with open('./src/features/logging/StagingSwatchCard.jsx', 'r') as f:
    content = f.read()

# restore to original first if modified
content = content.replace('className="h-20 sm:h-full shrink-0 flex items-center justify-center relative overflow-hidden hidden sm:flex"', 'className="h-20 sm:h-full sm:w-2/5 shrink-0 flex items-center justify-center relative overflow-hidden"')

replacement = """      {/* Mobile view - no changes */}
      <div 
        className="h-20 shrink-0 flex items-center justify-center relative overflow-hidden sm:hidden"
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
      </div>

      {/* Desktop view - 3:4 portrait aspect ratio */}
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
      </div>"""

# Find the block we want to replace
pattern = r'<div\s+className="h-20 sm:h-full sm:w-2/5 shrink-0 flex items-center justify-center relative overflow-hidden".*?</div>\s*</div>'

# Actually we want to replace the single <div> that contains the image and text.
# Let's just do it manually with find/replace string since regex with dotall can be tricky.
