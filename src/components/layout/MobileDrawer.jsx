import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, SwatchBook, X, Plus } from 'lucide-react';

export default function MobileDrawer({ isOpen, onClose, activeModule, onNavigate }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="mobile-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Drawer Panel */}
          <motion.div
            id="mobile-drawer-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-white text-slate-800 shadow-2xl flex flex-col border-r border-slate-200"
          >
            {/* Drawer Header */}
            <div className="h-10 px-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
              <span className="text-base font-semibold tracking-tight font-display text-slate-900">
                Swatch Log
              </span>
              <button
                id="close-drawer-btn"
                onClick={onClose}
                className="p-1.5 rounded-md text-slate-500 hover:bg-slate-200 transition-colors focus:outline-none"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Touch targets */}
            <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
              {/* Batch Management Destination */}
              <button
                id="nav-mobile-batch"
                onClick={() => {
                  onNavigate('batch');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeModule === 'batch'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="size-5" />
                <span className="flex-1 text-left">Batch Management</span>
              </button>

              {/* All Swatches Destination */}
              <button
                id="nav-mobile-swatches"
                onClick={() => {
                  onNavigate('all_swatches');
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeModule === 'all_swatches'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <SwatchBook className="size-5" />
                <span className="flex-1 text-left">All Swatches</span>
              </button>

              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  id="nav-mobile-log"
                  onClick={() => {
                    onNavigate('logging');
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeModule === 'logging'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <Plus className="size-5" />
                  <span className="flex-1 text-left">Add Swatches</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
