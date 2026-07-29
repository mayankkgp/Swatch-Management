import React from 'react';
import { X, MessageSquare, Phone, User, Calendar, Layers, UserCheck, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function EnquiryRightPanePlaceholder({ enquiry, onClose }) {
  if (!enquiry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 text-center text-slate-400">
        <MessageSquare className="size-8 mb-2 stroke-[1.5]" />
        <p className="text-xs font-medium">Select an enquiry to view details</p>
      </div>
    );
  }

  const customerDisplay = enquiry.customer && enquiry.customer.trim() !== ''
    ? enquiry.customer
    : 'No Name Provided';

  const statusColorMap = {
    pending: 'bg-amber-500/10 text-amber-700 border-amber-300',
    in_progress: 'bg-indigo-500/10 text-indigo-700 border-indigo-300',
    past: 'bg-emerald-500/10 text-emerald-700 border-emerald-300'
  };

  const statusLabelMap = {
    pending: 'Pending',
    in_progress: 'Active',
    past: 'Past'
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-50 overflow-hidden relative border-l border-slate-200/80">
      {/* Top Details View Header Bar */}
      <div className="h-10 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-sm">
            {enquiry.id}
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-bold text-xs text-slate-800 truncate" title={customerDisplay}>
            {customerDisplay}
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusColorMap[enquiry.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
            {statusLabelMap[enquiry.status] || enquiry.status}
          </span>
        </div>

        <Button
          onClick={onClose}
          className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close details (Return to full width)"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Main Content Area Placeholder */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center text-center">
          <div className="size-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
            <MessageSquare className="size-6 stroke-[1.5]" />
          </div>

          <h2 className="text-base font-bold text-slate-900 mb-1">
            Enquiry Details - {enquiry.id}
          </h2>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Contextual details and requested swatch list for this enquiry will be rendered here.
          </p>

          {/* Quick Info Grid */}
          <div className="w-full grid grid-cols-2 gap-2 text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 mb-5 text-xs">
            <div className="flex items-center gap-2">
              <User className="size-3.5 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer</span>
                <span className="font-semibold text-slate-800 truncate">{customerDisplay}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="size-3.5 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Phone</span>
                <span className="font-mono text-slate-800 truncate">{enquiry.phone || '-'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Date</span>
                <span className="font-mono text-slate-800">{enquiry.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="size-3.5 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Swatches</span>
                <span className="font-semibold text-slate-800">{enquiry.swatchCount} items</span>
              </div>
            </div>

            <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-200/60">
              <UserCheck className="size-3.5 text-slate-400 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned AM</span>
                <span className="font-semibold text-slate-800">
                  {enquiry.am && enquiry.am !== 'Unassigned' && enquiry.am.trim() !== '' ? enquiry.am : '-'}
                </span>
              </div>
            </div>

            {enquiry.notes && (
              <div className="flex items-start gap-2 col-span-2 pt-1 border-t border-slate-200/60">
                <FileText className="size-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Notes</span>
                  <span className="text-slate-600 italic">{enquiry.notes}</span>
                </div>
              </div>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono font-semibold text-slate-600">
            <span className="size-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Right Pane Detail View Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
