import re

with open('./src/features/batches/BulkEditPanelFormSection.jsx', 'r') as f:
    content = f.read()

# add import
content = content.replace(
    "import { ChevronDown, Image as ImageIcon, Upload } from 'lucide-react';",
    "import { ChevronDown, Image as ImageIcon, Upload } from 'lucide-react';\nimport SearchableSelect from '../../components/ui/SearchableSelect';"
)

# Replace vendorName select
vendor_regex = re.compile(r'<div className="relative">\s*<select\s*disabled=\{isDisabled\}\s*value=\{formData\.vendorName\}\s*onChange=\{\(e\) => handleInputChange\(\'vendorName\', e\.target\.value\)\}\s*className=\{selectClass\}\s*>\s*<option value="">Keep original values</option>\s*\{VENDOR_NAMES\.map\(v => <option key=\{v\} value=\{v\}>\{v\}</option>\)\}\s*</select>\s*<div className="absolute inset-y-0 right-3\.5 flex items-center pointer-events-none text-slate-400">\s*<ChevronDown className="size-3\.5" />\s*</div>\s*</div>')
new_vendor = '''<SearchableSelect
          disabled={isDisabled}
          value={formData.vendorName}
          onChange={(val) => handleInputChange('vendorName', val)}
          options={VENDOR_NAMES}
          placeholder="Keep original values"
          className={selectClass}
        />'''
content = vendor_regex.sub(new_vendor, content)

# Replace structure select
structure_regex = re.compile(r'<div className="relative">\s*<select\s*disabled=\{isDisabled\}\s*value=\{formData\.structure\}\s*onChange=\{\(e\) => handleInputChange\(\'structure\', e\.target\.value\)\}\s*className=\{selectClass\}\s*>\s*<option value="">Keep original values</option>\s*\{STRUCTURES\.map\(s => <option key=\{s\} value=\{s\}>\{s\}</option>\)\}\s*</select>\s*<div className="absolute inset-y-0 right-3\.5 flex items-center pointer-events-none text-slate-400">\s*<ChevronDown className="size-3\.5" />\s*</div>\s*</div>')
new_structure = '''<SearchableSelect
          disabled={isDisabled}
          value={formData.structure}
          onChange={(val) => handleInputChange('structure', val)}
          options={STRUCTURES}
          placeholder="Keep original values"
          className={selectClass}
        />'''
content = structure_regex.sub(new_structure, content)

with open('./src/features/batches/BulkEditPanelFormSection.jsx', 'w') as f:
    f.write(content)

