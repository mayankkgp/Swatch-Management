import re

with open('./src/features/logging/CaptureZone.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''  const handleDesktopImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {''',
    '''  const handleDesktopImageUpload = (e) => {
    console.log("Desktop image upload triggered", e.target.files);
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      console.log("INITIAL_SWATCHES:", INITIAL_SWATCHES);'''
)

with open('./src/features/logging/CaptureZone.jsx', 'w') as f:
    f.write(content)
