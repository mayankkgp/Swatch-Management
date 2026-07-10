import re
with open('./src/features/logging/CaptureSession.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    '''  const {
    activeImage,''',
    '''  const {
    activeImage,'''
)

with open('./src/features/logging/CaptureSession.jsx', 'w') as f:
    f.write(content)
