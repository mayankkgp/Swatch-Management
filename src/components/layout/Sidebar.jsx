import React from 'react';
import { Layers, SwatchBook, Plus } from 'lucide-react';

export default function Sidebar({ activeModule, onNavigate }) {
  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col items-center justify-between w-8 h-[calc(100vh-32px)] border-r border-slate-200 bg-slate-50 select-none flex-shrink-0"
    >
      {/* Top Section - Navigation Targets */}
      <div className="flex flex-col items-center gap-1.5 pt-2 w-full">
        {/* [ Batch ] Navigation CTA */}
        <button
          id="sidebar-nav-batch"
          onClick={() => onNavigate('batch')}
          title="Batches"
          className={`flex items-center justify-center size-6 rounded-md transition-all ${
            activeModule === 'batch'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <Layers className="size-3.5" />
        </button>

        {/* [ All Swatches ] Navigation CTA */}
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
        </button>

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
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center pb-2 w-full">
        <span
          title="Workspace Version"
          className="text-[8px] font-mono font-bold text-slate-400 rotate-270 leading-none py-1"
        >
          v1.0
        </span>
      </div>
    </aside>
  );
}
