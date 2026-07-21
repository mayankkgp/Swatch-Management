/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Trash2, Save, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { VENDOR_NAMES, STRUCTURES } from '../../data/seedData';

export default function MobileSingleEditDrawer({
  swatch,
  onSave,
  onDiscard,
  onDelete,
  isSaving = false
}) {
  const [formData, setFormData] = useState({ ...swatch });

  useEffect(() => {
    if (swatch) {
      setFormData({ ...swatch });
    }
  }, [swatch]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    onSave(swatch.id, formData);
  };

  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 h-[38vh] bg-slate-900 border-t border-slate-800 z-40 p-4 shadow-2xl flex flex-col justify-between text-white">
      {isSaving && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-[1px] z-50 flex flex-col items-center justify-center gap-2">
          <span className="size-5 border-2 border-indigo-500 border-t-white rounded-full animate-spin" />
          <span className="text-xs font-mono">Saving changes...</span>
        </div>
      )}

      <div className="flex flex-col gap-2 overflow-y-auto flex-1 pb-2">
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wide text-indigo-400">
            Edit Swatch Details
          </span>
          <div className="flex gap-2">
            <Button
              onClick={onDiscard}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-md uppercase tracking-wider py-1 px-1"
            >
              Discard
            </Button>
            <Button
              onClick={onDelete}
              className="bg-red-950 text-red-400 text-xs font-bold rounded-md uppercase tracking-wider inline-flex items-center gap-1 py-1 px-1"
            >
              <Trash2 className="size-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Vendor Name</label>
            <select
              value={formData.vendorName || ''}
              onChange={(e) => handleInputChange('vendorName', e.target.value)}
              className="w-full text-base bg-slate-800 border border-slate-700 rounded-md text-white font-sans py-1 px-1"
            >
              {VENDOR_NAMES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Quantity</label>
            <div className="flex gap-1">
              <Input
                type="number"
                value={formData.quantity || ''}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="Qty"
                className="flex-1 min-w-0 bg-slate-800 border-slate-700 text-white rounded-md placeholder-slate-500 text-base py-1 px-1"
              />
              <select
                value={formData.unit || 'yd'}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="text-base bg-slate-800 border border-slate-700 text-white rounded-md py-1 px-1"
              >
                <option value="yd">yd</option>
                <option value="m">m</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Content</label>
            <Input
              type="text"
              value={formData.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="e.g. 100% Linen"
              className="bg-slate-800 border-slate-700 text-white rounded-md placeholder-slate-500 text-base py-1 px-1"
            />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Structure</label>
            <select
              value={formData.structure || ''}
              onChange={(e) => handleInputChange('structure', e.target.value)}
              className="w-full text-base bg-slate-800 border border-slate-700 rounded-md text-white font-sans py-1 px-1"
            >
              {STRUCTURES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Drawer footer execute */}
      <div className="pt-2 border-t border-slate-800 shrink-0">
        <Button
          onClick={handleSave}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-md inline-flex items-center justify-center gap-2 py-1 px-1"
        >
          <Save className="size-4" />
          <span>Save Changes</span>
        </Button>
      </div>
    </div>
  );
}
