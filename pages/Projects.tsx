
import React, { useState, useEffect } from 'react';
import { HardHat, Plus, Target, TrendingUp, X, Check, Wallet, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { User, ParishProject } from '../types';

const Projects: React.FC<{ creator: User }> = ({ creator }) => {
  const [projects, setProjects] = useState<ParishProject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', targetAmount: 1000000, startDate: new Date().toISOString().split('T')[0], status: 'EN_COURS' as any
  });

  useEffect(() => {
    setProjects(api.getProjects());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    api.addProject(creator, formData);
    setProjects([...api.getProjects()]);
    setIsModalOpen(false);
    setFormData({ title: '', description: '', targetAmount: 1000000, startDate: new Date().toISOString().split('T')[0], status: 'EN_COURS' });
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center bg-[#001A4D] p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
          <HardHat className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tighter">Bâtissons notre Paroisse</h2>
          <p className="text-amber-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Suivi des Chantiers & Investissements</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 text-[#001A4D] px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-transform relative z-10"
        >
          <Plus className="w-5 h-5" /> Nouveau Chantier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map(project => {
          const progress = Math.min((project.currentAmount / project.targetAmount) * 100, 100);
          return (
            <div key={project.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${project.status === 'EN_COURS' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {project.status}
                  </span>
                  <p className="text-[10px] font-black text-slate-300 uppercase">Début: {project.startDate}</p>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4">{project.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">{project.description}</p>
                
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression des fonds</p>
                    <p className="text-xl font-black text-indigo-900">{Math.round(progress)}%</p>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{width: `${progress}%`}}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Déjà collecté</p>
                  <p className="text-lg font-black text-emerald-600">{project.currentAmount.toLocaleString()} <span className="text-[10px]">FCFA</span></p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Objectif Final</p>
                  <p className="text-lg font-black text-slate-900">{project.targetAmount.toLocaleString()} <span className="text-[10px]">FCFA</span></p>
                </div>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className="md:col-span-2 py-32 text-center bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100">
            <HardHat className="w-16 h-16 text-slate-100 mx-auto mb-6" />
            <p className="text-slate-300 font-black uppercase text-xs tracking-widest">Aucun projet en cours</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3.5rem] w-full max-w-xl relative z-10 shadow-2xl p-12 border border-slate-200">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lancer un Chantier</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-2xl hover:text-rose-600 shadow-sm transition-all"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du Projet</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Construction du nouveau Presbytère" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:border-amber-500" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget prévisionnel (FCFA)</label>
                <input required type="number" value={formData.targetAmount} onChange={e => setFormData({...formData, targetAmount: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl font-black text-xl outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description & Enjeux</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-3xl font-medium outline-none" placeholder="Décrivez l'importance de ce projet pour la communauté..."></textarea>
              </div>
              <button type="submit" className="w-full py-6 bg-[#001A4D] text-amber-500 font-black rounded-3xl shadow-xl uppercase tracking-widest text-xs hover:bg-slate-800 transition-all mt-4">
                Ouvrir le registre de collecte
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
