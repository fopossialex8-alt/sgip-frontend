
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Wallet, Calendar, 
  LogOut, ShieldCheck, Church, HardHat,
  UserCog, Mail, Menu, X, ChevronRight, Heart
} from 'lucide-react';
import { UserRole, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  user: User;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.CURE, UserRole.VICAIRE, UserRole.SECRETAIRE, UserRole.COMPTABLE, UserRole.PRESIDENT_CONSEIL, UserRole.FIDEL] },
    { id: 'parishioners', label: 'Fidèles & CEV', icon: Users, roles: [UserRole.ADMIN, UserRole.CURE, UserRole.VICAIRE, UserRole.SECRETAIRE] },
    { id: 'sacraments', label: 'Registre Sacrements', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.CURE, UserRole.VICAIRE, UserRole.SECRETAIRE] },
    { id: 'intentions', label: 'Intentions de Messe', icon: Heart, roles: [UserRole.ADMIN, UserRole.CURE, UserRole.VICAIRE, UserRole.SECRETAIRE] },
    { id: 'projects', label: 'Projets & Chantiers', icon: HardHat, roles: [UserRole.ADMIN, UserRole.CURE, UserRole.PRESIDENT_CONSEIL, UserRole.COMPTABLE] },
    { id: 'finance', label: 'Comptabilité', icon: Wallet, roles: [UserRole.ADMIN, UserRole.CURE, UserRole.COMPTABLE] },
    { id: 'communication', label: 'Communication', icon: Mail, roles: [UserRole.ADMIN, UserRole.CURE, UserRole.SECRETAIRE] },
    { id: 'events', label: 'Calendrier Liturgique', icon: Calendar, roles: [UserRole.ADMIN, UserRole.CURE, UserRole.VICAIRE, UserRole.SECRETAIRE, UserRole.PRESIDENT_CONSEIL] },
    { id: 'admin_users', label: 'Gestion des Accès', icon: UserCog, roles: [UserRole.ADMIN, UserRole.CURE] },
    { id: 'audit', label: 'Audit Système', icon: ShieldCheck, roles: [UserRole.ADMIN, UserRole.CURE] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user.role === UserRole.ADMIN || user.role === UserRole.CURE || item.roles.includes(user.role)
  );

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden font-sans">
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[100] w-14 h-14 bg-amber-500 text-[#001A4D] rounded-full shadow-2xl flex items-center justify-center"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#001A4D] text-white transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 shadow-2xl flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-white/5 flex items-center gap-4">
          <div className="bg-amber-500 p-2.5 rounded-xl rotate-3 shadow-lg">
            <Church className="w-6 h-6 text-[#001A4D]" />
          </div>
          <h1 className="text-xl font-black tracking-tighter">SGIP <span className="text-amber-500">v5</span></h1>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-200 font-bold text-sm ${
                activeTab === item.id 
                  ? 'bg-amber-500 text-[#001A4D] shadow-lg shadow-amber-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        <div className="p-6 bg-[#00143a]">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
              {user.fullName.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-black truncate">{user.fullName}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 text-rose-400 hover:text-rose-300 font-black text-[10px] uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA]">
        <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40">
          <h2 className="text-sm lg:text-base font-black text-slate-900 uppercase tracking-widest">
            {menuItems.find(m => m.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
             <div className="hidden sm:block text-right">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
               <p className="text-xs font-bold text-slate-900">{user.parishName}</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
