
import React, { useState, useEffect } from 'react';
import { UserCog, Plus, Mail, Shield, UserPlus, X, Trash2, Key, Check } from 'lucide-react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

const AdminUsers: React.FC<{ creator: User }> = ({ creator }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '', fullName: '', email: '', role: UserRole.SECRETAIRE, password: ''
  });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setUsers([...api.getUsers()]);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    api.addUser(creator, {
      ...formData,
      id: '',
      isActive: true,
      parishName: api.getSettings()?.name || 'Ma Paroisse'
    });
    refresh();
    setIsModalOpen(false);
    setFormData({ username: '', fullName: '', email: '', role: UserRole.SECRETAIRE, password: '' });
  };

  const handleDelete = (id: string) => {
    api.deleteUser(creator, id);
    setUsers(users.filter(u => u.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-[#001A4D] p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Shield className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter">Gestion du Personnel</h2>
          <p className="text-amber-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Habilitations & Accès Systèmes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 text-[#001A4D] px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-transform relative z-10"
        >
          <UserPlus className="w-5 h-5" /> Ajouter un compte
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(u => (
          <div key={u.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden">
            {confirmDelete === u.id && (
              <div className="absolute inset-0 z-50 bg-rose-600/95 flex flex-col items-center justify-center p-8 text-center text-white animate-in zoom-in duration-300">
                <Trash2 className="w-12 h-12 mb-4" />
                <h4 className="text-lg font-black uppercase mb-2">Révoquer l'accès ?</h4>
                <p className="text-xs font-bold opacity-80 mb-6">Cette action est irréversible pour {u.fullName}.</p>
                <div className="flex gap-4">
                  <button onClick={() => setConfirmDelete(null)} className="px-6 py-2 bg-white/20 rounded-xl font-black text-[10px] uppercase">Annuler</button>
                  <button onClick={() => handleDelete(u.id)} className="px-6 py-2 bg-white text-rose-600 rounded-xl font-black text-[10px] uppercase">Révoquer</button>
                </div>
              </div>
            )}

            <div className="absolute top-8 right-8">
              <button onClick={() => setConfirmDelete(u.id)} className="p-3 bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
            
            <div className="w-20 h-20 bg-[#F0F2F5] rounded-3xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
              <div className="text-3xl font-black text-indigo-900">{u.fullName.charAt(0)}</div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{u.fullName}</h3>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-6 bg-amber-50 px-4 py-1.5 rounded-full w-fit border border-amber-100">{u.role}</p>
            
            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-4 text-sm text-slate-600 font-bold">
                <div className="p-2 bg-slate-50 rounded-lg"><Mail className="w-4 h-4 text-slate-400" /></div> {u.email}
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600 font-bold">
                <div className="p-2 bg-slate-50 rounded-lg"><Shield className="w-4 h-4 text-slate-400" /></div> @{u.username}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {u.isActive ? 'Compte Actif' : 'Désactivé'}
                </span>
              </div>
              <p className="text-[9px] text-slate-300 font-bold italic tracking-tighter uppercase">Réf: {u.id}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nouvel Utilisateur Staff</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white rounded-2xl hover:text-rose-600 shadow-sm transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-10 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identité Complète</label>
                <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500 transition-colors" placeholder="Ex: Abbé Joseph Atangana" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identifiant Bureau</label>
                  <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" placeholder="j.atangana" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe initial</label>
                  <div className="relative">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" placeholder="••••••••" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Professionnel</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" placeholder="joseph@paroisse.cm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Habilitations (Rôle)</label>
                <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none appearance-none cursor-pointer">
                  {Object.values(UserRole).filter(r => r !== UserRole.FIDEL).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-6 bg-[#001A4D] text-amber-500 font-black rounded-3xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs shadow-xl shadow-blue-900/10 mt-4">Activer l'Accès</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
