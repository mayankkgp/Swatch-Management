import re

with open('src/components/layout/Sidebar.jsx', 'r') as f:
    content = f.read()

content = content.replace(
    "import { Layers, SwatchBook } from 'lucide-react';",
    "import { Layers, SwatchBook, Plus } from 'lucide-react';"
)

nav_swatches = '''        {/* [ All Swatches ] Navigation CTA */}
        <button
          id="sidebar-nav-swatches"
          onClick={() => onNavigate('all_swatches')}
          title="All Swatches"
          className={`flex items-center justify-center size-6 rounded-md transition-all ${
            activeModule === 'all_swatches'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <SwatchBook className="size-3.5" />
        </button>'''

new_nav_swatches = nav_swatches + '''

        <div className="w-full flex justify-center pt-2 border-t border-slate-100 mt-0.5">
          <button
            id="sidebar-nav-log"
            onClick={() => onNavigate('logging')}
            title="Add Swatches"
            className={`flex items-center justify-center size-6 rounded-md transition-all ${
              activeModule === 'logging'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <Plus className="size-3.5" />
          </button>
        </div>'''

content = content.replace(nav_swatches, new_nav_swatches)

with open('src/components/layout/Sidebar.jsx', 'w') as f:
    f.write(content)
