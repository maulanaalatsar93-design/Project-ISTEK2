import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity, BarChart2, ClipboardList, MapPin, MessageCircle, UserCheck, Users } from 'lucide-react';
import Modal from '../../components/Modal';
import PersonnelCard from '../../components/PersonnelCard';
import { MOCK_STATUSES, AREA_LIST } from '../../data/mockData';
import { isHolidayOrWeekend } from '../../utils/helpers';

function DashboardView({ employees, attendanceChanges, filterDate, tasks, sapWOData, sapNotifData }: any) {
  const [detailModal, setDetailModal] = useState<any>(null);
  const todaysChanges = attendanceChanges.filter((a: any) => filterDate >= a.start_date && filterDate <= a.end_date);

  const isTodayHoliday = isHolidayOrWeekend(filterDate);
  const cutiCount = todaysChanges.filter((a: any) => a.status_id === 3).length;
  const sakitIzinCount = todaysChanges.filter((a: any) => a.status_id === 7 || a.status_id === 8).length;
  const dinasTrainingCount = todaysChanges.filter((a: any) => [4, 5, 6].includes(a.status_id)).length;
  const absentTotal = cutiCount + sakitIzinCount + dinasTrainingCount;
  const presentCount = employees.length - absentTotal;

  const absentPersonnelList = todaysChanges
    .filter((a: any) => a.status_id !== 1 && a.status_id !== 2)
    .map((a: any) => {
      const emp = employees.find((e: any) => e.id === a.employee_id);
      const status = MOCK_STATUSES.find((s) => s.id === a.status_id);
      return { emp, status, record: a };
    })
    .filter((item: any) => item.emp);

  const recentMilestones = useMemo(() => {
    if (!tasks) return [];
    return tasks
      .flatMap((t: any) => {
        if (!t.logs) return [];
        return t.logs.map((l: any) => ({ ...l, taskTitle: t.title, taskStatus: t.status }));
      })
      .sort((a: any, b: any) => {
        const aTime = a.date ? new Date(a.date).getTime() : 0;
        const bTime = b.date ? new Date(b.date).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [tasks]);

  const calculateSAPMetrics = () => {
    if (!sapWOData)
      return {
        percTotal: 0,
        percPM04: 0,
        percOther: 0,
        totalWO: 0,
        totalCnf: 0,
        totalOpen: 0,
        pmCounts: {} as any,
        totalNotif: 0,
        totalNotifCnf: 0,
        totalNotifOpen: 0,
      };

    const totalWO = sapWOData.length;
    const cnfStatus = ['CNF', 'TECO', 'CLSD'];
    const totalCnf = sapWOData.filter((d: any) => cnfStatus.includes(d.systemStatus)).length;
    const totalOpen = totalWO - totalCnf;

    const pmCounts = {
      PM01: sapWOData.filter((d: any) => d.orderType === 'PM01').length,
      PM02: sapWOData.filter((d: any) => d.orderType === 'PM02').length,
      PM03: sapWOData.filter((d: any) => d.orderType === 'PM03').length,
      PM04: sapWOData.filter((d: any) => d.orderType === 'PM04').length,
      PM05: sapWOData.filter((d: any) => d.orderType === 'PM05').length,
      PM06: sapWOData.filter((d: any) => d.orderType === 'PM06').length,
    };

    const notifData = sapNotifData || [];
    const totalNotif = notifData.length;
    const totalNotifCnf = notifData.filter((d: any) => ['NOCO', 'ORAS'].includes(d.systemStatus)).length;
    const totalNotifOpen = totalNotif - totalNotifCnf;

    return {
      percTotal: totalWO ? ((totalCnf / totalWO) * 100).toFixed(1) : 0,
      totalWO,
      totalCnf,
      totalOpen,
      pmCounts,
      totalNotif,
      totalNotifCnf,
      totalNotifOpen,
    };
  };

  const sapMetrics = calculateSAPMetrics();

  const complianceWO = AREA_LIST.map((area) => {
    const wos = sapWOData.filter((d: any) => d.sortField === area || (area === 'PPHS' && d.sortField === 'PPHS & OSBL'));
    const cnf = wos.filter((d: any) => ['CNF', 'TECO', 'CLSD'].includes(d.systemStatus)).length;
    return { area, total: wos.length, open: wos.length - cnf, cnf };
  });

  const complianceNotif = AREA_LIST.map((area) => {
    const notifs = sapNotifData.filter((d: any) => d.sortField === area || (area === 'PPHS' && d.sortField === 'PPHS & OSBL'));
    const selesai = notifs.filter((d: any) => ['NOCO', 'ORAS'].includes(d.systemStatus)).length;
    return { area, total: notifs.length, open: notifs.length - selesai, selesai };
  });

  const presentWidthStyle = employees.length > 0 ? (presentCount / employees.length) * 100 : 0;
  const dinasWidthStyle = employees.length > 0 ? (dinasTrainingCount / employees.length) * 100 : 0;
  const absentWidthStyle = employees.length > 0 ? (absentTotal / employees.length) * 100 : 0;

  const woPieData = [
    { name: 'Selesai', value: sapMetrics.totalCnf, color: '#16A34A' },
    { name: 'Open', value: sapMetrics.totalOpen, color: '#F97316' },
  ];

  const notifPieData = [
    { name: 'Selesai', value: sapMetrics.totalNotifCnf, color: '#16A34A' },
    { name: 'Open', value: sapMetrics.totalNotifOpen, color: '#EF4444' },
  ];

  const handleOpenDetail = (categoryTitle: any, categoryFilter: any) => {
    let filteredEmployees = employees.map((emp: any) => {
      const record = todaysChanges.find((a: any) => a.employee_id === emp.id);
      let currentStatus = isTodayHoliday ? MOCK_STATUSES[1] : MOCK_STATUSES[0];
      if (record) currentStatus = MOCK_STATUSES.find((s: any) => s.id === record.status_id) || currentStatus;
      return { ...emp, currentStatus, record };
    });

    if (categoryFilter === 'HADIR') filteredEmployees = filteredEmployees.filter((e: any) => !e.record);
    if (categoryFilter === 'DINAS') filteredEmployees = filteredEmployees.filter((e: any) => [4, 5, 6].includes(e.record?.status_id));
    if (categoryFilter === 'CUTI_SAKIT') filteredEmployees = filteredEmployees.filter((e: any) => [3, 7, 8].includes(e.record?.status_id));

    setDetailModal({ title: categoryTitle, data: filteredEmployees });
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 md:space-y-8 pb-10">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#E5E7EB] pb-4">
        <div>
          <h1 className="text-[28px] md:text-[36px] font-poppins font-bold text-[#13294B] tracking-tight leading-tight uppercase">
            Monitoring Inspeksi Pabrik 2
          </h1>
          <p className="text-[13px] md:text-[15px] font-inter text-[#6B7280] mt-1">
            Dashboard ringkasan ketersediaan manpower, milestone, dan realisasi SAP.
          </p>
        </div>
        <button
          onClick={() => {
            const month = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });
            const message = `*📊 DASHBOARD MONITORING PABRIK 2 - ${month.toUpperCase()}*%0A%0A*WO OVERVIEW:*%0ATotal WO: ${sapMetrics.totalWO}%0A✅ Selesai (CNF): ${sapMetrics.totalCnf}%0A🔴 Open: ${sapMetrics.totalOpen}%0A%0A*REKOMENDASI OVERVIEW:*%0ATotal: ${sapMetrics.totalNotif}%0A✅ Selesai: ${sapMetrics.totalNotifCnf}%0A🔴 Open: ${sapMetrics.totalNotifOpen}%0A%0A_Pesan otomatis dari Enterprise Monitoring System._`;
            window.open(`https://wa.me/?text=${message}`, '_blank');
          }}
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-5 py-2.5 rounded-xl font-poppins font-semibold text-[13px] transition-all shadow-md shadow-[#25D366] border-opacity-20 btn-hover"
        >
          <MessageCircle size={18} /> Laporan WhatsApp
        </button>
      </div>

      {/* Row 1: Manpower KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            title: 'Total Karyawan',
            value: employees.length,
            sub: 'Seluruh Divisi',
            icon: Users,
            color: '#374151',
            bg: '#F3F4F6',
            filter: 'ALL',
          },
          {
            title: 'Man Power Hadir',
            value: presentCount,
            sub: 'Tersedia & Aktif',
            icon: UserCheck,
            color: '#16A34A',
            bg: '#E8FFF2',
            filter: 'HADIR',
          },
          {
            title: 'Dinas & Training',
            value: dinasTrainingCount,
            sub: 'Sedang bertugas',
            icon: MapPin,
            color: '#3B82F6',
            bg: '#EAF2FF',
            filter: 'DINAS',
          },
          {
            title: 'Cuti / Sakit / Izin',
            value: cutiCount + sakitIzinCount,
            sub: 'Tidak tersedia',
            icon: Activity,
            color: '#EF4444',
            bg: '#FFF0F0',
            filter: 'CUTI_SAKIT',
          },
        ].map((kpi, idx) => {
          const KPIIcon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => handleOpenDetail(kpi.title, kpi.filter)}
              className="bg-white rounded-[20px] p-5 border border-[#E5E7EB]/70 premium-hover cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-[14px] md:text-[15px] font-poppins font-medium text-[#374151] max-w-[70%]">{kpi.title || ''}</h3>
                <div
                  className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: kpi.bg, color: kpi.color }}
                >
                  <KPIIcon size={18} strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[36px] font-poppins font-bold text-[#102A56] leading-none mb-1">{kpi.value || 0}</div>
                <div className="text-[11px] md:text-[12px] font-inter text-[#6B7280]">{kpi.sub || ''}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-white rounded-[20px] p-5 border border-[#E5E7EB]/70 premium-hover flex flex-col justify-center shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-[16px] md:text-[18px] font-poppins font-semibold text-[#0D2D66] tracking-tight">Rasio Kehadiran Personel</h2>
          <div className="flex flex-wrap gap-3 md:gap-5 text-[11px] md:text-[13px] font-inter font-medium text-[#374151]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shadow-sm"></div> Hadir
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-sm"></div> Dinas
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-sm"></div> Absen
            </div>
          </div>
        </div>
        <div className="w-full h-[32px] rounded-full overflow-hidden flex shadow-inner border border-[#E5E7EB] cursor-pointer">
          <div
            onClick={() => handleOpenDetail('Personel Hadir', 'HADIR')}
            className="bg-[#16A34A] hover:opacity-90 transition-opacity flex items-center justify-center text-white font-poppins font-semibold text-[12px]"
            style={{ width: `${presentWidthStyle}%` }}
          >
            {presentCount > 0 && `${Math.round(presentWidthStyle)}%`}
          </div>
          <div
            onClick={() => handleOpenDetail('Personel Dinas', 'DINAS')}
            className="bg-[#3B82F6] hover:opacity-90 transition-opacity flex items-center justify-center text-white font-poppins font-semibold text-[12px]"
            style={{ width: `${dinasWidthStyle}%` }}
          >
            {dinasTrainingCount > 0 && `${Math.round(dinasWidthStyle)}%`}
          </div>
          <div
            onClick={() => handleOpenDetail('Personel Absen', 'CUTI_SAKIT')}
            className="bg-[#EF4444] hover:opacity-90 transition-opacity flex items-center justify-center text-white font-poppins font-semibold text-[12px]"
            style={{ width: `${absentWidthStyle}%` }}
          >
            {absentTotal > 0 && `${Math.round(absentWidthStyle)}%`}
          </div>
        </div>
      </div>

      {/* Row 2: Overview Monitoring SAP (Sesuai Gambar 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* WO OVERVIEW */}
        <div className="bg-white rounded-[20px] p-5 md:p-6 border border-[#E5E7EB]/70 shadow-sm relative overflow-hidden flex flex-col">
          <h2 className="text-[16px] md:text-[18px] font-poppins font-semibold text-[#13294B] mb-5 border-b border-[#E5E7EB] pb-3">
            WO OVERVIEW
          </h2>
          <div className="flex items-center justify-center gap-6 md:gap-10 h-[220px]">
            {/* Pie Chart */}
            <div className="h-[180px] w-[180px] relative shrink-0">
              {sapMetrics.totalWO > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={woPieData} dataKey="value" innerRadius={60} outerRadius={80} stroke="none">
                      {woPieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[12px] text-gray-400 flex items-center justify-center h-full">No Data</div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] md:text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">ORDER</span>
                <span className="text-[24px] md:text-[28px] font-poppins font-bold text-[#13294B] leading-none mt-1">
                  {sapMetrics.totalWO}
                </span>
              </div>
            </div>

            {/* Legend & Breakdown */}
            <div className="flex flex-col justify-center gap-3 w-full max-w-[200px]">
              <div className="space-y-1.5 mb-2">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#374151]">
                  <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div> CNF/CLSD{' '}
                  <span className="ml-auto font-bold">{sapMetrics.totalCnf}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#374151]">
                  <div className="w-3 h-3 rounded-full bg-[#F97316]"></div> Open{' '}
                  <span className="ml-auto font-bold">{sapMetrics.totalOpen}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 border-t border-[#E5E7EB] pt-3 text-[11px] md:text-[12px] text-[#6B7280]">
                <div className="flex justify-between">
                  <span>PM01:</span>
                  <strong className="text-[#13294B]">{sapMetrics.pmCounts.PM01}</strong>
                </div>
                <div className="flex justify-between">
                  <span>PM04:</span>
                  <strong className="text-[#13294B]">{sapMetrics.pmCounts.PM04}</strong>
                </div>
                <div className="flex justify-between">
                  <span>PM02:</span>
                  <strong className="text-[#13294B]">{sapMetrics.pmCounts.PM02}</strong>
                </div>
                <div className="flex justify-between">
                  <span>PM05:</span>
                  <strong className="text-[#13294B]">{sapMetrics.pmCounts.PM05}</strong>
                </div>
                <div className="flex justify-between">
                  <span>PM03:</span>
                  <strong className="text-[#13294B]">{sapMetrics.pmCounts.PM03}</strong>
                </div>
                <div className="flex justify-between">
                  <span>PM06:</span>
                  <strong className="text-[#13294B]">{sapMetrics.pmCounts.PM06}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REKOMENDASI OVERVIEW */}
        <div className="bg-white rounded-[20px] p-5 md:p-6 border border-[#E5E7EB]/70 shadow-sm relative overflow-hidden flex flex-col">
          <h2 className="text-[16px] md:text-[18px] font-poppins font-semibold text-[#13294B] mb-5 border-b border-[#E5E7EB] pb-3">
            REKOMENDASI OVERVIEW
          </h2>
          <div className="flex items-center justify-center gap-6 md:gap-10 h-[220px]">
            {/* Pie Chart */}
            <div className="h-[180px] w-[180px] relative shrink-0">
              {sapMetrics.totalNotif > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={notifPieData} dataKey="value" innerRadius={60} outerRadius={80} stroke="none">
                      {notifPieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-[12px] text-gray-400 flex items-center justify-center h-full">No Data</div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] md:text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">NOTIF</span>
                <span className="text-[24px] md:text-[28px] font-poppins font-bold text-[#13294B] leading-none mt-1">
                  {sapMetrics.totalNotif}
                </span>
              </div>
            </div>

            {/* Legend & Breakdown */}
            <div className="flex flex-col justify-center gap-3 w-full max-w-[200px]">
              <div className="space-y-1.5 mb-2">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#374151]">
                  <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div> Selesai{' '}
                  <span className="ml-auto font-bold">{sapMetrics.totalNotifCnf}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#374151]">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div> Open{' '}
                  <span className="ml-auto font-bold">{sapMetrics.totalNotifOpen}</span>
                </div>
              </div>
              <div className="border-t border-[#E5E7EB] pt-3 text-[11px] md:text-[12px] text-[#6B7280]">
                <div className="font-semibold text-[#374151] mb-1">Status Open Terbanyak:</div>
                <div className="flex justify-between">
                  <span>Area Ammonia:</span>
                  <strong className="text-[#13294B]">{complianceNotif.find((c) => c.area === 'AMMONIA')?.open || 0}</strong>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span>Area Urea:</span>
                  <strong className="text-[#13294B]">{complianceNotif.find((c) => c.area === 'UREA')?.open || 0}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Detail Compliance Tables (Sesuai Gambar 2 & 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Detail Compliance WO */}
        <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB]/70 overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-[#13294B] to-[#0D3B66] text-white flex justify-between items-center">
            <h3 className="font-poppins font-semibold text-[14px] uppercase tracking-wider flex items-center gap-2">
              <BarChart2 size={16} /> DETAIL COMPLIANCE WO
            </h3>
            <span className="text-[11px] font-medium bg-white/20 px-2 py-0.5 rounded">Real-time SAP</span>
          </div>
          <div className="p-4 flex-1">
            <table className="w-full text-left compliance-table border border-[#E5E7EB] rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="p-3 text-center">Area</th>
                  <th className="p-3 text-center">Total WO</th>
                  <th className="p-3 text-center">Open</th>
                  <th className="p-3 text-center">CNF</th>
                </tr>
              </thead>
              <tbody className="text-[12px] md:text-[13px] font-inter text-[#374151]">
                {complianceWO.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#E5E7EB] hover:bg-[#F5F9FF] transition-colors">
                    <td className="p-3 font-semibold text-[#13294B] text-center">{row.area || ''}</td>
                    <td className="p-3 text-center font-medium">{row.total || 0}</td>
                    <td className="p-3 text-center text-open">{row.open || 0}</td>
                    <td className="p-3 text-center text-cnf">{row.cnf || 0}</td>
                  </tr>
                ))}
                <tr className="bg-[#F3F4F6] font-bold text-[#13294B]">
                  <td className="p-3 text-center">GRAND TOTAL</td>
                  <td className="p-3 text-center">{sapMetrics.totalWO || 0}</td>
                  <td className="p-3 text-center text-open">{sapMetrics.totalOpen || 0}</td>
                  <td className="p-3 text-center text-cnf">{sapMetrics.totalCnf || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Rekomendasi */}
        <div className="bg-white rounded-[20px] shadow-sm border border-[#E5E7EB]/70 overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-[#13294B] to-[#0D3B66] text-white flex justify-between items-center">
            <h3 className="font-poppins font-semibold text-[14px] uppercase tracking-wider flex items-center gap-2">
              <ClipboardList size={16} /> DETAIL REKOMENDASI
            </h3>
            <span className="text-[11px] font-medium bg-white/20 px-2 py-0.5 rounded">Real-time Notif</span>
          </div>
          <div className="p-4 flex-1">
            <table className="w-full text-left compliance-table border border-[#E5E7EB] rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="p-3 text-center">Area</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">Open</th>
                  <th className="p-3 text-center">Selesai</th>
                </tr>
              </thead>
              <tbody className="text-[12px] md:text-[13px] font-inter text-[#374151]">
                {complianceNotif.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#E5E7EB] hover:bg-[#F5F9FF] transition-colors">
                    <td className="p-3 font-semibold text-[#13294B] text-center">{row.area || ''}</td>
                    <td className="p-3 text-center font-medium">{row.total || 0}</td>
                    <td className="p-3 text-center text-open">{row.open || 0}</td>
                    <td className="p-3 text-center text-cnf">{row.selesai || 0}</td>
                  </tr>
                ))}
                <tr className="bg-[#F3F4F6] font-bold text-[#13294B]">
                  <td className="p-3 text-center">GRAND TOTAL</td>
                  <td className="p-3 text-center">{sapMetrics.totalNotif || 0}</td>
                  <td className="p-3 text-center text-open">{sapMetrics.totalNotifOpen || 0}</td>
                  <td className="p-3 text-center text-cnf">{sapMetrics.totalNotifCnf || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title={detailModal?.title}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {!detailModal?.data || detailModal.data.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#6B7280] font-inter text-[14px]">
              Tidak ada data personel pada kategori ini.
            </div>
          ) : (
            detailModal.data.map((emp: any, idx: any) => (
              <PersonnelCard key={idx} emp={emp} currentStatus={emp.currentStatus} record={emp.record} />
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}

export default DashboardView;
