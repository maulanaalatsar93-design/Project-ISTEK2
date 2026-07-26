import React from 'react';
import { Activity } from 'lucide-react';
import { getRoleVisuals } from '../utils/helpers';

function PersonnelCard({ emp, currentStatus, record, onClick }: any) {
  const roleVisual = getRoleVisuals(emp.position, emp.employee_type);
  const RoleIcon = roleVisual.icon;
  const avatarInitials = emp.name
    .split(' ')
    .map((n: any) => n[0])
    .join('')
    .substring(0, 2);
  const StatusIcon = currentStatus?.icon || Activity;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[16px] p-[16px] border border-[#E5E7EB] card-hover flex flex-col gap-3 relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${roleVisual.bg}`}></div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-[42px] h-[42px] rounded-full bg-[#F5F7FA] flex items-center justify-center font-poppins font-bold text-[#13294B] text-[14px] shrink-0 border border-[#E5E7EB]">
            {avatarInitials}
          </div>
          <div className="min-w-0">
            <div className="font-poppins font-medium text-[14px] md:text-[15px] text-[#374151] truncate">{emp.name}</div>
            <div className="text-[11px] md:text-[12px] font-inter text-[#6B7280] truncate mt-0.5">
              {emp.npk} • {emp.division}
            </div>
          </div>
        </div>
        <div
          className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${roleVisual.bg} ${roleVisual.color} shrink-0`}
          title={emp.position}
        >
          <RoleIcon size={16} strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-1 border-t border-[#F3F4F6] pt-3">
        <span
          className={`text-[10px] md:text-[11px] px-2 py-1 rounded-md font-inter font-medium flex items-center gap-1 ${roleVisual.bg} ${roleVisual.color}`}
        >
          {roleVisual.label}
        </span>
        <span
          className={`text-[10px] md:text-[11px] px-2.5 py-1 rounded-md font-inter font-medium flex items-center gap-1 ${currentStatus?.bg || ''} ${currentStatus?.color || ''}`}
        >
          <StatusIcon size={12} strokeWidth={3} /> {currentStatus.name || ''} {record ? `(${record.duration} Hari)` : ''}
        </span>
      </div>
    </div>
  );
}

export default PersonnelCard;
