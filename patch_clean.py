import re

with open('./src/features/batches/BulkEditPanelFormSection.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className={`${inputClass} ${typeof type !== \'undefined\' && type === \'number\' ? \'md:[&::-webkit-outer-spin-button]:appearance-none md:[&::-webkit-inner-spin-button]:appearance-none md:[-moz-appearance:textfield]\' : \'md:[&::-webkit-outer-spin-button]:appearance-none md:[&::-webkit-inner-spin-button]:appearance-none md:[-moz-appearance:textfield]\'}`}',
    'className={`${inputClass} md:[&::-webkit-outer-spin-button]:appearance-none md:[&::-webkit-inner-spin-button]:appearance-none md:[-moz-appearance:textfield]`}'
)

with open('./src/features/batches/BulkEditPanelFormSection.jsx', 'w') as f:
    f.write(content)

