import React from 'react';
import { motion } from 'motion/react';
import { Edit2 } from 'lucide-react';

export default function OtpEntryForm({
  selectedCountry,
  phoneNumber,
  isEditingPhone,
  handleEditPhone,
  handleOtpSubmit,
  otpInputRef,
  otp,
  setOtp,
  otpError,
  setOtpError,
  isVerifyingOtp,
  isShake,
  isOtpFocused,
  setIsOtpFocused,
  isOtpExpiredError,
  setIsOtpExpiredError,
  resendTimer,
  isResendingOtp,
  handleResendOtp,
}) {
  return (
    <motion.form
      key="otp-step"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      onSubmit={handleOtpSubmit}
      className="flex flex-col gap-4"
    >
      {/* Phone Number Lock-in header */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            OTP Sent To
          </span>
          <span className="text-xs font-semibold font-mono text-slate-900 mt-0.5">
            {selectedCountry.flag} {selectedCountry.code} {phoneNumber}
          </span>
        </div>

        <button
          type="button"
          disabled={isEditingPhone}
          onClick={handleEditPhone}
          className={`p-1.5 rounded-md text-indigo-600 hover:bg-indigo-50 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
            isEditingPhone ? 'opacity-70 pointer-events-none' : ''
          }`}
          title="Edit Phone Number"
        >
          {isEditingPhone ? (
            <span className="size-3.5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin shrink-0 my-0.5 mx-1" />
          ) : (
            <>
              <Edit2 className="size-3.5" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      {/* OTP Input Field */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 text-center">
          Enter 4-digit OTP
        </label>

        <motion.div
          animate={isShake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="relative cursor-pointer"
        >
          {/* Hidden real input receiving user touch/keyboard events */}
          <input
            ref={otpInputRef}
            type="tel"
            inputMode="numeric"
            maxLength={4}
            disabled={isVerifyingOtp}
            value={otp}
            onFocus={() => setIsOtpFocused(true)}
            onBlur={() => setIsOtpFocused(false)}
            onChange={(e) => {
              if (isVerifyingOtp) return;
              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
              setOtp(val);
              if (otpError) setOtpError('');
              if (isOtpExpiredError) setIsOtpExpiredError(false);
            }}
            className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer disabled:cursor-not-allowed text-base"
            aria-label="4-digit OTP"
          />

          {/* Single minimalist container with 4 static placeholder slots or loading UI */}
          <div
            className={`w-full h-12 bg-slate-50/50 hover:bg-slate-100/50 rounded-xl border ${
              otpError
                ? 'border-rose-400 bg-rose-50/10'
                : isOtpFocused
                ? 'border-slate-400 bg-white ring-2 ring-slate-900/5'
                : 'border-slate-200'
            } flex items-center justify-center transition-all px-4 select-none pointer-events-none relative`}
          >
            {isVerifyingOtp ? (
              <div className="flex items-center justify-center gap-2 text-slate-700 font-semibold text-xs">
                <span className="size-4 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin shrink-0" />
                <span>Verifying OTP...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-6">
                {[0, 1, 2, 3].map((index) => {
                  const char = otp[index];
                  const isCurrentSlot = index === otp.length;

                  return (
                    <div
                      key={index}
                      className="w-7 h-8 flex items-center justify-center relative font-mono text-xl font-bold"
                    >
                      {char ? (
                        <span className="text-slate-900 text-xl font-bold">{char}</span>
                      ) : isCurrentSlot && isOtpFocused ? (
                        <span className="inline-block w-[2px] h-5 bg-slate-900 animate-pulse rounded-full" />
                      ) : (
                        <span className="text-slate-300 font-bold text-lg">•</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {otpError && (
          <p className="text-[11px] text-rose-500 font-medium mt-1.5 text-center">
            {otpError}
          </p>
        )}
      </div>

      {/* Footer / Helper: Resend Logic */}
      <div className="text-center pt-1">
        {resendTimer > 0 && !isOtpExpiredError ? (
          <span className="text-xs text-slate-400 font-mono">
            Resend OTP in <span className="font-semibold text-slate-600">{resendTimer}s</span>
          </span>
        ) : (
          <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <span>Didn't receive code?</span>
            <button
              type="button"
              disabled={isResendingOtp}
              onClick={handleResendOtp}
              className={`text-indigo-600 font-semibold hover:underline cursor-pointer flex items-center gap-1.5 ${
                isResendingOtp ? 'opacity-70 pointer-events-none' : ''
              }`}
            >
              {isResendingOtp ? (
                <>
                  <span className="size-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin shrink-0" />
                  <span>Resending...</span>
                </>
              ) : (
                <span>Resend OTP</span>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.form>
  );
}
