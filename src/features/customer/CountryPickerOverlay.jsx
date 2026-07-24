import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Check } from 'lucide-react';

export default function CountryPickerOverlay({
  isCountryPickerOpen,
  setIsCountryPickerOpen,
  countrySearchQuery,
  setCountrySearchQuery,
  filteredCountries,
  selectedCountry,
  setSelectedCountry,
}) {
  return (
    <AnimatePresence>
      {isCountryPickerOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed inset-0 z-[100] w-full h-[100dvh] bg-white flex flex-col overflow-hidden"
        >
          {/* Fixed Top Header (Safe Zone) */}
          <div 
            className="flex-none bg-white border-b border-slate-200 px-4 py-3 space-y-3 z-10"
            style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top, 0px))' }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-800">
                Select Country Code
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCountryPickerOpen(false);
                  setCountrySearchQuery('');
                }}
                className="p-1.5 -mr-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative flex items-center">
              <Search className="size-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={countrySearchQuery}
                onChange={(e) => setCountrySearchQuery(e.target.value)}
                placeholder="Search country name or code..."
                className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* Scrollable List Area */}
          <div
            className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white"
            onTouchStart={() => {
              if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
              }
            }}
          >
            {filteredCountries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                No country found
              </div>
            ) : (
              filteredCountries.map((c) => (
                <button
                  key={c.iso}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c);
                    setIsCountryPickerOpen(false);
                    setCountrySearchQuery('');
                  }}
                  className={`w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer ${
                    selectedCountry.iso === c.iso ? 'bg-slate-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{c.flag}</span>
                    <span className="text-sm font-medium text-slate-800">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{c.code}</span>
                    {selectedCountry.iso === c.iso && (
                      <Check className="size-4 text-emerald-600" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
