import React from 'react';
import { motion } from 'motion/react';
import { QrCode } from 'lucide-react';

export default function EnquiryEmptyState() {
  return (
    <div className="w-full flex flex-col items-center justify-start text-center mt-6 sm:mt-12 mb-auto px-4">
      {/* Minimalist Wireframe Barcode / QR Scanner Icon */}
      <div className="relative size-24 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/50 flex items-center justify-center mb-5 group overflow-hidden">
        <div className="absolute inset-2 border border-slate-200/80 rounded-xl bg-white shadow-2xs flex items-center justify-center">
          <QrCode className="size-10 text-slate-400 stroke-[1.5]" />
        </div>
        {/* Subtle animated laser line */}
        <motion.div
          animate={{ y: [-24, 24, -24] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-x-3 h-[2px] bg-indigo-500/60 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
        />
      </div>

      {/* Empty State Typography */}
      <p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
        Your enquiry list is empty. Tap the scanner to add a fabric.
      </p>
    </div>
  );
}
