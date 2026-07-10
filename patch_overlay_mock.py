import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import StagingSwatchCard from './StagingSwatchCard';", "import SwatchCard from '../batches/SwatchCard';\nimport MOCK_SWATCHES from '../../data/mock-swatch.json';")

replacement = """        {stagedSwatches.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {MOCK_SWATCHES.slice(0, 20).map(swatch => (
              <SwatchCard 
                key={swatch.id} 
                swatch={swatch} 
                isBulkEditMode={false}
                isSelected={false}
                isCurrentlyEditing={false}
                onToggleSelect={() => {}}
                onSave={() => {}}
                onDelete={() => {}}
                onView={() => {}}
                onEdit={() => {}}
                onMobileEditStateChange={() => {}}
              />
            ))}
          </div>
        ) : ("""

content = re.sub(
    r'        \{stagedSwatches.length === 0 \? \(\n          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">\n            <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">\n              <Check className="size-6 text-slate-300" />\n            </div>\n            <p className="text-xs font-mono">Queue is empty</p>\n          </div>\n        \) : \(',
    replacement,
    content
)

content = content.replace(
    '<StagingSwatchCard \n                key={swatch.id} \n                swatch={swatch} \n                onDelete={onDeleteSwatch} \n              />',
    '<SwatchCard \n                key={swatch.id} \n                swatch={swatch} \n                isBulkEditMode={false}\n                isSelected={false}\n                isCurrentlyEditing={false}\n                onToggleSelect={() => {}}\n                onSave={() => {}}\n                onDelete={() => {}}\n                onView={() => {}}\n                onEdit={() => {}}\n                onMobileEditStateChange={() => {}}\n              />'
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
