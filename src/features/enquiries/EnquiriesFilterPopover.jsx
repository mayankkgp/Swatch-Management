import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Search, X } from 'lucide-react';

export default function EnquiriesFilterPopover({
  onClose,
  customerOptions = [],
  selectedCustomers = [],
  setSelectedCustomers,
  amOptions = [],
  selectedAMs = [],
  setSelectedAMs,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedOutcomes = [],
  setSelectedOutcomes,
  activeTab,
  resetFilters,
  isSplitView = false
}) {
  const popoverRef = useRef(null);
  const [openSection, setOpenSection] = useState('customer'); // 'customer' | 'am' | 'date' | 'status'
  const [customerSearch, setCustomerSearch] = useState('');
  const [amSearch, setAmSearch] = useState('');

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleCustomerToggle = (cust) => {
    if (selectedCustomers.includes(cust)) {
      setSelectedCustomers(selectedCustomers.filter((c) => c !== cust));
    } else {
      setSelectedCustomers([...selectedCustomers, cust]);
    }
  };

  const handleAMToggle = (am) => {
    if (selectedAMs.includes(am)) {
      setSelectedAMs(selectedAMs.filter((a) => a !== am));
    } else {
      setSelectedAMs([...selectedAMs, am]);
    }
  };

  const handleOutcomeToggle = (outcome) => {
    if (selectedOutcomes.includes(outcome)) {
      setSelectedOutcomes(selectedOutcomes.filter((o) => o !== outcome));
    } else {
      setSelectedOutcomes([...selectedOutcomes, outcome]);
    }
  };

  const filteredCustomers = customerOptions
    .filter((c) => c.toLowerCase().includes(customerSearch.toLowerCase()))
    .sort((a, b) => {
      if (a.toLowerCase() === 'unassigned') return -1;
      if (b.toLowerCase() === 'unassigned') return 1;
      return a.localeCompare(b);
    });

  const filteredAMs = amOptions
    .filter((a) => a.toLowerCase().includes(amSearch.toLowerCase()))
    .sort((a, b) => {
      if (a.toLowerCase() === 'unassigned') return -1;
      if (b.toLowerCase() === 'unassigned') return 1;
      return a.localeCompare(b);
    });

  const hasAnyFilter =
    selectedCustomers.length > 0 ||
    selectedAMs.length > 0 ||
    fromDate ||
    toDate ||
    (activeTab === 'past' && selectedOutcomes.length > 0);

  return (
    <div
      ref={popoverRef}
      className={`absolute top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-md shadow-xl z-[100] text-slate-800 flex flex-col font-sans ${
        isSplitView ? 'right-0 left-auto' : 'left-0'
      }`}
    >
      {/* Popover Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-3 h-9 shrink-0">
        <span className="text-xs font-bold text-slate-700">Filters</span>
        {hasAnyFilter && (
          <button
            onClick={resetFilters}
            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-[8px] py-[4px] cursor-pointer animate-in fade-in duration-100"
          >
            [ Clear All ]
          </button>
        )}
      </div>

      {/* Accordion Stack */}
      <div className="max-h-[340px] overflow-y-auto flex flex-col divide-y divide-slate-100">

        {/* 1. Customer Section */}
        <div className="flex flex-col">
          <button
            onClick={() => toggleSection('customer')}
            className="flex items-center justify-between w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Customer
              </span>
              {selectedCustomers.length > 0 && (
                <span className="size-2 bg-indigo-600 rounded-full shrink-0" />
              )}
            </div>
            {openSection === 'customer' ? (
              <ChevronUp className="size-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="size-3.5 text-slate-400" />
            )}
          </button>

          {openSection === 'customer' && (
            <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400 pointer-events-none">
                  <Search className="size-3" />
                </span>
                <input
                  type="text"
                  placeholder="Search customer..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded border border-slate-200 focus:outline-hidden focus:border-slate-400 transition-all font-sans pl-7 pr-2 h-7"
                />
              </div>

              <div className="max-h-28 overflow-y-auto flex flex-col gap-1 pr-1">
                {filteredCustomers.map((cust) => {
                  const isUnassigned = cust.toLowerCase() === 'unassigned';
                  return (
                    <label
                      key={cust}
                      className="flex items-center gap-2 cursor-pointer py-[4px] px-[8px] hover:bg-slate-50 rounded transition-colors text-xs text-slate-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(cust)}
                        onChange={() => handleCustomerToggle(cust)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3 cursor-pointer shrink-0"
                      />
                      {isUnassigned ? (
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span className="px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-600 border border-slate-200/80 font-mono text-[10px] uppercase tracking-wider font-semibold">
                            Unassigned
                          </span>
                        </span>
                      ) : (
                        <span className="truncate">{cust}</span>
                      )}
                    </label>
                  );
                })}
                {filteredCustomers.length === 0 && (
                  <span className="text-[10px] text-slate-400 italic px-2 py-1">
                    No matches found
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. AM Section */}
        <div className="flex flex-col">
          <button
            onClick={() => toggleSection('am')}
            className="flex items-center justify-between w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                AM
              </span>
              {selectedAMs.length > 0 && (
                <span className="size-2 bg-indigo-600 rounded-full shrink-0" />
              )}
            </div>
            {openSection === 'am' ? (
              <ChevronUp className="size-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="size-3.5 text-slate-400" />
            )}
          </button>

          {openSection === 'am' && (
            <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-400 pointer-events-none">
                  <Search className="size-3" />
                </span>
                <input
                  type="text"
                  placeholder="Search AM..."
                  value={amSearch}
                  onChange={(e) => setAmSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded border border-slate-200 focus:outline-hidden focus:border-slate-400 transition-all font-sans pl-7 pr-2 h-7"
                />
              </div>

              <div className="max-h-28 overflow-y-auto flex flex-col gap-1 pr-1">
                {filteredAMs.map((am) => {
                  const isUnassigned = am.toLowerCase() === 'unassigned';
                  return (
                    <label
                      key={am}
                      className="flex items-center gap-2 cursor-pointer py-[4px] px-[8px] hover:bg-slate-50 rounded transition-colors text-xs text-slate-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAMs.includes(am)}
                        onChange={() => handleAMToggle(am)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3 cursor-pointer shrink-0"
                      />
                      {isUnassigned ? (
                        <span className="inline-flex items-center gap-1.5 text-xs">
                          <span className="px-1.5 py-0.2 rounded-xs bg-slate-100 text-slate-600 border border-slate-200/80 font-mono text-[10px] uppercase tracking-wider font-semibold">
                            Unassigned
                          </span>
                        </span>
                      ) : (
                        <span className="truncate">{am}</span>
                      )}
                    </label>
                  );
                })}
                {filteredAMs.length === 0 && (
                  <span className="text-[10px] text-slate-400 italic px-2 py-1">
                    No matches found
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. Date Section */}
        <div className="flex flex-col">
          <button
            onClick={() => toggleSection('date')}
            className="flex items-center justify-between w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Date
              </span>
              {(fromDate || toDate) && (
                <span className="size-2 bg-indigo-600 rounded-full shrink-0" />
              )}
            </div>
            {openSection === 'date' ? (
              <ChevronUp className="size-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="size-3.5 text-slate-400" />
            )}
          </button>

          {openSection === 'date' && (
            <div className="px-3 pb-3 pt-1 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full h-7 text-xs py-[4px] px-[8px] border border-slate-200 rounded bg-slate-50 focus:outline-hidden focus:border-slate-400 text-slate-700 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full h-7 text-xs py-[4px] px-[8px] border border-slate-200 rounded bg-slate-50 focus:outline-hidden focus:border-slate-400 text-slate-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Status Section (Only for 'Past' enquiries) */}
        {activeTab === 'past' && (
          <div className="flex flex-col">
            <button
              onClick={() => toggleSection('status')}
              className="flex items-center justify-between w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </span>
                {selectedOutcomes.length > 0 && (
                  <span className="size-2 bg-indigo-600 rounded-full shrink-0" />
                )}
              </div>
              {openSection === 'status' ? (
                <ChevronUp className="size-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="size-3.5 text-slate-400" />
              )}
            </button>

            {openSection === 'status' && (
              <div className="px-3 pb-3 pt-1 flex flex-col gap-1">
                {['Converted', 'Dropped'].map((outcome) => (
                  <label
                    key={outcome}
                    className="flex items-center gap-2 cursor-pointer py-[4px] px-[8px] hover:bg-slate-50 rounded transition-colors text-xs text-slate-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOutcomes.includes(outcome)}
                      onChange={() => handleOutcomeToggle(outcome)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3 cursor-pointer"
                    />
                    <span className="truncate">{outcome}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

