import React from 'react';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children, actions }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#13294B]/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] w-full max-w-5xl flex flex-col max-h-[95vh] lg:max-h-[90vh] animate-in zoom-in-95 duration-300 border border-[#E5E7EB]/50 overflow-hidden">
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-[#E5E7EB] bg-white z-10 shrink-0">
          <h3 className="font-poppins font-semibold text-[18px] md:text-[22px] text-[#0D2D66] truncate pr-4">{title || ''}</h3>
          <div className="flex items-center gap-3">
            {actions}
            <button
              onClick={onClose}
              className="p-2 md:p-2.5 bg-[#F5F7FA] rounded-full text-[#6B7280] hover:text-[#13294B] hover:bg-[#E5E7EB] transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <div className="p-5 md:p-8 overflow-y-auto bg-[#F9FAFB] flex-1 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
