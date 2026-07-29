import React from 'react';
import { Inbox } from 'lucide-react';

export default function EnquiriesPlaceholder() {
  return (
    <div className="w-full h-full min-h-[calc(100vh-4rem)] flex-1 bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs flex flex-col items-center">
        <div className="size-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mb-4">
          <Inbox className="size-7 stroke-[1.5]" />
        </div>
        <h2 className="text-lg font-bold font-display text-slate-900 tracking-tight mb-1.5">
          Customer Enquiries
        </h2>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-normal">
          This feature is currently under development. Here you will be able to manage, view, and track all incoming customer swatch enquiries and requests.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono font-semibold text-slate-600">
          <span className="size-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>UI Development Pending</span>
        </div>
      </div>
    </div>
  );
}
