/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { VENDOR_NAMES, STRUCTURES } from '../../data/seedData';

export default function SwatchCardEditForm({
  formData,
  handleInputChange,
  vendorSearchFocused,
  setVendorSearchFocused,
  filteredVendorNames,
  structureSearchFocused,
  setStructureSearchFocused,
  filteredStructures,
  handleSave,
  handleDiscard
}) {
  return (
    <form onSubmit={handleSave} className="flex flex-col gap-2">
      {/* Relative controls at the top on mobile, relative and bottom on desktop */}
      <div className="relative bg-white z-10 py-2 border-b border-slate-100 order-first md:relative md:top-auto md:bg-transparent md:border-b-0 md:py-0 md:pt-1.5 md:order-last flex justify-between items-center w-full md:w-auto md:justify-start md:gap-1">
        <Button
          type="submit"
          className="md:flex-1 h-auto md:h-6 !py-1 !px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm md:text-xs rounded-sm inline-flex items-center justify-center gap-1 cursor-pointer"
          style={{ paddingLeft: '8px', paddingRight: '8px' }}
        >
          <Check className="size-4 md:size-3" />
          <span>Save</span>
        </Button>
        <Button
          type="button"
          onClick={handleDiscard}
          className="md:flex-1 h-auto md:h-6 !py-1 !px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm md:text-xs rounded-sm inline-flex items-center justify-center gap-1 border border-slate-200 cursor-pointer"
          style={{ paddingLeft: '8px', paddingRight: '8px' }}
        >
          <X className="size-4 md:size-3" />
          <span>Cancel</span>
        </Button>
      </div>

      <div className="order-1">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Vendor Name</label>
        <select
          value={formData.vendorName || ''}
          onChange={(e) => handleInputChange('vendorName', e.target.value)}
          className="mobile-select-no-chevron h-8 md:h-6 w-full text-base md:text-xs bg-slate-50 border border-slate-200 rounded-md md:rounded-sm px-1.5 !py-[3px] md:!py-0 focus:outline-hidden focus:border-slate-400 focus:bg-white font-sans cursor-pointer hidden md:block"
        >
          {VENDOR_NAMES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>

        <div className="relative block md:hidden">
          <Input
            type="text"
            value={formData.vendorName || ''}
            onChange={(e) => {
              handleInputChange('vendorName', e.target.value);
              setVendorSearchFocused(true);
            }}
            onFocus={() => setVendorSearchFocused(true)}
            onBlur={() => {
              setTimeout(() => setVendorSearchFocused(false), 200);
            }}
            className="h-8 text-base bg-slate-50 border border-slate-200 rounded-md px-1.5 !py-0.5 !px-1.5"
            placeholder="Enter or select vendor..."
          />
          {vendorSearchFocused && (
            <div className="absolute z-30 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg">
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
      
      <div className="flex flex-row md:grid md:grid-cols-2 gap-1.5 order-2">
        <div className="flex-1 min-w-0">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Vendor SKU</label>
          <Input
            type="text"
            value={formData.vendorSku || ''}
            onChange={(e) => handleInputChange('vendorSku', e.target.value)}
            placeholder="SKU"
            className="h-8 md:h-6 !py-0.5 md:!py-0 !px-1.5 md:!px-2"
          />
        </div>
        <div className="w-[105px] shrink-0 md:w-auto">
          <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Quantity</label>
          <div className="flex gap-0.5">
            <Input
              type="number"
              value={formData.quantity || ''}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              placeholder="Qty"
              className="flex-1 min-w-0 h-8 md:h-6 !py-0.5 md:!py-0 !px-1.5 md:!px-2 mobile-no-spinners"
            />
            <select
              value={formData.unit || 'yd'}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="mobile-select-no-chevron h-8 md:h-6 text-base md:text-xs bg-slate-50 border border-slate-200 rounded-md md:rounded-sm !px-3 md:!px-0.5 !py-[3px] md:!py-0 cursor-pointer"
            >
              <option value="yd">yd</option>
              <option value="m">m</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>
      </div>

      <div className="order-3">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Material Content</label>
        <Input
          type="text"
          value={formData.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="e.g. 100% Cotton"
          className="h-8 md:h-6 !py-0.5 md:!py-0 !px-1.5 md:!px-2"
        />
      </div>

      <div className="order-4">
        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Weave Structure</label>
        <select
          value={formData.structure || ''}
          onChange={(e) => handleInputChange('structure', e.target.value)}
          className="mobile-select-no-chevron h-8 md:h-6 w-full text-base md:text-xs bg-slate-50 border border-slate-200 rounded-md md:rounded-sm px-1.5 !py-[3px] md:!py-0 focus:outline-hidden focus:border-slate-400 focus:bg-white font-sans cursor-pointer hidden md:block"
        >
          {STRUCTURES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <div className="relative block md:hidden">
          <Input
            type="text"
            value={formData.structure || ''}
            onChange={(e) => {
              handleInputChange('structure', e.target.value);
              setStructureSearchFocused(true);
            }}
            onFocus={() => setStructureSearchFocused(true)}
            onBlur={() => {
              setTimeout(() => setStructureSearchFocused(false), 200);
            }}
            className="h-8 text-base bg-slate-50 border border-slate-200 rounded-md px-1.5 !py-0.5 !px-1.5"
            placeholder="Enter or select structure..."
          />
          {structureSearchFocused && (
            <div className="absolute z-30 left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg">
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
    </form>
  );
}
