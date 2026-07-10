import re
with open('./src/features/logging/CaptureSession.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "<StagingQueueOverlay \n          stagedSwatches={stagedSwatches}",
    "<StagingQueueOverlay \n          stagedSwatches={stagedSwatches}\n          onRefresh={props.onRefresh}"
)

with open('./src/features/logging/CaptureSession.jsx', 'w') as f:
    f.write(content)
