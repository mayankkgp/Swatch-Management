import re

with open('./src/services/swatchServices.js', 'r') as f:
    content = f.read()

content = content.replace(
    "import simulateNetwork from '../utils/simulateNetwork.js';",
    "import simulateNetwork from '../utils/simulateNetwork.js';\nimport { get, set } from 'idb-keyval';"
)

content = content.replace(
    "const rawData = localStorage.getItem(BATCHES_KEY);",
    "const rawData = await get(BATCHES_KEY);"
)
content = content.replace(
    "localStorage.setItem(BATCHES_KEY, JSON.stringify(updatedBatches));",
    "await set(BATCHES_KEY, JSON.stringify(updatedBatches));"
)
content = content.replace(
    "const rawData = localStorage.getItem(RECORDS_KEY);",
    "const rawData = await get(RECORDS_KEY);"
)
content = content.replace(
    "localStorage.setItem(RECORDS_KEY, JSON.stringify(updatedSwatches));",
    "await set(RECORDS_KEY, JSON.stringify(updatedSwatches));"
)
content = content.replace(
    "const rawSwatches = localStorage.getItem(RECORDS_KEY);",
    "const rawSwatches = await get(RECORDS_KEY);"
)
content = content.replace(
    "const rawBatches = localStorage.getItem(BATCHES_KEY);",
    "const rawBatches = await get(BATCHES_KEY);"
)
content = content.replace(
    "const rawData = localStorage.getItem(ACTIVE_DEFAULTS_KEY);",
    "const rawData = await get(ACTIVE_DEFAULTS_KEY);"
)
content = content.replace(
    "localStorage.setItem(ACTIVE_DEFAULTS_KEY, JSON.stringify(newDefaults));",
    "await set(ACTIVE_DEFAULTS_KEY, JSON.stringify(newDefaults));"
)

with open('./src/services/swatchServices.js', 'w') as f:
    f.write(content)

