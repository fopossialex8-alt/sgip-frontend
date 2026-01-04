
import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, X, Check, MoreVertical, MapPin, Phone, MessageCircle, Trash2, Home } from 'lucide-react';
import { api } from '../services/api';
import { User, Parishioner, CEV } from '../types';

const Parishioners: React.FC<{ creator: User }> = ({ creator }) => {
  const [activeSubTab, setActiveSubTab] = useState<'FIDEL' | 'CEV'>('FIDEL');
  const [searchTerm, setSearchTerm] = useState('');
  const [parishioners, setParishioners] = useState<Parishioner[]>([]);
  const [cevs, setCevs] = useState<CEV[]>([]);
  const [isFidelModalOpen, setIsFidelModalOpen] = useState(false);
  const [isCevModalOpen, setIsCevModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Forms
  const [fidelForm, setFidelForm] = useState({
    firstName: '', lastName: '', phone: '', address: '', cevId: '', gender: 'M' as 'M'|'F'
  });

  const [cevForm, setCevForm] = useState({
    name: '', district: '', presidentName: '', presidentPhone: '', presidentEmail: '', meetingDay: 'Dimanche', financialTarget: 50000
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setParishioners([...api.getParishioners()]);
    setCevs([...api.getCEVs()]);
  };

  const handleAddFidel = (e: React.FormEvent) => {
    e.preventDefault();
    const newP = api.addParishioner(creator, {
      ...fidelForm,
      birthDate: '1900-01-01',
      email: '',
      status: 'ACTIF',
      baptized: false,
      confirmed: false,
      married: false
    });
    
    setSuccessMsg(`Fidèle inscrit ! Matricule : ${newP.id}`);
    refreshData();
    setIsFidelModalOpen(false);
    setFidelForm({ firstName: '', lastName: '', phone: '', address: '', cevId: '', gender: 'M' });
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleAddCev = (e: React.FormEvent) => {
    e.preventDefault();
    api.addCEV(creator, { ...cevForm, memberCount: 0 });
    setSuccessMsg(`CEV "${cevForm.name}" créée avec succès !`);
    refreshData();
    setIsCevModalOpen(false);
    setCevForm({ name: '', district: '', presidentName: '', presidentPhone: '', presidentEmail: '', meetingDay: 'Dimanche', financialTarget: 50000 });
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const openWhatsApp = (phone: string, name: string) => {
    // Formatage numéro Cameroun (237)
    let formatted = phone.replace(/\s/g, '');
    if (!formatted.startsWith('237')) formatted = '237' + formatted;
    const text = encodeURIComponent(`Bonjour ${name}, nous vous contactons depuis le secrétariat de la paroisse ${api.getSettings()?.name}.`);
    window.open(`https://wa.me/${formatted}?text=${text}`, '_blank');
  };

  const filteredFidels = parishioners.filter(p => 
    `${p.firstName} ${p.lastName} ${p.id}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {successMsg && (
        <div className="fixed top-24 right-10 z-[200] bg-emerald-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right">
          <Check className="w-6 h-6" />
          <p className="font-black text-xs uppercase tracking-widest">{successMsg}</p>
        </div>
      )}

      {/* Navigation Interne */}
      <div className="flex bg-white p-2 rounded-3xl border border-slate-100 shadow-sm w-fit no-print">
        <button 
          onClick={() => setActiveSubTab('FIDEL')}
          className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeSubTab === 'FIDEL' ? 'bg-[#001A4D] text-amber-500 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Registre des Fidèles</div>
        </button>
        <button 
          onClick={() => setActiveSubTab('CEV')}
          className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeSubTab === 'CEV' ? 'bg-[#001A4D] text-amber-500 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className="flex items-center gap-2"><Home className="w-4 h-4" /> Gestion des CEV</div>
        </button>
      </div>

      {activeSubTab === 'FIDEL' ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Rechercher un fidèle..."
                className="w-full pl-14 pr-8 py-4 bg-white border border-slate-200 rounded-3xl outline-none shadow-sm font-bold text-sm focus:border-amber-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsFidelModalOpen(true)}
              className="bg-[#001A4D] text-amber-500 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" /> Inscrire un Fidèle
            </button>
          </div>

          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fidèle & Matricule</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">CEV & Quartier</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFidels.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-[#001A4D] text-amber-500 flex items-center justify-center font-black">{p.lastName.charAt(0)}</div>
                          <div>
                            <p className="font-black text-slate-900">{p.lastName} {p.firstName}</p>
                            <p className="text-[10px] text-amber-600 font-black uppercase">{p.id}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <p className="text-xs font-black text-slate-700">{cevs.find(c => c.id === p.cevId)?.name || 'Hors CEV'}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.address}</p>
                    </td>
                    <td className="px-10 py-6 text-right space-x-2 no-print">
                       <button 
                         onClick={() => openWhatsApp(p.phone, p.firstName)}
                         className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                         title="Contacter par WhatsApp"
                       >
                         <MessageCircle className="w-5 h-5" />
                       </button>
                       <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><MoreVertical className="w-5 h-5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center no-print">
            <h3 className="text-xl font-black text-slate-900">Communautés Ecclésiales de Base ({cevs.length})</h3>
            <button 
              onClick={() => setIsCevModalOpen(true)}
              className="bg-amber-500 text-[#001A4D] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" /> Créer une CEV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cevs.map(cev => (
              <div key={cev.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all relative group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                    <Home className="w-6 h-6" />
                  </div>
                  <button onClick={() => api.deleteCEV(creator, cev.id)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-300 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-1">{cev.name}</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">Secteur : {cev.district}</p>
                
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Président</span>
                    <span className="text-xs font-bold text-slate-700">{cev.presidentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Réunion</span>
                    <span className="text-xs font-bold text-indigo-600">{cev.meetingDay}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button 
                    onClick={() => openWhatsApp(cev.presidentPhone, cev.presidentName)}
                    className="w-full flex items-center justify-center gap-3 py-3 bg-emerald-50 text-emerald-600 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> Contacter Bureau
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Fidèle */}
      {isFidelModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFidelModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-2xl relative z-10 shadow-2xl p-12 border border-slate-200">
            <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Inscription Fidèle</h2>
            <form onSubmit={handleAddFidel} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input label="Nom" value={fidelForm.lastName} onChange={v => setFidelForm({...fidelForm, lastName: v})} />
                <Input label="Prénoms" value={fidelForm.firstName} onChange={v => setFidelForm({...fidelForm, firstName: v})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Input label="WhatsApp / Téléphone" value={fidelForm.phone} onChange={v => setFidelForm({...fidelForm, phone: v})} />
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Choix de la CEV</label>
                  <select required value={fidelForm.cevId} onChange={e => setFidelForm({...fidelForm, cevId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500">
                    <option value="">-- Sélectionner --</option>
                    {cevs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <Input label="Quartier / Domicile" value={fidelForm.address} onChange={v => setFidelForm({...fidelForm, address: v})} />
              <button type="submit" className="w-full py-6 bg-[#001A4D] text-amber-500 font-black rounded-3xl uppercase tracking-widest text-xs shadow-xl hover:bg-slate-800 transition-all mt-4">Inscrire au registre</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal CEV */}
      {isCevModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsCevModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-2xl relative z-10 shadow-2xl p-12 border border-slate-200">
            <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Nouvelle CEV</h2>
            <form onSubmit={handleAddCev} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input label="Nom de la Communauté" value={cevForm.name} onChange={v => setCevForm({...cevForm, name: v})} />
                <Input label="Quartier / Secteur" value={cevForm.district} onChange={v => setCevForm({...cevForm, district: v})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Input label="Nom du Président" value={cevForm.presidentName} onChange={v => setCevForm({...cevForm, presidentName: v})} />
                <Input label="Téléphone WhatsApp Bureau" value={cevForm.presidentPhone} onChange={v => setCevForm({...cevForm, presidentPhone: v})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jour de réunion</label>
                  <select value={cevForm.meetingDay} onChange={e => setCevForm({...cevForm, meetingDay: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold">
                    {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <Input label="Objectif financier (Denier)" value={cevForm.financialTarget.toString()} onChange={v => setCevForm({...cevForm, financialTarget: parseInt(v)})} />
              </div>
              <button type="submit" className="w-full py-6 bg-amber-500 text-[#001A4D] font-black rounded-3xl uppercase tracking-widest text-xs shadow-xl hover:bg-amber-400 transition-all mt-4">Créer la Communauté</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input required value={value} onChange={e => onChange(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500 transition-colors shadow-sm" />
  </div>
);

export default Parishioners;
