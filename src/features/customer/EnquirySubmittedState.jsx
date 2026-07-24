import React from 'react';
import { motion } from 'motion/react';
import { Check, Scan } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function EnquirySubmittedState({ isStartingNewEnquiry, handleStartNewEnquiry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col items-center justify-between min-h-[calc(100vh-7rem)] w-full text-center py-4"
    >
      {/* Core Content Cluster (Icon, Headline, Subtext) - Vertically Centered */}
      <div className="my-auto flex flex-col items-center justify-center px-4">
        {/* Prominent lightweight success icon */}
        <div className="relative size-20 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mb-5 shadow-2xs">
          <Check className="size-10 stroke-[2.5]" />
        </div>

        {/* Headline */}
        <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight">
          Enquiry Submitted
        </h2>

        {/* Status Subtext */}
        <p className="text-xs text-slate-500 font-normal max-w-xs mt-2 leading-relaxed">
          A PDF summary has been sent to your WhatsApp.
        </p>
      </div>

      {/* Post-Submission Actions - Anchored to absolute bottom of viewport */}
      <div className="w-full pt-6 pb-2 mt-auto">
        <Button
          type="button"
          disabled={isStartingNewEnquiry}
          onClick={handleStartNewEnquiry}
          className={`w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 ${
            isStartingNewEnquiry ? 'opacity-80 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          {isStartingNewEnquiry ? (
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
          ) : (
            <Scan className="size-4 text-indigo-400" />
          )}
          <span>Start New Enquiry</span>
        </Button>
      </div>
    </motion.div>
  );
}
