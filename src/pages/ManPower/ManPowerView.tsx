import React, { useState } from 'react';
import { Activity, PlusCircle, Search, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import { MOCK_STATUSES } from '../../data/mockData';
import { calculateWorkingDays } from '../../utils/helpers';

function ManPowerView({ attendanceChanges, employees, setAttendanceChanges }: any) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<any>({
    employee_id: '',
    status_id: MOCK_STATUSES[0].id,
    start_date: '',
    end_date: '',
    note: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const getEmployeeName = (id: number) => employees.find((e: any) => e.id === id)?.name || 'Karyawan Tidak Ditemukan';
  const activeOrUpcomingCount = attendanceChanges.filter((a: any) => a.end_date >= today).length;

  const filteredChanges = [...attendanceChanges]
    .sort((a: any, b: any) => (a.start_date < b.start_date ? 1 : -1))
    .filter((a: any) => getEmployeeName(a.employee_id).toLowerCase().includes(searchTerm.toLowerCase()));

  const resetForm = () => setFormData({ employee_id: '', status_id: MOCK_STATUSES[0].id, start_date: '', end_date: '', note: '' });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.start_date || !formData.end_date) {
      alert('Lengkapi Karyawan, Tanggal Mulai, dan Tanggal Selesai terlebih dahulu.');
      return;
    }
    if (formData.end_date < formData.start_date) {
      alert('Tanggal Selesai tidak boleh sebelum Tanggal Mulai.');
      return;
    }

    const newRecord = {
      id: Date.now(),
      employee_id: parseInt(formData.employee_id as any),
      start_date: formData.start_date,
      end_date: formData.end_date,
      status_id: parseInt(formData.status_id as any),
      note: formData.note,
      status: 'Approved',
      duration: calculateWorkingDays(formData.start_date, formData.end_date),
    };

    setAttendanceChanges([newRecord, ...attendanceChanges]);
    resetForm();
    setIsFormOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Hapus catatan perubahan status ini?')) {
      setAttendanceChanges(attendanceChanges.filter((a: any) => a.id !== id));
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-[28px] md:text-[36px] font-poppins font-semibold text-[#13294B] tracking-tight leading-tight">
            Man Power Control
          </h1>
          <p className="text-[14px] md:text-[16px] font-inter text-[#6B7280]">
            Kelola perubahan status kehadiran (Cuti, Sakit, Dinas, dll) seluruh personel.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-[#0D3B66] text-white px-5 py-3 rounded-xl text-[14px] font-medium btn-hover shadow-lg shadow-[#0D3B66]/20"
        >
          <PlusCircle size={18} /> Catat Perubahan Status
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-[20px] p-5 border border-[#E5E7EB]/70 shadow-sm">
          <div className="text-[13px] text-[#6B7280] font-medium mb-1">Total Personel</div>
          <div className="text-[28px] font-poppins font-bold text-[#13294B]">{employees.length}</div>
        </div>
        <div className="bg-white rounded-[20px] p-5 border border-[#E5E7EB]/70 shadow-sm">
          <div className="text-[13px] text-[#6B7280] font-medium mb-1">Catatan Aktif / Akan Datang</div>
          <div className="text-[28px] font-poppins font-bold text-[#2563EB]">{activeOrUpcomingCount}</div>
        </div>
        <div className="bg-white rounded-[20px] p-5 border border-[#E5E7EB]/70 shadow-sm">
          <div className="text-[13px] text-[#6B7280] font-medium mb-1">Total Riwayat Tercatat</div>
          <div className="text-[28px] font-poppins font-bold text-[#13294B]">{attendanceChanges.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-[#E5E7EB]/70 shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="font-poppins font-semibold text-[16px] md:text-[18px] text-[#13294B]">Riwayat Perubahan Status</h3>
          <div className="flex items-center gap-2 bg-[#F5F7FA] border border-[#E5E7EB] rounded-full px-3 py-2 w-full sm:w-[240px]">
            <Search size={14} className="text-[#6B7280]" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama karyawan..."
              className="bg-transparent text-[13px] outline-none w-full"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] md:text-[14px] font-inter text-[#374151]">
            <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
              <tr>
                <th className="p-4">Karyawan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Periode</th>
                <th className="p-4">Durasi</th>
                <th className="p-4">Catatan</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filteredChanges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#9CA3AF]">
                    Belum ada catatan perubahan status.
                  </td>
                </tr>
              ) : (
                filteredChanges.map((row: any) => {
                  const status = MOCK_STATUSES.find((s: any) => s.id === row.status_id);
                  const StatusIcon = status?.icon || Activity;
                  return (
                    <tr key={row.id} className="hover:bg-[#F5F7FA] transition-colors">
                      <td className="p-4 font-medium text-[#13294B]">{getEmployeeName(row.employee_id)}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold ${status?.bg || ''} ${status?.color || ''}`}
                        >
                          <StatusIcon size={12} strokeWidth={3} /> {status?.name || 'Tidak Diketahui'}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[12px] text-[#6B7280]">
                        {row.start_date} s/d {row.end_date}
                      </td>
                      <td className="p-4">{row.duration || calculateWorkingDays(row.start_date, row.end_date)} Hari</td>
                      <td className="p-4 max-w-[220px] truncate" title={row.note}>
                        {row.note || '-'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="p-2 rounded-lg text-[#EF4444] hover:bg-[#FFF0F0] transition-colors"
                          title="Hapus catatan"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Catat Perubahan Status Kehadiran">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#374151] mb-1">Karyawan</label>
            <select
              required
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
            >
              <option value="">Pilih Karyawan</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.npk})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#374151] mb-1">Status</label>
            <select
              required
              value={formData.status_id}
              onChange={(e) => setFormData({ ...formData, status_id: e.target.value })}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
            >
              {MOCK_STATUSES.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">Tanggal Mulai</label>
              <input
                required
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">Tanggal Selesai</label>
              <input
                required
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#374151] mb-1">Catatan (Opsional)</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-5 py-2 rounded-xl text-[13px] font-medium bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-[13px] font-medium bg-[#0D3B66] text-white shadow-md hover:bg-[#13294B]"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ManPowerView;
