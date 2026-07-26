import React, { useState } from 'react';
import {
  Briefcase, CheckCircle2, ClipboardList, Database, FileSpreadsheet, History, RefreshCw, UploadCloud,
} from 'lucide-react';
import { getWOStatusClass, getNotifStatusClass } from '../../utils/helpers';

function SAPDataView({ sapWOData, setSapWOData, sapNotifData, setSapNotifData, sapUploadLogs, setSapUploadLogs }: any) {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [uploadType, setUploadType] = useState('WORK_ORDER');
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      if (uploadType === 'WORK_ORDER') {
        const mockWOData = [
          {
            id: Date.now().toString(),
            order: '8001206',
            equipment: 'T-501',
            sortField: 'AMMONIA',
            description: 'Turbin Uap Tambahan',
            orderType: 'PM04',
            workCenter: 'ROTATING 2',
            systemStatus: 'CRTD',
            basicFinishDate: '2026-08-10',
          },
        ];
        setPreviewData({ type: 'WORK_ORDER', data: mockWOData });
      } else {
        const mockNotifData = [
          {
            id: Date.now().toString(),
            notifNo: '2001005',
            equipment: 'T-501',
            sortField: 'AMMONIA',
            description: 'Filter kotor (Baru)',
            systemStatus: 'OSNO',
            date: '2026-07-24',
          },
        ];
        setPreviewData({ type: 'NOTIFICATION', data: mockNotifData });
      }
      setIsUploading(false);
    }, 1500);
  };

  const handleConfirmUpload = () => {
    if (!previewData) return;
    const timestamp = new Date().toLocaleString('id-ID');

    if (previewData.type === 'WORK_ORDER') {
      setSapWOData([...previewData.data, ...sapWOData]);
      setSapUploadLogs([
        {
          id: Date.now(),
          date: timestamp,
          type: 'Upload Work Order',
          user: 'Administrator',
          count: previewData.data.length,
          status: 'Success',
        },
        ...sapUploadLogs,
      ]);
      setToastMessage(`${previewData.data.length} Master Work Order berhasil ditambahkan!`);
    } else if (previewData.type === 'NOTIFICATION') {
      setSapNotifData([...previewData.data, ...sapNotifData]);
      setSapUploadLogs([
        {
          id: Date.now(),
          date: timestamp,
          type: 'Upload Rekomendasi',
          user: 'Administrator',
          count: previewData.data.length,
          status: 'Success',
        },
        ...sapUploadLogs,
      ]);
      setToastMessage(`${previewData.data.length} Data Rekomendasi/Notification berhasil ditambahkan!`);
    }

    setPreviewData(null);
    setActiveTab('monitoring');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const cnfCount = sapWOData.filter((d: any) => ['CNF', 'TECO', 'CLSD'].includes(d.systemStatus)).length;
  const woProgressPerc = sapWOData.length > 0 ? Math.round((cnfCount / sapWOData.length) * 100) : 0;

  const notifClosedCount = sapNotifData.filter((d: any) => ['NOCO', 'ORAS'].includes(d.systemStatus)).length;
  const notifProgressPerc = sapNotifData.length > 0 ? Math.round((notifClosedCount / sapNotifData.length) * 100) : 0;

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-10">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-[28px] md:text-[36px] font-poppins font-semibold text-[#13294B] tracking-tight leading-tight">
          Data SAP & Realisasi
        </h1>
        <p className="text-[14px] md:text-[16px] font-inter text-[#6B7280]">
          Pusat integrasi data Work Order (Order) dan Rekomendasi (Notification).
        </p>
      </div>

      {toastMessage && (
        <div className="bg-[#E8FFF2] border border-[#16A34A] border-opacity-30 text-[#16A34A] px-4 py-3 rounded-[12px] font-poppins font-medium text-[13px] flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-[14px] border border-[#E5E7EB] w-max mb-2">
        <button
          onClick={() => {
            setActiveTab('monitoring');
            setPreviewData(null);
          }}
          className={`px-5 py-2.5 rounded-[10px] text-[13px] md:text-[14px] font-medium font-poppins transition-all flex items-center gap-2 ${activeTab === 'monitoring' ? 'bg-[#13294B] text-white shadow-sm' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}
        >
          <Database size={16} /> Monitoring Dashboard
        </button>
        <button
          onClick={() => {
            setActiveTab('table_wo');
            setPreviewData(null);
          }}
          className={`px-5 py-2.5 rounded-[10px] text-[13px] md:text-[14px] font-medium font-poppins transition-all flex items-center gap-2 ${activeTab === 'table_wo' ? 'bg-[#13294B] text-white shadow-sm' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}
        >
          <Briefcase size={16} /> Data Work Order
        </button>
        <button
          onClick={() => {
            setActiveTab('table_notif');
            setPreviewData(null);
          }}
          className={`px-5 py-2.5 rounded-[10px] text-[13px] md:text-[14px] font-medium font-poppins transition-all flex items-center gap-2 ${activeTab === 'table_notif' ? 'bg-[#13294B] text-white shadow-sm' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}
        >
          <ClipboardList size={16} /> Data Rekomendasi
        </button>
        <button
          onClick={() => {
            setActiveTab('upload');
            setPreviewData(null);
          }}
          className={`px-5 py-2.5 rounded-[10px] text-[13px] md:text-[14px] font-medium font-poppins transition-all flex items-center gap-2 ${activeTab === 'upload' ? 'bg-[#13294B] text-white shadow-sm' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}
        >
          <UploadCloud size={16} /> Upload Data SAP
        </button>
      </div>

      {activeTab === 'monitoring' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-[20px] border border-[#E5E7EB] shadow-sm">
              <div className="text-[12px] text-[#6B7280] font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase size={16} /> Metrik Work Order (Order)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[32px] font-poppins font-bold text-[#13294B]">{sapWOData.length}</div>
                  <div className="text-[12px] text-[#6B7280]">Total Work Order</div>
                </div>
                <div>
                  <div className="text-[32px] font-poppins font-bold text-[#3B82F6]">{woProgressPerc}%</div>
                  <div className="text-[12px] text-[#6B7280]">Selesai (CNF/TECO)</div>
                  <div className="w-full bg-[#F3F4F6] rounded-full h-1.5 mt-1">
                    <div className="bg-[#3B82F6] h-1.5 rounded-full" style={{ width: `${woProgressPerc}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[20px] border border-[#E5E7EB] shadow-sm">
              <div className="text-[12px] text-[#6B7280] font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <ClipboardList size={16} /> Metrik Rekomendasi (Notification)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[32px] font-poppins font-bold text-[#13294B]">{sapNotifData.length}</div>
                  <div className="text-[12px] text-[#6B7280]">Total Rekomendasi</div>
                </div>
                <div>
                  <div className="text-[32px] font-poppins font-bold text-[#16A34A]">{notifProgressPerc}%</div>
                  <div className="text-[12px] text-[#6B7280]">Selesai (NOCO)</div>
                  <div className="w-full bg-[#F3F4F6] rounded-full h-1.5 mt-1">
                    <div className="bg-[#16A34A] h-1.5 rounded-full" style={{ width: `${notifProgressPerc}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] border border-[#E5E7EB]/70 shadow-sm">
            <h3 className="font-poppins font-semibold text-[16px] text-[#13294B] mb-4 flex items-center gap-2">
              <History size={16} /> Riwayat Upload SAP Terakhir
            </h3>
            <div className="flex flex-col gap-4">
              {sapUploadLogs.length === 0 ? (
                <div className="text-[12px] text-[#9CA3AF] text-center py-4">Belum ada riwayat aktivitas import.</div>
              ) : (
                sapUploadLogs.map((log: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-[#3B82F6] pl-3 py-1">
                    <div className="text-[12px] font-bold text-[#374151]">{log.type || ''}</div>
                    <div className="text-[11px] text-[#6B7280] mt-0.5">
                      {log.count || 0} Records • {log.status || ''}
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] font-mono mt-1">
                      {log.date || ''} oleh {log.user || ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'table_wo' && (
        <div className="bg-white rounded-[24px] border border-[#E5E7EB]/70 shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-5 md:p-6 border-b border-[#E5E7EB] flex justify-between items-center">
            <h3 className="font-poppins font-semibold text-[16px] md:text-[18px] text-[#13294B]">Tabel Data Work Order (Order)</h3>
            <span className="text-[12px] bg-[#F3F4F6] text-[#6B7280] px-3 py-1 rounded-full font-medium">{sapWOData.length} Records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] md:text-[14px] font-inter text-[#374151]">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-4">WO & Equipment</th>
                  <th className="p-4">Deskripsi Pekerjaan</th>
                  <th className="p-4">Type & Center</th>
                  <th className="p-4">Basic Finish Date</th>
                  <th className="p-4">System Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {sapWOData.map((row: any) => (
                  <tr key={row.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="p-4 font-medium text-[#13294B]">
                      WO: {row.order || ''}{' '}
                      <span className="block text-[12px] text-[#6B7280] font-normal">
                        {row.equipment || ''} • {row.sortField || ''}
                      </span>
                    </td>
                    <td className="p-4 max-w-[250px] truncate" title={row.description}>
                      {row.description || ''}
                    </td>
                    <td className="p-4">
                      <div className="text-[12px] font-bold">{row.orderType || ''}</div>
                      <div className="text-[11px] text-[#6B7280]">{row.workCenter || ''}</div>
                    </td>
                    <td className="p-4 font-mono text-[12px] text-[#6B7280]">{row.basicFinishDate || ''}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap ${getWOStatusClass(row.systemStatus)}`}
                      >
                        {row.systemStatus || ''}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'table_notif' && (
        <div className="bg-white rounded-[24px] border border-[#E5E7EB]/70 shadow-sm overflow-hidden animate-in fade-in">
          <div className="p-5 md:p-6 border-b border-[#E5E7EB] flex justify-between items-center">
            <h3 className="font-poppins font-semibold text-[16px] md:text-[18px] text-[#13294B]">Tabel Data Rekomendasi (Notification)</h3>
            <span className="text-[12px] bg-[#F3F4F6] text-[#6B7280] px-3 py-1 rounded-full font-medium">
              {sapNotifData.length} Records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] md:text-[14px] font-inter text-[#374151]">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-semibold border-b border-[#E5E7EB]">
                <tr>
                  <th className="p-4">Notification No.</th>
                  <th className="p-4">Equipment</th>
                  <th className="p-4">Deskripsi Temuan</th>
                  <th className="p-4">Tanggal Masuk</th>
                  <th className="p-4">System Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {sapNotifData.map((row: any) => (
                  <tr key={row.id} className="hover:bg-[#F5F7FA] transition-colors">
                    <td className="p-4 font-medium font-mono text-[#13294B]">{row.notifNo || ''}</td>
                    <td className="p-4 font-semibold text-[#3B82F6]">
                      {row.equipment || ''} <span className="block text-[11px] text-[#6B7280] font-normal">{row.sortField || ''}</span>
                    </td>
                    <td className="p-4 max-w-[250px] truncate" title={row.description}>
                      {row.description || ''}
                    </td>
                    <td className="p-4 font-mono text-[12px] text-[#6B7280]">{row.date || ''}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap ${getNotifStatusClass(row.systemStatus)}`}
                      >
                        {row.systemStatus || ''}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="bg-white p-5 md:p-[32px] rounded-[24px] border border-[#E5E7EB]/70 shadow-sm animate-in fade-in max-w-2xl mx-auto">
          <h3 className="font-poppins font-semibold text-[18px] text-[#13294B] mb-2">Upload Data SAP (.xlsx / .csv)</h3>
          <p className="text-[13px] text-[#6B7280] mb-6">
            Pilih jenis data yang akan diunggah untuk memperbarui database monitoring kita secara massal.
          </p>

          {!previewData ? (
            <>
              <div className="flex gap-4 mb-6">
                <label
                  className={`flex-1 flex items-center gap-3 p-4 border rounded-[16px] cursor-pointer transition-all ${uploadType === 'WORK_ORDER' ? 'border-[#3B82F6] bg-[#F5F9FF]' : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'}`}
                >
                  <input
                    type="radio"
                    name="uploadType"
                    checked={uploadType === 'WORK_ORDER'}
                    onChange={() => setUploadType('WORK_ORDER')}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-semibold text-[14px] text-[#13294B]">Data Work Order</div>
                    <div className="text-[11px] text-[#6B7280]">Update Master Data & Status CNF/TECO</div>
                  </div>
                </label>
                <label
                  className={`flex-1 flex items-center gap-3 p-4 border rounded-[16px] cursor-pointer transition-all ${uploadType === 'NOTIFICATION' ? 'border-[#3B82F6] bg-[#F5F9FF]' : 'border-[#E5E7EB] hover:bg-[#F9FAFB]'}`}
                >
                  <input
                    type="radio"
                    name="uploadType"
                    checked={uploadType === 'NOTIFICATION'}
                    onChange={() => setUploadType('NOTIFICATION')}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-semibold text-[14px] text-[#13294B]">Data Rekomendasi</div>
                    <div className="text-[11px] text-[#6B7280]">Update Status Temuan (OSNO/NOCO)</div>
                  </div>
                </label>
              </div>

              <div className="border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] rounded-[20px] p-10 flex flex-col items-center justify-center text-center hover:bg-[#F5F7FA] transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-[#EAF2FF] text-[#2563EB] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet size={32} />
                </div>
                <h4 className="font-poppins font-semibold text-[#374151] text-[15px] mb-1">Tarik & Lepas file Anda di sini</h4>
                <p className="text-[12px] text-[#9CA3AF]">atau klik untuk menelusuri dari perangkat Anda.</p>
              </div>

              <button
                onClick={handleSimulateUpload}
                disabled={isUploading}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-[#0D3B66] text-white px-5 py-3.5 rounded-xl text-[14px] font-medium btn-hover disabled:opacity-70"
              >
                {isUploading ? <RefreshCw size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                {isUploading ? 'Memproses File...' : 'Validasi Data & Preview'}
              </button>
            </>
          ) : (
            <div className="bg-white border border-[#16A34A] border-opacity-30 shadow-lg rounded-[20px] p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#16A34A]"></div>
              <h3 className="font-poppins font-semibold text-[16px] text-[#13294B] mb-2 flex items-center gap-2">
                <CheckCircle2 className="text-[#16A34A]" /> Preview Data Berhasil Divalidasi
              </h3>
              <p className="text-[12px] text-[#6B7280] mb-4">
                Terdapat <strong>{previewData.data.length}</strong> baris data {previewData.type} siap diproses.
              </p>

              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[12px] overflow-hidden mb-5">
                <table className="w-full text-left text-[11px] font-inter">
                  <thead className="bg-[#E5E7EB]/50 text-[#374151] font-semibold">
                    <tr>
                      <th className="p-2">No. Identitas</th>
                      <th className="p-2">Equipment</th>
                      <th className="p-2">Status Baru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {previewData.data.map((r: any, i: any) => (
                      <tr key={i} className="hover:bg-white">
                        <td className="p-2 font-mono font-medium">{r.order || r.notifNo || ''}</td>
                        <td className="p-2">{r.equipment || ''}</td>
                        <td className="p-2">
                          <span className="text-[#16A34A] font-bold px-2 py-0.5 bg-[#E8FFF2] rounded border border-[#16A34A] border-opacity-20">
                            {r.systemStatus || ''}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewData(null)}
                  className="w-1/3 py-2.5 rounded-xl text-[13px] font-medium bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB] transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmUpload}
                  className="w-2/3 py-2.5 rounded-xl text-[13px] font-medium bg-[#16A34A] text-white hover:bg-[#15803d] shadow-md transition-colors"
                >
                  Konfirmasi & Simpan
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SAPDataView;
