import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function PhoneEntryForm({
  phoneNumber,
  setPhoneNumber,
  phoneError,
  setPhoneError,
  phoneInputRef,
  selectedCountry,
  setIsCountryPickerOpen,
  handlePhoneSubmit,
  isRequestingOtp,
}) {
  return (
    <motion.form
      key="phone-step"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      onSubmit={handlePhoneSubmit}
      className="flex flex-col gap-4"
    >
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
          Mobile Number
        </label>

        {/* Input field with country selector on left */}
        <div
          className={`flex items-center rounded-xl border ${
            phoneError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 bg-slate-50/50'
          } hover:bg-slate-100/50 focus-within:bg-white focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-900/5 transition-all overflow-hidden`}
        >
          {/* Country Code Selector Trigger */}
          <button
            type="button"
            onClick={() => setIsCountryPickerOpen(true)}
            className="h-11 px-3 flex items-center gap-1.5 bg-slate-100/80 hover:bg-slate-200/70 border-r border-slate-200 text-slate-800 text-xs font-semibold cursor-pointer shrink-0 transition-colors"
            title="Select country code"
          >
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="font-mono">{selectedCountry.code}</span>
            <ChevronDown className="size-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Phone Input */}
          <input
            ref={phoneInputRef}
            type="tel"
            inputMode="tel"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              if (phoneError) setPhoneError('');
            }}
            placeholder="98765 43210"
            className="w-full h-11 px-3 bg-transparent text-base font-medium font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {phoneError && (
          <p className="text-[11px] text-rose-500 font-medium mt-1.5 pl-0.5">
            {phoneError}
          </p>
        )}
      </div>

      {/* Primary CTA: [ Request OTP ] */}
      <Button
        type="submit"
        disabled={isRequestingOtp}
        className={`w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-1 ${
          isRequestingOtp ? 'opacity-80 cursor-not-allowed pointer-events-none' : ''
        }`}
      >
        {isRequestingOtp ? (
          <>
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
            <span>Sending OTP...</span>
          </>
        ) : (
          <>
            <span>Request OTP</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </motion.form>
  );
}
