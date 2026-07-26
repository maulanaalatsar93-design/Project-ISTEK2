import { Star, Shield, HardHat, Users } from 'lucide-react';
import { MOCK_HOLIDAYS } from '../data/mockData';

function isHolidayOrWeekend(dateStr: any) {
  const date = new Date(dateStr);
  const day = date.getDay();
  return day === 0 || day === 6 || MOCK_HOLIDAYS.includes(dateStr);
}

function calculateWorkingDays(startDate: any, endDate: any) {
  let count = 0;
  let curDate = new Date(startDate);
  const end = new Date(endDate);
  while (curDate <= end) {
    if (!isHolidayOrWeekend(curDate.toISOString().split('T')[0])) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}

function getRoleVisuals(position: any, type: any) {
  if (position.includes('(VP)')) return { icon: Star, color: 'text-[#F59E0B]', bg: 'bg-[#FEF3C7]', label: 'VP' };
  if (position.includes('(SIE)')) return { icon: Shield, color: 'text-[#8B5CF6]', bg: 'bg-[#F3E8FF]', label: 'SIE' };
  if (position.includes('(AVP)')) return { icon: Star, color: 'text-[#94A3B8]', bg: 'bg-[#F1F5F9]', label: 'AVP' };
  if (type === 'Organik') return { icon: HardHat, color: 'text-[#0D3B66]', bg: 'bg-[#EAF2FF]', label: 'ORG' };
  return { icon: Users, color: 'text-[#16A34A]', bg: 'bg-[#E8FFF2]', label: 'NON-ORG' };
}

function getWOStatusClass(status: string) {
  if (['CNF', 'TECO', 'CLSD'].includes(status)) return 'bg-[#E8FFF2] text-[#16A34A] border border-[#16A34A] border-opacity-20';
  if (status === 'REL') return 'bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB] border-opacity-20';
  return 'bg-[#FFF8E6] text-[#F59E0B] border border-[#F59E0B] border-opacity-20';
}

function getNotifStatusClass(status: string) {
  if (['NOCO', 'ORAS'].includes(status)) return 'bg-[#E8FFF2] text-[#16A34A] border border-[#16A34A] border-opacity-20';
  if (status === 'NOPR') return 'bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB] border-opacity-20';
  return 'bg-[#FFF0F0] text-[#EF4444] border border-[#EF4444] border-opacity-20';
}

export { isHolidayOrWeekend, calculateWorkingDays, getRoleVisuals, getWOStatusClass, getNotifStatusClass };
