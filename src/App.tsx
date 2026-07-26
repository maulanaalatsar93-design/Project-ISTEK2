import React, { useState } from 'react';
import {
  Bell, Briefcase, Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight, Database,
  Kanban, LayoutDashboard, Menu, UserSearch, Users, X,
} from 'lucide-react';
import GlobalStyles from './styles/GlobalStyles';
import Modal from './components/Modal';
import SAPDataView from './pages/SAPData/SAPDataView';
import ManPowerView from './pages/ManPower/ManPowerView';
import TaskView from './pages/Tasks/TaskView';
import DashboardView from './pages/Dashboard/DashboardView';
import PerencanaanView from './pages/Perencanaan/PerencanaanView';
import {
  INITIAL_USERS, INITIAL_EMPLOYEES, INITIAL_ATTENDANCE_CHANGES, INITIAL_PLANS,
  INITIAL_TASKS, INITIAL_WO_DATA, INITIAL_NOTIF_DATA,
} from './data/mockData';
import { getRoleVisuals } from './utils/helpers';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [employees] = useState(INITIAL_EMPLOYEES);
  const [attendanceChanges, setAttendanceChanges] = useState(INITIAL_ATTENDANCE_CHANGES);
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const [sapWOData, setSapWOData] = useState(INITIAL_WO_DATA);
  const [sapNotifData, setSapNotifData] = useState(INITIAL_NOTIF_DATA);
  const [sapUploadLogs, setSapUploadLogs] = useState<any[]>([]);

  const [notifications, setNotifications] = useState<any[]>([]);

  const getVisibleEmployees = () => {
    if (['Administrator', 'Manager'].includes(currentUser.role)) return employees;
    if (currentUser.role === 'Supervisor') {
      const myDiv = currentUser.position.includes('PPHS & OSBL')
        ? 'PPHS & OSBL'
        : currentUser.position.includes('Rotating 1')
          ? 'Rotating 1'
          : 'Rotating 2';
      return employees.filter((e) => e.division === myDiv);
    }
    return employees;
  };

  const visibleEmployees = getVisibleEmployees();
  const unreadNotifs = notifications.filter((n) => n.user_id === currentUser.emp_id && !n.read);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'manpower', label: 'Man Power Control', icon: Users },
    { id: 'perencanaan', label: 'Perencanaan Personel', icon: Briefcase },
    { id: 'tasks', label: 'Manajemen Task', icon: Kanban },
    { id: 'sap_data', label: 'Data & Realisasi SAP', icon: Database },
    { id: 'rekap', label: 'Data Profil Personel', icon: UserSearch },
  ];

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-inter text-[#6B7280] overflow-hidden">
      <GlobalStyles />

      {/* SIDEBAR */}
      <aside
        className={`bg-gradient-to-b from-[#13294B] to-[#0D3B66] text-white flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.05)] z-40 absolute lg:relative h-full transition-all duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isCollapsed ? 'w-[260px] md:w-[280px] lg:w-[88px]' : 'w-[260px] md:w-[280px]'}`}
      >
        <div
          className={`h-[80px] md:h-[100px] flex items-center relative border-b border-white/10 shrink-0 transition-all duration-300 ${isCollapsed ? 'lg:px-0 lg:justify-center px-6 md:px-8' : 'px-6 md:px-8'}`}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-[12px] md:rounded-2xl flex items-center justify-center text-[#13294B] font-poppins font-bold text-lg md:text-xl shadow-lg shrink-0">
            MP
          </div>
          <div
            className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:ml-0' : 'max-w-[200px] opacity-100 ml-3 md:ml-4'}`}
          >
            <div className="font-poppins font-bold text-[16px] md:text-[18px] tracking-wide leading-tight">System</div>
            <div className="text-[10px] md:text-[12px] text-white/60 font-medium tracking-widest uppercase">Enterprise</div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-6 space-y-1 md:space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar px-4">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            const MenuIcon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center py-3 md:py-4 rounded-[12px] md:rounded-[16px] font-poppins font-medium text-[14px] md:text-[15px] transition-all duration-300 relative group ${isCollapsed ? 'lg:px-0 lg:justify-center px-4 md:px-5' : 'px-4 md:px-5'} ${isActive ? 'bg-white/10 text-white shadow-inner' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                {isActive && <div className="absolute left-0 w-1.5 h-6 md:h-8 bg-[#FF8C00] rounded-r-full shadow-[0_0_10px_#FF8C00]"></div>}
                <MenuIcon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="md:w-5 md:h-5 shrink-0 transition-transform duration-300 group-hover:scale-110"
                />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:ml-0' : 'max-w-[200px] opacity-100 ml-3 md:ml-4'}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div
          className={`mt-auto p-4 md:p-6 border-t border-white/10 transition-all duration-300 flex items-center ${isCollapsed ? 'lg:justify-center' : 'justify-between'}`}
        >
          <div
            className={`text-[11px] md:text-[12px] text-white/40 font-poppins whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'lg:max-w-0 lg:opacity-0' : 'max-w-[200px] opacity-100'}`}
          >
            v4.1 SAP Integrasi
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg bg-white/5 hover:bg-white/20 text-white/60 hover:text-white transition-colors"
            title="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-[#13294B]/50 backdrop-blur-sm z-30 lg:hidden animate-in fade-in"
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative w-full min-w-0 transition-all duration-300">
        {/* TOP NAVIGATION */}
        <header className="h-[70px] md:h-[80px] bg-white border-b border-[#E5E7EB]/60 flex items-center justify-between px-4 md:px-10 shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)] z-10 w-full relative">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#F5F7FA] text-[#13294B] hover:bg-[#E5E7EB] transition-colors"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 rounded-lg bg-[#F5F7FA] text-[#13294B] hover:bg-[#E5E7EB] transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="font-poppins font-semibold text-[16px] md:text-[18px] text-[#13294B] hidden sm:block truncate max-w-[200px] md:max-w-none">
              {menuItems.find((m) => m.id === activeMenu)?.label || 'Dashboard'}
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="bg-[#F5F7FA] px-3 md:px-4 py-2 md:py-2.5 rounded-full border border-[#E5E7EB] flex items-center gap-2 md:gap-3 hover:shadow-sm transition-shadow">
              <CalendarIcon size={14} className="text-[#6B7280] hidden md:block" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-transparent text-[12px] md:text-[14px] font-inter font-medium text-[#374151] outline-none cursor-pointer w-[110px] md:w-auto"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#F5F7FA] flex items-center justify-center text-[#374151] hover:bg-[#E5E7EB] transition-colors relative"
              >
                <Bell size={18} className="md:w-5 md:h-5" />
                {unreadNotifs.length > 0 && (
                  <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 md:w-2.5 md:h-2.5 bg-[#EF4444] rounded-full border-2 border-white notif-pulse"></div>
                )}
              </button>
            </div>

            <div
              className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-[#E5E7EB] cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsLoginModalOpen(true)}
            >
              <div className="text-right hidden lg:block">
                <div className="font-poppins font-medium text-[13px] md:text-[14px] text-[#13294B]">{currentUser.name}</div>
                <div className="text-[11px] md:text-[12px] text-[#6B7280] truncate max-w-[120px]">{currentUser.position}</div>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#0D3B66] text-white flex items-center justify-center font-bold font-poppins text-[13px] md:text-[14px] shadow-md shrink-0">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE VIEW / ROUTING SIMULATION */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar w-full relative">
          {activeMenu === 'dashboard' && (
            <DashboardView
              employees={visibleEmployees}
              attendanceChanges={attendanceChanges}
              filterDate={filterDate}
              tasks={tasks}
              sapWOData={sapWOData}
              sapNotifData={sapNotifData}
            />
          )}
          {activeMenu === 'manpower' && (
            <ManPowerView attendanceChanges={attendanceChanges} employees={visibleEmployees} setAttendanceChanges={setAttendanceChanges} />
          )}
          {activeMenu === 'perencanaan' && (
            <PerencanaanView plans={plans} setPlans={setPlans} employees={visibleEmployees} currentUser={currentUser} />
          )}
          {activeMenu === 'tasks' && (
            <TaskView
              plans={plans}
              tasks={tasks}
              setTasks={setTasks}
              employees={visibleEmployees}
              currentUser={currentUser}
              setNotifications={setNotifications}
            />
          )}
          {activeMenu === 'sap_data' && (
            <SAPDataView
              sapWOData={sapWOData}
              setSapWOData={setSapWOData}
              sapNotifData={sapNotifData}
              setSapNotifData={setSapNotifData}
              sapUploadLogs={sapUploadLogs}
              setSapUploadLogs={setSapUploadLogs}
            />
          )}

          {['rekap'].includes(activeMenu) && (
            <div className="flex flex-col items-center justify-center h-full text-[#6B7280] opacity-50 space-y-4">
              <Briefcase size={48} strokeWidth={1} />
              <p className="font-inter text-center max-w-md">
                Modul <strong>{menuItems.find((m) => m.id === activeMenu)?.label}</strong> sedang dalam antrean pengembangan untuk rilis
                mendatang.
              </p>
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Simulasi Hak Akses (RBAC)">
        <div className="space-y-4">
          <p className="text-[13px] md:text-[14px] text-[#6B7280] mb-2 md:mb-4">
            Pilih peran untuk menguji wewenang Approval dan Task Assignment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pb-2">
            {INITIAL_USERS.map((user) => {
              const roleVisual = getRoleVisuals(user.position, 'Organik');
              const RoleIco = roleVisual.icon;
              return (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setIsLoginModalOpen(false);
                  }}
                  className={`p-4 md:p-5 rounded-[16px] md:rounded-[18px] border text-left flex flex-col justify-between transition-all ${currentUser.id === user.id ? 'border-[#0D3B66] bg-[#F5F9FF] shadow-sm' : 'border-[#E5E7EB] hover:border-[#3B82F6] bg-white'}`}
                >
                  <div className="flex items-center gap-3 mb-3 md:mb-4">
                    <div
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${roleVisual.bg} ${roleVisual.color}`}
                    >
                      <RoleIco size={16} strokeWidth={2.5} className="md:w-[18px] md:h-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-poppins font-semibold text-[#13294B] text-[14px] md:text-[15px] truncate">{user.name}</div>
                      <div className="text-[11px] md:text-[12px] font-medium text-[#6B7280] mt-0.5 truncate">{user.position}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-3">
                    <span
                      className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 md:px-2.5 md:py-1 rounded-full ${user.role === 'Administrator' ? 'bg-[#F3E8FF] text-[#8B5CF6]' : 'bg-[#EAF2FF] text-[#2563EB]'}`}
                    >
                      Akses: {user.role}
                    </span>
                    {currentUser.id === user.id && <Check size={16} className="text-[#0D3B66] md:w-[18px] md:h-[18px]" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
