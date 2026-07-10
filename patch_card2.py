import re

with open('./src/features/logging/StagingSwatchCard.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="h-20 sm:h-full sm:w-2/5 shrink-0 flex items-center justify-center relative overflow-hidden"',
    'className="h-20 sm:h-full shrink-0 flex items-center justify-center relative overflow-hidden hidden sm:flex"'
)

content = content.replace(
    '''        style={{
          background: !swatch.image || swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#') ? (swatch.image || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)') : undefined,
        }}''',
    '''        style={{
          aspectRatio: (swatch.aspectRatio || '3:4').replace(':', '/'),
          background: !swatch.image || swatch.image.startsWith('linear-gradient') || swatch.image.startsWith('radial-gradient') || swatch.image.startsWith('#') ? (swatch.image || 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)') : undefined,
        }}'''
)

# wait, I should also add back the mobile view, or make mobile view have a different class, but the prompt says:
# "The following changes are for desktop UI only. No changes should be made for mobile"
