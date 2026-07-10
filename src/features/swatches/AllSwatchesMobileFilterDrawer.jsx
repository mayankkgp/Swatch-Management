import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { STRUCTURES } from '../../data/seedData';
import {
  VendorAccordion,
  DateAccordion,
  AccordionSection
} from './AllSwatchesMobileFilterDrawerAccordions';

export default function AllSwatchesMobileFilterDrawer({
  isOpen,
  onClose,
  selectedVendors,
  setSelectedVendors,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  structureFilter,
  setStructureFilter,
  onApply
}) {
  const [tempVendors, setTempVendors] = useState(selectedVendors);
  const [tempFromDate, setTempFromDate] = useState(fromDate);
  const [tempToDate, setTempToDate] = useState(toDate);
  const [tempStructure, setTempStructure] = useState(structureFilter);
  const [openSection, setOpenSection] = useState('vendor'); // 'vendor' | 'date' | 'structure'

  useEffect(() => {
    if (isOpen) {
      setTempVendors(selectedVendors);
      setTempFromDate(fromDate);
      setTempToDate(toDate);
      setTempStructure(structureFilter);
    }
  }, [isOpen, selectedVendors, fromDate, toDate, structureFilter]);

  const handleClearAll = () => {
    setTempVendors([]);
    setTempFromDate('');
    setTempToDate('');
    setTempStructure('all');
  };

  const handleApply = () => {
    onApply({
      vendors: tempVendors,
      fromDate: tempFromDate,
      toDate: tempToDate,
      structure: tempStructure
    });
  };

  // Instant temporary active pills
  const tempPills = [];
  tempVendors.forEach(vendor => {
    tempPills.push({
      id: `vendor-${vendor}`,
      label: `Vendor: ${vendor}`,
      onDismiss: () => setTempVendors(tempVendors.filter(v => v !== vendor))
    });
  });
  if (tempFromDate || tempToDate) {
    tempPills.push({
      id: 'date-range',
      label: `Date: ${tempFromDate || 'Any'} - ${tempToDate || 'Any'}`,
      onDismiss: () => {
        setTempFromDate('');
        setTempToDate('');
      }
    });
  }
  if (tempStructure !== 'all') {
    tempPills.push({
      id: 'structure',
      label: `Weave: ${tempStructure}`,
      onDismiss: () => setTempStructure('all')
    });
  }

  const toggleSection = (sec) => {
    setOpenSection(prev => (prev === sec ? '' : sec));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Left sliding drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 left-0 z-50 bg-white w-[80vw] max-w-[340px] h-full flex flex-col shadow-2xl border-r border-slate-200"
          >
            {/* 1. Sticky Drawer Header */}
            <div className="px-4 h-10 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50">
              <span className="font-bold text-sm text-slate-800">Filters</span>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Middle Container */}
            <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
              {/* 3. Mutually Exclusive Accordion Stack */}
              <div className="px-4 py-3 flex-1">
                {/* Vendor Filter Accordion */}
                <AccordionSection
                  title="Vendor"
                  isOpen={openSection === 'vendor'}
                  onToggle={() => toggleSection('vendor')}
                  hasActiveFilter={tempVendors.length > 0}
                >
                  <VendorAccordion
                    tempVendors={tempVendors}
                    setTempVendors={setTempVendors}
                  />
                </AccordionSection>

                {/* Date Filter Accordion */}
                <AccordionSection
                  title="Date"
                  isOpen={openSection === 'date'}
                  onToggle={() => toggleSection('date')}
                  hasActiveFilter={!!tempFromDate || !!tempToDate}
                >
                  <DateAccordion
                    tempFromDate={tempFromDate}
                    setTempFromDate={setTempFromDate}
                    tempToDate={tempToDate}
                    setTempToDate={setTempToDate}
                  />
                </AccordionSection>
              </div>
            </div>

            {/* 4. Sticky Base Action Dock */}
            <div className="p-4 border-t border-slate-100 shrink-0 bg-white flex items-center gap-3">
              <button
                onClick={handleClearAll}
                className="flex-1 h-11 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-sm font-semibold rounded-md flex items-center justify-center transition-colors cursor-pointer"
              >
                Clear All
              </button>
              <Button
                onClick={handleApply}
                className="flex-[2] h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-xs flex items-center justify-center cursor-pointer"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
