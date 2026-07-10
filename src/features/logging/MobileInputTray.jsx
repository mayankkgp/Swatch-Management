/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { VENDOR_NAMES, STRUCTURES } from '../../data/seedData';
import Input from '../../components/ui/Input';

export default function MobileInputTray({
  formData,
  handleInputChange,
  applyToCurrentOnly,
  setApplyToCurrentOnly,
  getCollapsedText
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [vendorSearchFocused, setVendorSearchFocused] = useState(false);
  const [structureSearchFocused, setStructureSearchFocused] = useState(false);

  const filteredVendorNames = VENDOR_NAMES.filter(v => 
    v.toLowerCase().includes((formData.vendorName || '').toLowerCase())
  );

  const filteredStructures = STRUCTURES.filter(s => 
    s.toLowerCase().includes((formData.structure || '').toLowerCase())
  );

  return (
    <div className={`md:hidden flex-none relative ${isExpanded ? 'z-30' : 'z-10'}`}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white border-b border-slate-200 p-1.5 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        <div className="text-[12px] font-normal text-slate-600 leading-normal break-words">
          {getCollapsedText()}
        </div>
      </div>

      {isExpanded && (
        <div className="absolute top-0 left-0 right-0 bg-white text-slate-800 border-b border-slate-200 shadow-2xl max-h-[50vh] overflow-y-auto flex flex-col z-30">
          <div className="flex flex-col gap-2 pt-1 pb-3 px-3">
            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Vendor Name</label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.vendorName || ''}
                  onChange={(e) => {
                    handleInputChange('vendorName', e.target.value);
                    setVendorSearchFocused(true);
                  }}
                  onFocus={() => {
                    setVendorSearchFocused(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setVendorSearchFocused(false), 200);
                  }}
                  className="h-8 text-base bg-slate-50 border border-slate-200 rounded-md px-1.5 !py-0.5 !px-1.5 text-slate-800"
                  placeholder="Enter or select vendor..."
                />
                {vendorSearchFocused && (
                  <div className="absolute z-40 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg">
                    {filteredVendorNames.map(v => (
                      <button
                        key={v}
                        type="button"
                        onMouseDown={() => {
                          handleInputChange('vendorName', v);
                          setVendorSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 active:bg-indigo-100 text-slate-700 font-sans"
                      >
                        {v}
                      </button>
                    ))}
                    {filteredVendorNames.length === 0 && (
                      <div className="px-3 py-2 text-xs text-slate-400 font-sans">No matches</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Structure</label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.structure || ''}
                  onChange={(e) => {
                    handleInputChange('structure', e.target.value);
                    setStructureSearchFocused(true);
                  }}
                  onFocus={() => {
                    setStructureSearchFocused(true);
                  }}
                  onBlur={() => {
                    setTimeout(() => setStructureSearchFocused(false), 200);
                  }}
                  className="h-8 text-base bg-slate-50 border border-slate-200 rounded-md px-1.5 !py-0.5 !px-1.5 text-slate-800"
                  placeholder="Enter or select structure..."
                />
                {structureSearchFocused && (
                  <div className="absolute z-40 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg">
                    {filteredStructures.map(s => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={() => {
                          handleInputChange('structure', s);
                          setStructureSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 active:bg-indigo-100 text-slate-700 font-sans"
                      >
                        {s}
                      </button>
                    ))}
                    {filteredStructures.length === 0 && (
                      <div className="px-3 py-2 text-xs text-slate-400 font-sans">No matches</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Content</label>
              <Input
                type="text"
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="e.g. 100% Cotton"
                className="h-8 !py-0.5 !px-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-800"
              />
            </div>

            <div className="pt-1.5 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox"
                    checked={applyToCurrentOnly}
                    onChange={(e) => setApplyToCurrentOnly(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="size-5 rounded border border-slate-300 bg-slate-50 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 text-white pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-600">Apply to Current Only</span>
              </label>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="p-0 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Collapse"
              >
                <ChevronUp className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
