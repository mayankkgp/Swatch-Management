import re

with open('./src/App.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import Header from './components/layout/Header.jsx';",
    "import Header from './components/layout/Header.jsx';\nimport { get, set, del } from 'idb-keyval';"
)

with open('./src/App.jsx', 'w') as f:
    f.write(content)
