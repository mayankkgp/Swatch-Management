import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import CustomerEnquiryStackView from './CustomerEnquiryStackView';
import PhoneEntryForm from './PhoneEntryForm';
import OtpEntryForm from './OtpEntryForm';
import SuccessConfirmation from './SuccessConfirmation';
import CountryPickerOverlay from './CountryPickerOverlay';
import {
  requestCustomerOtp,
  verifyCustomerOtp,
  resendCustomerOtp,
  saveCustomerSession,
  clearCustomerSession
} from '../../services/customerEnquiryServices';

// Comprehensive list of country codes
const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸', iso: 'US' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪', iso: 'AE' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', iso: 'SG' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+33', country: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', iso: 'SA' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦', iso: 'QA' },
  { code: '+39', country: 'Italy', flag: '🇮🇹', iso: 'IT' },
  { code: '+34', country: 'Spain', flag: '🇪🇸', iso: 'ES' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱', iso: 'NL' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', iso: 'JP' },
  { code: '+86', country: 'China', flag: '🇨🇳', iso: 'CN' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷', iso: 'KR' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', iso: 'MY' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩', iso: 'ID' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭', iso: 'TH' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳', iso: 'VN' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', iso: 'ZA' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', iso: 'BR' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽', iso: 'MX' },
];

