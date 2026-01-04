
import React, { useState, useEffect } from 'react';
import { Book, Search, Plus, FileText, CheckCircle2, Award, X, ShieldCheck, Printer, QrCode } from 'lucide-react';
import { User, SacramentRecord, SacramentType, Parishioner } from '../types';
import { api } from '../services/api';

const Sacraments: React.FC<{ creator: User }> = ({ creator }) => {
  const [activeTab, setActiveTab] = useState<SacramentType>(SacramentType.BAPTEME);
  const [records, setRecords] = useState<SacramentRecord[]>([]);
  const [parishioners, setParishioners] = useState<Parishioner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    parishionerId: '', date: '', minister: '', godFather: '', godMother: '', 
    registerVolume: '', registerPage: '', registerNumber: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    // On récupère uniquement la source de vérité
    setRecords([...api.getSacrements()]);
    setParishioners(api.getParishioners());
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parishioner = parishioners.find(p => p.id === formData.parishionerId);
    if (!parishioner) return;

    api.addSacrement(creator, {
      ...formData,
      type: activeTab,
      parishionerName: `${parishioner.lastName} ${parishioner.firstName}`
    });
    
    // Après l'ajout, on vide le formulaire et on rafraîchit la liste proprement
    setIsModalOpen(false);
    setFormData({ 
      parishionerId: '', date: '', minister: '', godFather: '', godMother: '', 
      registerVolume: '', registerPage: '', registerNumber: '' 
    });
    refreshData(); 
  };

  const filteredRecords = records.filter(r => 
    r.type === activeTab && 
    r.parishionerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide no-print">
        {Object.values(SacramentType).map(type => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 ${
              activeTab === type 
                ? 'bg-[#001A4D] text-amber-500 shadow-2xl scale-105' 
                : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-12 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-50/50">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter flex items-center gap-4">
               {activeTab} <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-3">Registres canoniques certifiés par la Chancellerie</p>
          </div>
          <div className="flex gap-4 no-print">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Rechercher un acte..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-xs"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#001A4D] text-amber-500 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nouvel Acte
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-50">
                <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Référence Registre</th>
                <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom du Sujet</th>
                <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Célébration</th>
                <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Authentification</th>
                <th className="px-12 py-6 no-print"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRecords.map(record => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-all">
                  <td className="px-12 py-8">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900">Vol. {record.registerVolume}</p>
                      <p className="text-[10px] text-amber-600 font-bold uppercase">Page {record.registerPage} • N° {record.registerNumber}</p>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <p className="font-black text-slate-900 text-lg tracking-tighter">{record.parishionerName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Matricule: {record.parishionerId}</p>
                  </td>
                  <td className="px-12 py-8">
                    <p className="text-sm font-black text-slate-700">{record.date}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{record.minister}</p>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-3">
                       <QrCode className="w-6 h-6 text-slate-300" />
                       <div>
                         <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Acté & Certifié</p>
                         <p className="text-[10px] font-mono text-slate-400 font-bold">{record.verificationKey}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-right no-print">
                    <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm">
                      <Printer className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <p className="text-slate-300 font-black uppercase text-xs tracking-[0.2em]">Aucun enregistrement trouvé</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl relative z-10 shadow-2xl p-12 border border-slate-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nouvel Acte de {activeTab}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-4 bg-slate-50 rounded-2xl hover:text-rose-600 shadow-sm transition-all"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-8">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fidèle concerné</label>
                <select required value={formData.parishionerId} onChange={e => setFormData({...formData, parishionerId: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-black outline-none focus:border-amber-500">
                  <option value="">Sélectionner dans le registre...</option>
                  {parishioners.map(p => <option key={p.id} value={p.id}>{p.lastName} {p.firstName} ({p.id})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Volume Archivage</label>
                <input required value={formData.registerVolume} onChange={e => setFormData({...formData, registerVolume: e.target.value})} placeholder="Ex: 2025/B" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numéro d'Acte</label>
                <input required value={formData.registerNumber} onChange={e => setFormData({...formData, registerNumber: e.target.value})} placeholder="Ex: 042" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de la Célébration</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ministre Célébrant</label>
                <input required value={formData.minister} onChange={e => setFormData({...formData, minister: e.target.value})} placeholder="Abbé Paulin..." className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Parrain / Témoin A</label>
                <input value={formData.godFather} onChange={e => setFormData({...formData, godFather: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marraine / Témoin B</label>
                <input value={formData.godMother} onChange={e => setFormData({...formData, godMother: e.target.value})} className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none" />
              </div>
              <button type="submit" className="col-span-2 py-6 bg-[#001A4D] text-amber-500 font-black rounded-3xl shadow-xl uppercase tracking-widest text-xs hover:bg-slate-800 transition-all mt-4">
                Enregistrer au Registre Officiel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sacraments;
