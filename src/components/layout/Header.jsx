import React, { useState, useEffect } from 'react';
import { Menu, Layers, SwatchBook, Plus, LogOut, Sun, Moon, CheckSquare, Square } from 'lucide-react';
import { clear } from 'idb-keyval';
import MobileDrawer from './MobileDrawer.jsx';

export default function Header({ activeModule, onNavigate, viewerTheme, setViewerTheme, showStagingQueue }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isBulkEdit, setIsBulkEdit] = useState(false);

  useEffect(() => {
    const handleBulkEditChanged = (e) => setIsBulkEdit(e.detail);
    window.addEventListener('all-swatches-bulk-edit-changed', handleBulkEditChanged);
    return () => window.removeEventListener('all-swatches-bulk-edit-changed', handleBulkEditChanged);
  }, []);

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'batch':
        return 'Batch Directory';
      case 'all_swatches':
        return 'All Swatches';
      case 'logging':
        return 'Add swatches';
      default:
        return 'Swatch Interface';
    }
  };

  return (
    <>
      <header
        id="app-global-header"
        className="w-full bg-white border-b border-slate-200 text-slate-800 select-none z-40 relative"
      >
        {/* DESKTOP HEADER FRAME: h-8 (32px), 13px font scale */}
        <div className="hidden md:flex h-8 items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-[13px] tracking-tight text-slate-900">
              FABRITO SWATCH
            </span>
            <span className="text-slate-300 text-[10px] font-mono">/</span>
            <span className="text-slate-500 text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded uppercase font-semibold">
              {activeModule === 'logging' ? 'Add Swatches' : getModuleTitle()}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wide text-slate-400">
                USER:
              </span>
              <span className="text-[11px] font-medium text-slate-600">
                Mayank Narain
              </span>
            </div>
            <div className="w-[1px] h-3 bg-slate-200" />
            <button
              id="header-logout-btn"
              onClick={() => {
                if (window.confirm("Are you sure you want to log out? This will reset the local database to seeds.")) {
                  clear(); localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-md focus:outline-none flex items-center justify-center cursor-pointer"
              title="Log Out"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>

        {/* MOBILE HEADER FRAME: h-10 (40px), 16px font scale */}
        <div className="flex md:hidden h-10 items-center justify-between px-4">
          <button
            id="mobile-hamburger-btn"
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 -ml-1 rounded-md text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex-1 text-center px-2">
            <h1 className="text-[16px] font-semibold font-display tracking-tight text-slate-900 truncate">
              {getModuleTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-1">
            {activeModule === 'all_swatches' && (
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('toggle-all-swatches-bulk-edit'));
                }}
                className="md:hidden p-1.5 -mr-1 rounded-md text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                title="Select Swatches"
              >
                {isBulkEdit ? <CheckSquare className="size-5 text-indigo-600" strokeWidth={2} /> : <Square className="size-5" strokeWidth={2} />}
              </button>
            )}
            {activeModule === 'logging' && setViewerTheme && !showStagingQueue && (
              <button
                type="button"
                onClick={() => setViewerTheme(viewerTheme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-md text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
                title="Toggle Viewer Background"
              >
                {viewerTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </button>
            )}
            {activeModule !== 'batch' && activeModule !== 'all_swatches' && activeModule !== 'logging' && (
              <button
                id="mobile-quick-log-btn"
                onClick={() => onNavigate('logging')}
                className={`p-1.5 rounded-md relative ${
                  activeModule === 'logging'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Start New Session"
              >
                <Plus className="size-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeModule={activeModule}
        onNavigate={onNavigate}
      />
    </>
  );
}
