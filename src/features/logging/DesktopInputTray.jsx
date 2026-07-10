/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronDown, Sun, Moon } from 'lucide-react';
import { VENDOR_NAMES, STRUCTURES } from '../../data/seedData';
import SearchableSelect from '../../components/ui/SearchableSelect';

export default function DesktopInputTray({
  formData,
  handleInputChange,
  applyToCurrentOnly,
  setApplyToCurrentOnly,
  onClear,
  viewerTheme,
  setViewerTheme,
  selectClass,
  inputClass
}) {
  return (
    <div className="hidden md:flex md:w-[210px] flex-col bg-slate-50 relative border-r border-slate-200 overflow-y-auto shrink-0 select-none">
      <div className="py-3 px-1.5 space-y-3.5 flex-1 bg-transparent">
        <div className="flex items-center justify-between md:h-10 md:border-b md:border-slate-200 md:bg-slate-50 md:px-3 md:-mx-1.5 md:-mt-3 md:mb-3 md:shrink-0">
          <div className="flex flex-col gap-1">
            <h2 className="text-xs font-mono font-bold uppercase text-slate-700 leading-tight">
              Attributes
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {setViewerTheme && (
              <button
                type="button"
                onClick={() => setViewerTheme(viewerTheme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="Toggle Viewer Background"
              >
                {viewerTheme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              </button>
            )}
            <button 
              type="button" 
              onClick={onClear}
              className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-700 tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Vendor Name
          </label>
          <SearchableSelect
            value={formData.vendorName || ''}
            onChange={(val) => handleInputChange('vendorName', val)}
            options={VENDOR_NAMES}
            placeholder="Select Vendor..."
            className={selectClass}
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Vendor SKU
          </label>
          <input
            type="text"
            value={formData.vendorSku || ''}
            onChange={(e) => handleInputChange('vendorSku', e.target.value)}
            className={`${inputClass} md:[&::-webkit-outer-spin-button]:appearance-none md:[&::-webkit-inner-spin-button]:appearance-none md:[-moz-appearance:textfield]`}
            placeholder="e.g. SKU-123"
          />
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity || ''}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className={`${inputClass} md:[&::-webkit-outer-spin-button]:appearance-none md:[&::-webkit-inner-spin-button]:appearance-none md:[-moz-appearance:textfield]`}
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
              Unit
            </label>
            <div className="relative">
              <select
                value={formData.unit || 'yd'}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className={selectClass}
              >
                <option value="yd">yd</option>
                <option value="m">m</option>
                <option value="kg">kg</option>
              </select>
              <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="size-3.5" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Structure
          </label>
          <SearchableSelect
            value={formData.structure || ''}
            onChange={(val) => handleInputChange('structure', val)}
            options={STRUCTURES}
            placeholder="Select Structure..."
            className={selectClass}
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Content
          </label>
          <input
            type="text"
            value={formData.content || ''}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className={`${inputClass} md:[&::-webkit-outer-spin-button]:appearance-none md:[&::-webkit-inner-spin-button]:appearance-none md:[-moz-appearance:textfield]`}
            placeholder="e.g. 100% Cotton"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className="relative flex items-center">
              <input 
                type="checkbox"
                checked={applyToCurrentOnly}
                onChange={(e) => setApplyToCurrentOnly(e.target.checked)}
                className="peer sr-only"
              />
              <div className="size-4 rounded border border-slate-300 bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 text-white pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-600">Apply to Current Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
