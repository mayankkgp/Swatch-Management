/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function MobileSkuAndQuantity({
  viewerTheme = 'dark',
  formData,
  handleInputChange
}) {
  const isLight = viewerTheme === 'light';
  
  return (
    <div className="w-full flex gap-2.5 mt-1.5 mb-2 shrink-0 px-1">
      <div className="flex-1 min-w-0 flex flex-col">
        <label className={`text-[11px] font-bold font-mono uppercase shrink-0 transition-colors mb-0.5 ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Vendor SKU
        </label>
        <input
          type="text"
          value={formData?.vendorSku || ''}
          onChange={(e) => handleInputChange?.('vendorSku', e.target.value)}
          onFocus={(e) => {
            const target = e.target;
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }}
          className={`w-full h-8 text-base rounded-md px-1.5 !py-0.5 !px-1.5 font-sans focus:outline-hidden transition-colors ${
            isLight 
              ? 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400' 
              : 'bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:border-slate-500'
          }`}
          placeholder="e.g. SKU-123"
        />
      </div>

      <div className="w-[105px] shrink-0 flex flex-col">
        <label className={`text-[11px] font-bold font-mono uppercase shrink-0 transition-colors mb-0.5 ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Quantity
        </label>
        <div className="flex gap-0.5">
          <input
            type="number"
            value={formData?.quantity || ''}
            onChange={(e) => handleInputChange?.('quantity', e.target.value)}
            onFocus={(e) => {
              const target = e.target;
              setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 300);
            }}
            className={`flex-1 min-w-0 h-8 text-base rounded-md px-1.5 !py-0.5 !px-1.5 font-sans focus:outline-hidden transition-colors mobile-no-spinners ${
              isLight 
                ? 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400' 
                : 'bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:border-slate-500'
            }`}
            placeholder="Qty"
          />
          <select
            value={formData?.unit || 'yd'}
            onChange={(e) => handleInputChange?.('unit', e.target.value)}
            className={`mobile-select-no-chevron h-8 text-base rounded-md !px-3 !py-[3px] cursor-pointer transition-colors ${
              isLight 
                ? 'bg-slate-100 border border-slate-200 text-slate-800 focus:border-slate-400' 
                : 'bg-slate-800 border border-slate-700 text-slate-100 focus:border-slate-500'
            }`}
          >
            <option value="yd">yd</option>
            <option value="m">m</option>
            <option value="kg">kg</option>
          </select>
        </div>
      </div>
    </div>
  );
}
