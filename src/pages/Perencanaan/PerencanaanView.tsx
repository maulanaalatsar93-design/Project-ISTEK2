import React, { useState, useEffect } from 'react';
import { Bot, Briefcase, Check, FileDown, PlusCircle } from 'lucide-react';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import { PROGRAM_TYPES, INITIAL_USERS } from '../../data/mockData';
import { callGeminiLLM } from '../../utils/geminiApi';

function PerencanaanView({ plans, setPlans, employees, currentUser }: any) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<any>(null);

  const [aiSummary, setAiSummary] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: '',
    program_type: PROGRAM_TYPES[0],
    description: '',
    start_date: '',
    end_date: '',
    needed_manpower: 0,
    allocated_personnel: [],
    bypassVP: false,
    selectedAVPs: [],
  });

  useEffect(() => {
    setAiSummary('');
  }, [detailModal]);

  const handleGenerateSummary = async () => {
    if (!detailModal) return;
    setIsGeneratingSummary(true);
    try {
      const prompt = `Buat ringkasan eksekutif singkat dan profesional dari rencana kerja berikut:
      Judul: ${detailModal.title}
      Tipe: ${detailModal.program_type}
      Deskripsi Singkat: ${detailModal.description}
      Durasi Pelaksanaan: ${detailModal.start_date} s/d ${detailModal.end_date}
      Jumlah Personel Dibutuhkan: ${detailModal.needed_manpower} Orang.`;

      const result = await callGeminiLLM(prompt, 'Anda adalah konsultan operasional pabrik.');
      setAiSummary(result);
    } catch (error) {
      alert('Gagal memproses Ringkasan AI.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleTogglePersonnel = (empId: number) => {
    setFormData((prev: any) => {
      const selected = prev.allocated_personnel.includes(empId)
        ? prev.allocated_personnel.filter((id: any) => id !== empId)
        : [...prev.allocated_personnel, empId];
      return { ...prev, allocated_personnel: selected, needed_manpower: selected.length };
    });
  };

  const handleToggleAVP = (avpName: string) => {
    setFormData((prev: any) => {
      let updated = [...prev.selectedAVPs];
      if (updated.includes(avpName)) updated = updated.filter((n: string) => n !== avpName);
      else {
        if (updated.length < 3) updated.push(avpName);
        else alert('Maksimal 3 AVP.');
      }
      return { ...prev, selectedAVPs: updated };
    });
  };

  const handleSavePlan = (isDraft: boolean) => {
    if (!isDraft && !formData.bypassVP && formData.selectedAVPs.length === 0)
      return alert('Pilih minimal 1 AVP untuk approval, atau centang Bypass VP.');
    if (!formData.title || !formData.start_date || !formData.end_date) return alert('Lengkapi data program terlebih dahulu.');

    const planStatus = isDraft ? 'Draft' : formData.bypassVP ? 'Pending VP' : 'Pending AVP';
    const vpName = INITIAL_USERS.find((u) => u.position.includes('VP'))?.name || 'Febryan Bagus P';
    const planApprovers = isDraft ? [] : formData.bypassVP ? [vpName] : formData.selectedAVPs;

    const newPlan = {
      id: Date.now(),
      ...formData,
      status: planStatus,
      pending_approvers: planApprovers,
      history: [{ date: new Date().toISOString().split('T')[0], action: isDraft ? 'Draft Saved' : 'Submitted', user: currentUser.name }],
      signatures: [{ name: currentUser.name, role: currentUser.position, date: new Date().toISOString().split('T')[0], title: 'Pembuat' }],
    };

    setPlans([newPlan, ...plans]);
    setIsFormOpen(false);
    if (!isDraft) alert(`Perencanaan diajukan! Notifikasi dikirim.`);
    else alert(`Perencanaan disimpan sebagai Draft.`);
  };

  const handleApprove = (planId: number, currentStatus: string) => {
    setPlans(
      plans.map((p: any) => {
        if (p.id !== planId) return p;
        let newPending = p.pending_approvers.filter((name: string) => name !== currentUser.name);
        let nextStatus = currentStatus;
        let actionStr = `Approved by ${currentUser.name}`;

        if (currentStatus === 'Pending AVP') {
          if (newPending.length === 0) {
            nextStatus = 'Pending VP';
            const vpName = INITIAL_USERS.find((u) => u.position.includes('VP'))?.name || 'Febryan Bagus P';
            newPending = [vpName];
            actionStr = `Approved by ${currentUser.name}. All AVPs Approved. Forwarded to VP.`;
          }
        } else if (currentStatus === 'Pending VP') {
          nextStatus = 'Approved';
          actionStr = 'Final Approved by VP';
        }

        const newHistory = [...p.history, { date: new Date().toISOString().split('T')[0], action: actionStr, user: currentUser.name }];
        const newSigs = [
          ...p.signatures,
          { name: currentUser.name, role: currentUser.position, date: new Date().toISOString().split('T')[0], title: 'Approver' },
        ];
        return { ...p, status: nextStatus, pending_approvers: newPending, history: newHistory, signatures: newSigs };
      }),
    );
    setDetailModal(null);
  };

  const handleRejectOrRevise = (planId: number, isRevision: boolean) => {
    setPlans(
      plans.map((p: any) => {
        if (p.id !== planId) return p;
        const statusStr = isRevision ? 'Revision' : 'Rejected';
        const actionStr = isRevision ? 'Requested Revision' : 'Rejected';
        return {
          ...p,
          status: statusStr,
          pending_approvers: [],
          history: [...p.history, { date: new Date().toISOString().split('T')[0], action: actionStr, user: currentUser.name }],
        };
      }),
    );
    setDetailModal(null);
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[28px] md:text-[36px] font-poppins font-semibold text-[#13294B] tracking-tight leading-tight">
            Perencanaan Personel
          </h1>
          <p className="text-[14px] md:text-[16px] font-inter text-[#6B7280]">Penyusunan tim kerja dan alur persetujuan (AVP & VP).</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-[#0D3B66] text-white px-5 py-3 rounded-xl text-[14px] font-medium btn-hover shadow-lg shadow-[#0D3B66]/20"
        >
          <PlusCircle size={18} /> Buat Perencanaan Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((plan: any) => (
            <div
              key={plan.id}
              onClick={() => setDetailModal(plan)}
              className="bg-white border border-[#E5E7EB] p-5 rounded-[20px] cursor-pointer premium-hover flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <StatusBadge status={plan.status} />
                <div className="w-8 h-8 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#6B7280]">
                  <Briefcase size={16} />
                </div>
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-[16px] text-[#13294B] leading-tight mb-1">{plan.title}</h3>
                <div className="text-[12px] text-[#6B7280] font-inter">{plan.program_type}</div>
              </div>
              <div className="pt-4 border-t border-[#F3F4F6] grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <span className="text-[#9CA3AF] block text-[10px] uppercase font-bold tracking-wider">Durasi</span>{' '}
                  <strong className="text-[#374151]">
                    {plan.start_date.substring(5)} s/d {plan.end_date.substring(5)}
                  </strong>
                </div>
                <div>
                  <span className="text-[#9CA3AF] block text-[10px] uppercase font-bold tracking-wider">Personel</span>{' '}
                  <strong className="text-[#374151]">{plan.needed_manpower} Orang</strong>
                </div>
              </div>
              {plan.pending_approvers?.length > 0 && (
                <div className="text-[11px] text-[#D97706] font-medium bg-[#FFF8E6] p-2 rounded-lg border border-[#F59E0B] border-opacity-20">
                  Menunggu Approval: {plan.pending_approvers.join(', ')}
                </div>
              )}
            </div>
          ))}
          {plans.length === 0 && <div className="col-span-full py-12 text-center text-[#6B7280]">Belum ada dokumen perencanaan.</div>}
        </div>
      </div>

      {/* FORM BUAT PERENCANAAN */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Penyusunan Perencanaan Program">
        <form className="space-y-6">
          <div className="bg-[#F9FAFB] p-5 rounded-[16px] border border-[#E5E7EB] space-y-4">
            <h4 className="font-poppins font-semibold text-[#13294B] text-[15px] border-b pb-2">Informasi Program</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#374151] mb-1">Judul Program</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#374151] mb-1">Tipe Program</label>
                <select
                  value={formData.program_type}
                  onChange={(e) => setFormData({ ...formData, program_type: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
                >
                  {PROGRAM_TYPES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#374151] mb-1">Tanggal Mulai</label>
                <input
                  required
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-[13px] outline-none"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#374151] mb-1">Tanggal Selesai</label>
                <input
                  required
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-[13px] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#F9FAFB] p-5 rounded-[16px] border border-[#E5E7EB]">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h4 className="font-poppins font-semibold text-[#13294B] text-[15px]">Pemilihan Personel (Plotting)</h4>
              <span className="text-[12px] font-bold bg-[#EAF2FF] text-[#2563EB] px-2 py-1 rounded-md">
                Terpilih: {formData.allocated_personnel.length}
              </span>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-3 pr-2">
              {employees.map((emp: any) => {
                const isSelected = formData.allocated_personnel.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => handleTogglePersonnel(emp.id)}
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-[#2563EB] bg-[#F5F9FF]' : 'border-[#E5E7EB] bg-white'}`}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#D1D5DB]'}`}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#13294B] truncate">{emp.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#FFF8E6] border border-[#F59E0B] border-opacity-30 p-5 rounded-[16px]">
            <h4 className="font-poppins font-semibold text-[#D97706] text-[14px] mb-3">Pengaturan Approval (Pilih 1 hingga 3 AVP)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {employees
                .filter((e: any) => e.position.includes('AVP'))
                .map((avp: any) => {
                  const isSelected = formData.selectedAVPs.includes(avp.name);
                  return (
                    <div
                      key={avp.id}
                      onClick={() => !formData.bypassVP && handleToggleAVP(avp.name)}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${formData.bypassVP ? 'opacity-50' : isSelected ? 'border-[#D97706] bg-[#FFFBEB]' : 'border-[#F59E0B] border-opacity-30 bg-white'}`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-[#D97706] border-[#D97706]' : 'border-[#D1D5DB]'}`}
                      >
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-[#92400E]">{avp.name}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-[#F59E0B] border-opacity-20">
              <input
                type="checkbox"
                id="bypass"
                checked={formData.bypassVP}
                onChange={(e) => setFormData({ ...formData, bypassVP: e.target.checked, selectedAVPs: [] })}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="bypass" className="text-[13px] text-[#92400E] font-medium cursor-pointer">
                Kondisi Mendesak: Bypass langsung ke VP
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSavePlan(true)}
              className="px-5 py-2.5 rounded-xl text-[14px] font-medium bg-[#F3F4F6] text-[#6B7280]"
            >
              Simpan Draft
            </button>
            <button
              type="button"
              onClick={() => handleSavePlan(false)}
              className="px-5 py-2.5 rounded-xl text-[14px] font-medium bg-[#0D3B66] text-white shadow-md"
            >
              Submit Dokumen
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL DETAIL PERENCANAAN */}
      <Modal isOpen={!!detailModal} onClose={() => setDetailModal(null)} title="Detail Dokumen Perencanaan">
        {detailModal && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-[20px] font-poppins font-bold text-[#13294B]">{detailModal.title}</h2>
                <p className="text-[13px] text-[#6B7280] mt-1">{detailModal.description}</p>
              </div>
              <div className="flex items-center gap-3">
                {['Manager', 'Administrator'].includes(currentUser.role) && (
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGeneratingSummary}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[12px] font-semibold rounded-lg border border-indigo-200 disabled:opacity-50"
                  >
                    <Bot size={14} /> {isGeneratingSummary ? 'Menganalisis...' : 'AI Summary'}
                  </button>
                )}
                <StatusBadge status={detailModal.status} />
              </div>
            </div>

            {aiSummary && (
              <div className="bg-gradient-to-r from-[#F5F9FF] to-[#EEF2F7] border border-[#2563EB] border-opacity-20 p-4 rounded-[16px] relative">
                <h4 className="font-poppins font-semibold text-[#13294B] text-[13px] mb-2 flex items-center gap-2">
                  <Bot size={16} className="text-[#2563EB]" /> Ringkasan Eksekutif AI
                </h4>
                <p className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-line">{aiSummary}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 border border-[#E5E7EB] rounded-[16px] shadow-sm">
              <div>
                <div className="text-[10px] uppercase text-[#9CA3AF] font-bold">Tipe Program</div>
                <div className="font-semibold text-[#374151] text-[13px]">{detailModal.program_type}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-[#9CA3AF] font-bold">Mulai</div>
                <div className="font-semibold text-[#374151] text-[13px]">{detailModal.start_date}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-[#9CA3AF] font-bold">Selesai</div>
                <div className="font-semibold text-[#374151] text-[13px]">{detailModal.end_date}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-[#9CA3AF] font-bold">Total Personel</div>
                <div className="font-semibold text-[#374151] text-[13px]">{detailModal.needed_manpower} Orang</div>
              </div>
            </div>

            {detailModal.status === 'Approved' && (
              <div className="flex justify-end gap-3 pt-6 border-t border-[#E5E7EB]">
                <button className="px-5 py-2.5 rounded-xl text-[13px] font-medium bg-[#FFF0F0] text-[#EF4444] flex items-center gap-2">
                  <FileDown size={16} /> Export PDF Resmi
                </button>
              </div>
            )}

            {detailModal.pending_approvers?.includes(currentUser.name) && (
              <div className="flex justify-end gap-3 pt-6 border-t border-[#E5E7EB]">
                <button
                  onClick={() => handleRejectOrRevise(detailModal.id, true)}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-medium bg-amber-50 text-amber-600"
                >
                  Request Revision
                </button>
                <button
                  onClick={() => handleApprove(detailModal.id, detailModal.status)}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-medium bg-[#16A34A] text-white"
                >
                  Berikan Approval
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default PerencanaanView;
