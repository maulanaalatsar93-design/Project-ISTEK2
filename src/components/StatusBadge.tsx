import React from 'react';

function StatusBadge({ status }: any) {
  const styles: any = {
    Draft: 'bg-slate-100 text-slate-600 border-slate-300',
    Submitted: 'bg-blue-50 text-blue-700 border-blue-300',
    'Pending AVP': 'bg-amber-50 text-amber-700 border-amber-300',
    'Pending VP': 'bg-purple-50 text-purple-700 border-purple-300',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-300',
    Revision: 'bg-indigo-50 text-indigo-700 border-indigo-300',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-poppins font-medium border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-300'}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {status}
    </span>
  );
}

/**
 * ============================================================================
 * VIEWS / PAGES
 * ============================================================================
 */

export default StatusBadge;
