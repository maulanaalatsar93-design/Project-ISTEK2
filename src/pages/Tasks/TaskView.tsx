import React, { useState } from 'react';
import {
  AlertCircle, Briefcase, Calendar as CalendarIcon, Check, Flag, History, MapPin,
  MessageSquare, PlusCircle, Send, Sparkles,
} from 'lucide-react';
import Modal from '../../components/Modal';
import { callGeminiLLM } from '../../utils/geminiApi';

function TaskView({ plans, tasks, setTasks, employees, currentUser, setNotifications }: any) {
  const approvedPlans = plans.filter((p: any) => p.status === 'Approved');
  const [selectedPlanId, setSelectedPlanId] = useState<any>(approvedPlans.length > 0 ? approvedPlans[0].id : '');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: '',
    execution_date: '',
    target_date: '',
    priority: 'Sedang',
    assignees: [] as number[],
  });

  const selectedPlan = approvedPlans.find((p: any) => p.id === parseInt(selectedPlanId));
  const planTasks = tasks.filter((t: any) => t.plan_id === parseInt(selectedPlanId));
  const columns = ['Not Started', 'In Progress', 'On Hold', 'Completed'];

  const getPriorityStyle = (priority: string) => {
    if (priority === 'Tinggi') return 'bg-rose-50 text-rose-600 border border-rose-200';
    if (priority === 'Sedang') return 'bg-amber-50 text-amber-600 border border-amber-200';
    return 'bg-blue-50 text-blue-600 border border-blue-200';
  };

  const handleToggleAssignee = (empId: number) => {
    setFormData((prev) => {
      const selected = prev.assignees.includes(empId) ? prev.assignees.filter((id: any) => id !== empId) : [...prev.assignees, empId];
      return { ...prev, assignees: selected };
    });
  };

  const handleGenerateAIDescription = async () => {
    if (!formData.title || !formData.area) {
      alert("Mohon isi 'Judul Pekerjaan' dan 'Area / Lokasi' terlebih dahulu agar AI dapat memahami konteks SOW.");
      return;
    }

    setIsGeneratingDesc(true);
    try {
      const prompt = `Buat deskripsi tugas/Scope of Work (SOW) yang sangat ringkas dan profesional untuk teknisi pemeliharaan pabrik.
      Judul Pekerjaan: ${formData.title}
      Lokasi: ${formData.area}
      Prioritas: ${formData.priority}
      Format yang diinginkan: 1. Tujuan Pekerjaan 2. Langkah Eksekusi 3. Persyaratan K3 / Safety.`;

      const result = await callGeminiLLM(prompt);
      setFormData((prev) => ({ ...prev, description: result }));
    } catch (error) {
      alert('Gagal menghubungi Gemini API. Pastikan API Key tersedia dan koneksi internet stabil.');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.assignees.length === 0) return alert('Lengkapi judul dan assignees!');

    const newTask = {
      id: Date.now(),
      plan_id: parseInt(selectedPlanId),
      ...formData,
      pic: currentUser.name,
      status: 'Not Started',
      logs: [{ id: Date.now(), date: new Date().toISOString(), user: currentUser.name, note: 'Task SOW dibuat.' }],
    };

    setTasks([...tasks, newTask]);

    const newNotifs = formData.assignees.map((empId: any) => {
      const emp = employees.find((e: any) => e.id === empId);
      return {
        id: Date.now() + Math.random(),
        user_id: emp?.emp_id,
        title: 'Tugas Baru Diberikan',
        message: `Anda ditugaskan pada task baru: ${formData.title}`,
        date: new Date().toISOString().split('T')[0],
        read: false,
      };
    });
    setNotifications((prev: any) => [...prev, ...newNotifs]);
    setIsFormOpen(false);
    setFormData({ title: '', description: '', area: '', execution_date: '', target_date: '', priority: 'Sedang', assignees: [] });
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const newLog = { id: Date.now(), date: new Date().toISOString(), user: currentUser.name, note: chatMessage };
    const updatedTasks = tasks.map((t: any) => (t.id === activeTask.id ? { ...t, logs: [...t.logs, newLog] } : t));
    setTasks(updatedTasks);
    setActiveTask({ ...activeTask, logs: [...activeTask.logs, newLog] });
    setChatMessage('');
  };

  const handleStatusChange = (newStatus: string) => {
    const newLog = {
      id: Date.now(),
      date: new Date().toISOString(),
      user: 'System',
      note: `${currentUser.name} memperbarui status menjadi: ${newStatus}`,
    };
    const updatedTasks = tasks.map((t: any) => (t.id === activeTask.id ? { ...t, status: newStatus, logs: [...t.logs, newLog] } : t));
    setTasks(updatedTasks);
    setActiveTask({ ...activeTask, status: newStatus, logs: [...activeTask.logs, newLog] });
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-10 flex flex-col h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-[28px] md:text-[36px] font-poppins font-semibold text-[#13294B] tracking-tight leading-tight">
            Manajemen Task
          </h1>
          <p className="text-[14px] md:text-[16px] font-inter text-[#6B7280]">
            Distribusi tugas dan monitoring progres dari program yang telah di-Approve.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-[16px] border border-[#E5E7EB] shadow-sm w-full md:w-auto">
          <Briefcase size={18} className="text-[#6B7280] ml-2" />
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="bg-transparent border-none text-[14px] font-poppins font-medium text-[#13294B] focus:ring-0 outline-none w-full md:w-[250px] cursor-pointer"
          >
            {approvedPlans.length === 0 ? (
              <option value="">Tidak ada program Approved</option>
            ) : (
              approvedPlans.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.title || ''}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {approvedPlans.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[24px] border border-[#E5E7EB] border-dashed p-10">
          <AlertCircle size={48} className="text-[#9CA3AF] mb-4" />
          <h3 className="text-[18px] font-poppins font-semibold text-[#374151]">Belum ada Perencanaan yang Disetujui</h3>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center bg-[#F9FAFB] p-4 rounded-[16px] border border-[#E5E7EB]">
            <div>
              <div className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">Total Task SOW</div>
              <div className="text-[20px] font-poppins font-bold text-[#13294B]">{planTasks.length} Pekerjaan</div>
            </div>
            {['Administrator', 'Manager', 'Supervisor'].includes(currentUser.role) && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-[#0D3B66] text-white px-5 py-2.5 rounded-xl text-[13px] font-medium btn-hover shadow-md"
              >
                <PlusCircle size={16} /> Tambah SOW
              </button>
            )}
          </div>

          <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
            <div className="flex gap-4 md:gap-6 min-w-[1000px] h-full items-start">
              {columns.map((col) => {
                const colTasks = planTasks.filter((t: any) => t.status === col);
                return (
                  <div key={col} className="w-1/4 min-h-[400px] flex flex-col bg-[#F5F7FA] rounded-[20px] border border-[#E5E7EB]/70 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-poppins font-semibold text-[#374151] text-[14px]">{col}</h4>
                      <span className="bg-white border border-[#E5E7EB] text-[#6B7280] text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {colTasks.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3">
                      {colTasks.map((task: any) => {
                        let statusClass = 'bg-[#F3F4F6] text-[#6B7280] border border-[#D1D5DB]';
                        if (task.status === 'Completed')
                          statusClass = 'bg-[#E8FFF2] text-[#16A34A] border border-[#16A34A] border-opacity-20';
                        else if (task.status === 'In Progress')
                          statusClass = 'bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB] border-opacity-20';
                        else if (task.status === 'On Hold')
                          statusClass = 'bg-[#FFF8E6] text-[#F59E0B] border border-[#F59E0B] border-opacity-20';

                        return (
                          <div
                            key={task.id}
                            onClick={() => setActiveTask(task)}
                            className="bg-white p-4 rounded-[16px] border border-[#E5E7EB] shadow-[0_2px_10px_rgba(0,0,0,0.02)] cursor-pointer card-hover flex flex-col gap-3 group"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${getPriorityStyle(task.priority)}`}
                              >
                                {task.priority}
                              </span>
                              <div className="flex items-center gap-1 text-[#9CA3AF] group-hover:text-[#3B82F6] transition-colors">
                                <MessageSquare size={14} /> <span className="text-[11px] font-medium">{task.logs?.length || 0}</span>
                              </div>
                            </div>
                            <h5 className="font-poppins font-medium text-[#13294B] text-[14px] leading-snug">{task.title || ''}</h5>
                            <div className="text-[12px] text-[#6B7280] font-inter truncate">
                              <MapPin size={12} className="inline mr-1" />
                              {task.area || ''}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-[#F3F4F6]">
                              <div className="flex -space-x-2">
                                {task.assignees.map((empId: any, idx: number) => {
                                  const emp = employees.find((e: any) => e.id === empId);
                                  if (!emp) return null;
                                  return (
                                    <div
                                      key={idx}
                                      className="w-7 h-7 rounded-full bg-[#EAF2FF] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#2563EB]"
                                      title={emp.name}
                                    >
                                      {emp.name.substring(0, 2)}
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="text-[10px] text-[#9CA3AF] font-medium">
                                <CalendarIcon size={10} className="inline mr-1" />
                                {task.target_date?.substring(5) || ''}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {colTasks.length === 0 && (
                        <div className="p-4 border-2 border-dashed border-[#E5E7EB] rounded-[16px] text-center text-[#9CA3AF] text-[12px] font-medium">
                          Kosong
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* MODAL INPUT TASK */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Tambah Task / Scope of Work">
        <form onSubmit={handleSaveTask} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">Judul Pekerjaan</label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
                placeholder="Contoh: Inspeksi Pompa Utama"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">Area / Lokasi</label>
              <input
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">Prioritas</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
              >
                <option>Rendah</option>
                <option>Sedang</option>
                <option>Tinggi</option>
              </select>
            </div>

            <div className="md:col-span-2 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[12px] font-semibold text-[#374151]">Deskripsi Detail (SOW)</label>
                <button
                  type="button"
                  onClick={handleGenerateAIDescription}
                  disabled={isGeneratingDesc}
                  className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-[11px] font-semibold rounded-full shadow-sm transition-all disabled:opacity-50"
                >
                  <Sparkles size={12} className={isGeneratingDesc ? 'animate-spin' : ''} />{' '}
                  {isGeneratingDesc ? 'Sedang Merumuskan...' : '✨ Generate AI SOW'}
                </button>
              </div>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full border rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6] ${isGeneratingDesc ? 'bg-gray-100 animate-pulse border-purple-300' : 'border-[#E5E7EB] bg-white'}`}
                rows={5}
              ></textarea>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">Tgl Mulai Eksekusi</label>
              <input
                required
                type="date"
                value={formData.execution_date}
                onChange={(e) => setFormData({ ...formData, execution_date: e.target.value })}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#374151] mb-1">Target Selesai</label>
              <input
                required
                type="date"
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          <div className="bg-[#F9FAFB] p-4 rounded-[16px] border border-[#E5E7EB]">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-poppins font-semibold text-[#13294B] text-[13px]">Assign Personnel</h4>
              <span className="text-[11px] font-bold bg-[#EAF2FF] text-[#2563EB] px-2 py-0.5 rounded-md">
                {formData.assignees.length} Dipilih
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto custom-scrollbar">
              {selectedPlan?.allocated_personnel.map((empId: any) => {
                const emp = employees.find((e: any) => e.id === empId);
                if (!emp) return null;
                const isSelected = formData.assignees.includes(emp.id);
                return (
                  <div
                    key={emp.id}
                    onClick={() => handleToggleAssignee(emp.id)}
                    className={`flex items-center gap-3 p-2 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-[#2563EB] bg-[#F5F9FF]' : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'}`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#D1D5DB]'}`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-[#13294B] truncate">{emp.name || ''}</div>
                    </div>
                  </div>
                );
              })}
            </div>
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
              Simpan Task
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL DETAIL TASK & CHAT/LOGS */}
      <Modal isOpen={!!activeTask} onClose={() => setActiveTask(null)} title={activeTask?.title}>
        {activeTask && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-h-[70vh]">
            {/* INFO PANEL */}
            <div className="lg:col-span-2 space-y-5 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] pb-6 lg:pb-0 lg:pr-6">
              <div>
                <div className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Update Status</div>
                <select
                  value={activeTask.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className={`w-full border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-[13px] font-semibold outline-none focus:ring-2 focus:ring-[#3B82F6]/20 transition-all ${activeTask.status === 'Completed' ? 'bg-[#E8FFF2] text-[#16A34A]' : 'bg-[#F9FAFB] text-[#374151]'}`}
                >
                  {columns.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-[#F5F7FA] p-4 rounded-[16px] space-y-3">
                <div>
                  <div className="text-[10px] font-bold text-[#9CA3AF] uppercase">PIC Task</div>
                  <div className="text-[13px] font-medium text-[#13294B]">{activeTask.pic || ''}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#9CA3AF] uppercase">Area / Lokasi</div>
                  <div className="text-[13px] font-medium text-[#13294B]">{activeTask.area || ''}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#9CA3AF] uppercase">Durasi Eksekusi</div>
                  <div className="text-[13px] font-medium text-[#13294B]">
                    {activeTask.execution_date || ''} - {activeTask.target_date || ''}
                  </div>
                </div>
              </div>
            </div>

            {/* CHAT / LOGS PANEL */}
            <div className="lg:col-span-3 flex flex-col h-[400px] lg:h-[500px]">
              <div className="flex items-center gap-2 mb-4 shrink-0">
                <History size={18} className="text-[#3B82F6]" />
                <h3 className="font-poppins font-semibold text-[#13294B] text-[15px]">Progress Log & Diskusi</h3>
              </div>

              <div className="flex-1 bg-[#F9FAFB] rounded-t-[16px] border border-[#E5E7EB] border-b-0 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                {!activeTask.logs || activeTask.logs.length === 0 ? (
                  <div className="text-[12px] text-[#6B7280] text-center mt-4">Belum ada riwayat tercatat.</div>
                ) : (
                  activeTask.logs.map((log: any, i: number) => {
                    const isSystem = log.user === 'System';
                    const isMe = log.user === currentUser.name;

                    if (isSystem) {
                      return (
                        <div key={i} className="flex justify-center my-2">
                          <div className="bg-[#E5E7EB] text-[#6B7280] px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-1.5">
                            <Flag size={10} /> {log.note || ''}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={i} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div className="text-[10px] text-[#9CA3AF] mb-1 font-medium px-1">
                          {log.user || ''} • {log.date ? log.date.substring(0, 10) : ''}
                        </div>
                        <div
                          className={`p-3 rounded-[14px] text-[13px] leading-relaxed shadow-sm ${isMe ? 'bg-[#0D3B66] text-white rounded-tr-sm' : 'bg-white border border-[#E5E7EB] text-[#374151] rounded-tl-sm'}`}
                        >
                          {log.note || ''}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleAddLog} className="bg-white border border-[#E5E7EB] p-3 rounded-b-[16px] flex items-end gap-2 shrink-0">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Tulis catatan..."
                  className="flex-1 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl px-3 py-2 text-[13px] outline-none focus:bg-white custom-scrollbar"
                  rows={2}
                ></textarea>
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="w-10 h-10 shrink-0 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#9CA3AF] text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Send size={16} className="ml-1" />
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TaskView;
