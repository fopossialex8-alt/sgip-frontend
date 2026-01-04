
import React, { useState, useEffect } from 'react';
import { Heart, Plus, Search, X, Check, Printer } from 'lucide-react';
import { api } from '../services/api';
import { MassIntention, User } from '../types';

const Intentions: React.FC<{ user: User }> = ({ user }) => {
  const [intentions, setIntentions] = useState<MassIntention[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    requesterName: '', content: '', date: '', type: 'ACTION_DE_GRACE', amount: 2000, status: 'PAYE'
  });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setIntentions([...api.getIntentions()]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.addIntention(user, formData as any);
    refresh(); // Sync with source of truth
    setIsModalOpen(false);
    setSuccess(true);
    setFormData({ requesterName: '', content: '', date: '', type: 'ACTION_DE_GRACE', amount: 2000, status: 'PAYE' });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {success && (
        <div className="fixed top-24 right-10 z-[200] bg-emerald-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500">
          <Check className="w-6 h-6" />
          <p className="font-black text-xs uppercase tracking-widest">Intention enregistrée avec succès</p>
        </div>
      )}

      <div className="flex justify-between items-center bg-[#8B0000] p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group no-print">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
          <Heart className="w-64 h-64 fill-current" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter">Intentions de Messe</h2>
          <p className="text-rose-200 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Dépôt des prières officielles</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
            <Printer className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-[#8B0000] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" /> Nouvelle Intention
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Messe du</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Demandeur</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Intention / Prière</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Offrande</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Statut</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 font-medium">
                  {intentions.map(i => (
                    <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-10 py-8 text-sm font-black text-slate-900">{i.date}</td>
                       <td className="px-10 py-8 text-sm font-bold text-indigo-900">{i.requesterName}</td>
                       <td className="px-10 py-8 text-sm text-slate-500 italic max-w-md leading-relaxed truncate group cursor-help relative">
                         "{i.content}"
                       </td>
                       <td className="px-10 py-8 text-sm font-black text-emerald-600 text-right">{i.amount.toLocaleString()} FCFA</td>
                       <td className="px-10 py-8 text-right">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${i.status === 'PAYE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                             {i.status}
                          </span>
                       </td>
                    </tr>
                  ))}
                  {intentions.length === 0 && <tr><td colSpan={5} className="py-24 text-center text-slate-300 font-black uppercase text-xs tracking-widest">Aucune intention archivée</td></tr>}
               </tbody>
            </table>
         </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nouvelle Intention</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white rounded-2xl hover:text-rose-600 shadow-sm transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du Demandeur</label>
                <input required value={formData.requesterName} onChange={e => setFormData({...formData, requesterName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-rose-800 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de Messe</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Offrande (FCFA)</label>
                  <input required type="number" min="500" value={formData.amount} onChange={e => setFormData({...formData, amount: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-lg outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contenu / Message de l'Intention</label>
                <textarea required rows={5} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium outline-none focus:border-rose-800 transition-colors leading-relaxed" placeholder="Ex: Action de grâce pour ma réussite aux examens et protection de la famille..."></textarea>
              </div>
              <button type="submit" className="w-full py-6 bg-[#8B0000] text-white font-black rounded-3xl uppercase tracking-widest text-xs shadow-xl shadow-red-900/10 hover:bg-red-900 transition-all mt-4">Encaisser & Archiver</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Intentions;
