import re

with open('./src/features/logging/InputTray.jsx', 'r') as f:
    content = f.read()

# add import
content = content.replace(
    "import Input from '../../components/ui/Input';",
    "import Input from '../../components/ui/Input';\nimport SearchableSelect from '../../components/ui/SearchableSelect';"
)

# Replace vendorName select
vendor_regex = re.compile(r'<div className="relative">\s*<select\s*value=\{formData\.vendorName \|\| \'\'\}\s*onChange=\{\(e\) => handleInputChange\(\'vendorName\', e\.target\.value\)\}\s*className=\{selectClass\}\s*>\s*<option value="">Select Vendor...</option>\s*\{VENDOR_NAMES\.map\(v => <option key=\{v\} value=\{v\}>\{v\}</option>\)\}\s*</select>\s*<div className="absolute inset-y-0 right-3 md:right-3\.5 flex items-center pointer-events-none text-slate-400">\s*<ChevronDown className="size-4 md:size-3\.5" />\s*</div>\s*</div>')
new_vendor = '''<SearchableSelect
            value={formData.vendorName || ''}
            onChange={(val) => handleInputChange('vendorName', val)}
            options={VENDOR_NAMES}
            placeholder="Select Vendor..."
            className={selectClass}
          />'''
content = vendor_regex.sub(new_vendor, content)

# Replace structure select
structure_regex = re.compile(r'<div className="relative">\s*<select\s*value=\{formData\.structure \|\| \'\'\}\s*onChange=\{\(e\) => handleInputChange\(\'structure\', e\.target\.value\)\}\s*className=\{selectClass\}\s*>\s*<option value="">Select Structure...</option>\s*\{STRUCTURES\.map\(s => <option key=\{s\} value=\{s\}>\{s\}</option>\)\}\s*</select>\s*<div className="absolute inset-y-0 right-3 md:right-3\.5 flex items-center pointer-events-none text-slate-400">\s*<ChevronDown className="size-4 md:size-3\.5" />\s*</div>\s*</div>')
new_structure = '''<SearchableSelect
            value={formData.structure || ''}
            onChange={(val) => handleInputChange('structure', val)}
            options={STRUCTURES}
            placeholder="Select Structure..."
            className={selectClass}
          />'''
content = structure_regex.sub(new_structure, content)

with open('./src/features/logging/InputTray.jsx', 'w') as f:
    f.write(content)

