import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function SuccessConfirmation({ setStep, setPhoneNumber, setOtp }) {
  return (
    <motion.div
      key="success-step"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="flex flex-col items-center py-4 text-center"
    >
      <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
        <CheckCircle2 className="size-7" />
      </div>
      <h3 className="text-base font-bold font-display text-slate-900">
        Logged In Successfully
      </h3>
      <p className="text-xs text-slate-500 mt-1 max-w-xs">
        Welcome! You can now submit enquiries and track your swatch requests.
      </p>

      <div className="w-full mt-6 flex flex-col gap-2">
        <Button
          onClick={() => {
            setStep('enquiry_stack');
          }}
          className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center"
        >
          Submit Swatch Enquiry
        </Button>
        <Button
          onClick={() => {
            setStep('phone');
            setPhoneNumber('');
            setOtp('');
          }}
          variant="outline"
          className="w-full h-10 border-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
        >
          Switch Account / Logout
        </Button>
      </div>
    </motion.div>
  );
}
