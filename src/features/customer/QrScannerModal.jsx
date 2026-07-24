import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, QrCode, Plus, X } from 'lucide-react';
import INITIAL_SWATCHES_RAW from '../../data/mock-swatch.json';

export default function QrScannerModal({ isScannerOpen, setIsScannerOpen, handleAddSwatch }) {
  return (
    <AnimatePresence>
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-sm bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl p-5 flex flex-col items-center text-center relative overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setIsScannerOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="size-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2">
              <Camera className="size-5" />
            </div>

            <h3 className="text-sm font-bold font-display text-white">
              Scan Fabric Barcode / QR
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 mb-4">
              Align the fabric swatch QR code within the viewfinder below
            </p>

            {/* Viewfinder simulation */}
            <div className="relative size-48 rounded-xl border-2 border-indigo-500/40 bg-slate-950 flex items-center justify-center overflow-hidden mb-4">
              {/* Corner reticles */}
              <div className="absolute top-2 left-2 size-4 border-t-2 border-l-2 border-indigo-400" />
              <div className="absolute top-2 right-2 size-4 border-t-2 border-r-2 border-indigo-400" />
              <div className="absolute bottom-2 left-2 size-4 border-b-2 border-l-2 border-indigo-400" />
              <div className="absolute bottom-2 right-2 size-4 border-b-2 border-r-2 border-indigo-400" />

              {/* Laser animation */}
              <motion.div
                animate={{ y: [-80, 80, -80] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-x-2 h-[2px] bg-rose-500 shadow-[0_0_12px_#f43f5e]"
              />

              <QrCode className="size-16 text-slate-700" />
            </div>

            {/* Quick Select Fabric Swatch */}
            <div className="w-full text-left mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block mb-2">
                Select Swatch to Add
              </span>
              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {INITIAL_SWATCHES_RAW.slice(0, 6).map((sw) => (
                  <button
                    key={sw.id}
                    type="button"
                    onClick={() => handleAddSwatch(sw)}
                    className="w-full bg-slate-800 hover:bg-slate-700 p-2 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer border border-slate-700/50"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className="size-6 rounded border border-slate-600 shrink-0"
                        style={{ background: sw.image }}
                      />
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {sw.vendorName} ({sw.vendorSku})
                      </span>
                    </div>
                    <Plus className="size-3.5 text-indigo-400 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