export default function CustomerLoginView() {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'success' | 'enquiry_stack'
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpExpiredError, setIsOtpExpiredError] = useState(false);
  const [isShake, setIsShake] = useState(false);
  const [isOtpFocused, setIsOtpFocused] = useState(false);
  
  const [resendTimer, setResendTimer] = useState(30);
  const [toastConfig, setToastConfig] = useState(null); // { msg: string, isError?: boolean }

  // Loading states for simulated delays
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const phoneInputRef = useRef(null);
  const otpInputRef = useRef(null);

  // Ensure step defaults to phone when mounting
  useEffect(() => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
  }, []);

  // Focus phone input on mount
  useEffect(() => {
    if (step === 'phone' || step === 'otp') {
      window.dispatchEvent(new CustomEvent('customer-header-title-override', { detail: 'Enquiry Login' }));
    } else {
      window.dispatchEvent(new CustomEvent('customer-header-title-override', { detail: null }));
    }

    if (step === 'phone') {
      const timer = setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else if (step === 'otp') {
      const timer = setTimeout(() => {
        otpInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  const showToast = (msg, isError = false) => {
    setToastConfig({ msg, isError });
    setTimeout(() => setToastConfig(null), 3000);
  };

  const handleVerifyOtp = async (otpToVerify) => {
    if (isVerifyingOtp) return;
    setIsVerifyingOtp(true);

    try {
      const result = await verifyCustomerOtp(otpToVerify || otp, {
        phoneNumber,
        countryCode: selectedCountry.code
      });

      if (!result.success) {
        if (result.errorType === 'incorrect') {
          if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
            try { window.navigator.vibrate(200); } catch (e) {}
          }
          setIsShake(true);
          setTimeout(() => setIsShake(false), 500);
          setOtpError(result.message);
          setOtp('');
        } else if (result.errorType === 'expired') {
          setOtpError(result.message);
          setIsOtpExpiredError(true);
          setResendTimer(0);
          setOtp('');
        } else if (result.errorType === 'network') {
          showToast(result.message, true);
          setOtp('');
        }
      } else {
        setOtpError('');
        setIsOtpExpiredError(false);
        setStep('enquiry_stack');
      }
    } catch (err) {
      showToast('Verification failed. Try again.', true);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Auto-validate OTP when 4 digits are entered or auto-filled
  useEffect(() => {
    if (step === 'otp') {
      const cleanedOtp = otp.trim().replace(/\D/g, '');
      if (cleanedOtp.length === 4 && !isVerifyingOtp) {
        handleVerifyOtp(cleanedOtp);
      }
    }
  }, [otp, step, isVerifyingOtp]);

  const handlePhoneSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isRequestingOtp) return;

    const cleaned = phoneNumber.trim().replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setPhoneError('Please enter a valid 10-digit number');
      return;
    }
    setPhoneError('');
    setIsRequestingOtp(true);

    try {
      await requestCustomerOtp(cleaned, selectedCountry.code);
      setStep('otp');
      setResendTimer(30);
      setIsOtpExpiredError(false);
      showToast('OTP sent successfully');
    } catch (err) {
      showToast('Failed to send OTP', true);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleOtpSubmit = (e) => {
    if (e) e.preventDefault();
    if (isVerifyingOtp) return;
    const cleanedOtp = otp.trim().replace(/\D/g, '');
    if (!cleanedOtp) {
      setOtpError('Please enter the verification code');
      return;
    }
    if (cleanedOtp.length < 4) {
      setOtpError('Please enter the complete 4-digit OTP');
      return;
    }
    if (cleanedOtp.length === 4) {
      handleVerifyOtp(cleanedOtp);
    }
  };

  const handleResendOtp = async () => {
    if (isResendingOtp) return;
    setIsResendingOtp(true);

    try {
      await resendCustomerOtp({ phoneNumber, countryCode: selectedCountry.code });
      setOtp('');
      setOtpError('');
      setIsOtpExpiredError(false);
      setResendTimer(30);
      showToast('A new OTP has been sent');
      otpInputRef.current?.focus();
    } catch (err) {
      showToast('Failed to resend OTP', true);
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleEditPhone = async () => {
    if (isEditingPhone) return;
    setIsEditingPhone(true);

    try {
      await saveCustomerSession({ step: 'phone', phoneNumber });
      setStep('phone');
      setOtp('');
      setOtpError('');
      setIsOtpExpiredError(false);
    } catch (err) {
      // ignore
    } finally {
      setIsEditingPhone(false);
    }
  };

  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.country.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      c.code.includes(countrySearchQuery) ||
      c.iso.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  if (step === 'enquiry_stack') {
    return (
      <CustomerEnquiryStackView
        onLogout={async () => {
          await clearCustomerSession();
          setStep('phone');
          setPhoneNumber('');
          setOtp('');
        }}
      />
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex flex-col items-center justify-start pt-6 pb-12 px-4 select-none min-h-[calc(100vh-2.5rem)] overflow-y-auto relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastConfig && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 text-xs font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border ${
              toastConfig.isError
                ? 'bg-rose-900 text-rose-100 border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastConfig.isError ? (
              <X className="size-3.5 text-rose-400" />
            ) : (
              <Check className="size-3.5 text-emerald-400" />
            )}
            <span>{toastConfig.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-sm flex flex-col items-center mt-4 sm:mt-10 mb-auto">
        
        {/* Headline */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight">
            Login to submit enquiry
          </h2>
        </div>

        {/* Card Body Container */}
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-all">
          
          <AnimatePresence mode="wait">
            {step === 'phone' && (
              <PhoneEntryForm
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                phoneError={phoneError}
                setPhoneError={setPhoneError}
                phoneInputRef={phoneInputRef}
                selectedCountry={selectedCountry}
                setIsCountryPickerOpen={setIsCountryPickerOpen}
                handlePhoneSubmit={handlePhoneSubmit}
                isRequestingOtp={isRequestingOtp}
              />
            )}

            {step === 'otp' && (
              <OtpEntryForm
                selectedCountry={selectedCountry}
                phoneNumber={phoneNumber}
                isEditingPhone={isEditingPhone}
                handleEditPhone={handleEditPhone}
                handleOtpSubmit={handleOtpSubmit}
                otpInputRef={otpInputRef}
                otp={otp}
                setOtp={setOtp}
                otpError={otpError}
                setOtpError={setOtpError}
                isVerifyingOtp={isVerifyingOtp}
                isShake={isShake}
                isOtpFocused={isOtpFocused}
                setIsOtpFocused={setIsOtpFocused}
                isOtpExpiredError={isOtpExpiredError}
                setIsOtpExpiredError={setIsOtpExpiredError}
                resendTimer={resendTimer}
                isResendingOtp={isResendingOtp}
                handleResendOtp={handleResendOtp}
              />
            )}

            {step === 'success' && (
              <SuccessConfirmation
                setStep={setStep}
                setPhoneNumber={setPhoneNumber}
                setOtp={setOtp}
              />
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Full-Screen Mobile Overlay Country Selector */}
      <CountryPickerOverlay
        isCountryPickerOpen={isCountryPickerOpen}
        setIsCountryPickerOpen={setIsCountryPickerOpen}
        countrySearchQuery={countrySearchQuery}
        setCountrySearchQuery={setCountrySearchQuery}
        filteredCountries={filteredCountries}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />

    </div>
  );
}
