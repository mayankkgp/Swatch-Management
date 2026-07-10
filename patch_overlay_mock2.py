import re

with open('./src/features/logging/StagingQueueOverlay.jsx', 'r') as f:
    content = f.read()

replacement = """      <div className="flex-1 overflow-y-auto p-4">
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
      </div>"""

content = re.sub(
    r'<div className="flex-1 overflow-y-auto p-4">.*?</div>\n      </div>',
    replacement,
    content,
    flags=re.DOTALL
)

with open('./src/features/logging/StagingQueueOverlay.jsx', 'w') as f:
    f.write(content)
