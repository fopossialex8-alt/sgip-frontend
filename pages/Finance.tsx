
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X,
  Printer,
  ChevronRight
} from 'lucide-react';
import { User, TransactionCategory, TransactionType, FinanceTransaction, CEV } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS } from '../constants';
import { api } from '../services/api';

const Finance: React.FC<{ creator: User }> = ({ creator }) => {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [cevs, setCevs] = useState<CEV[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: TransactionType.ENTREE,
    category: TransactionCategory.QUETE,
    amount: 0,
    description: '',
    cevReference: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setTransactions([...api.getTransactions()]);
    setCevs(api.getCEVs());
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) return;
    
    api.addTransaction(creator, {
      ...formData,
      recordedBy: creator.fullName
    });
    
    // Always sync with source of truth to avoid duplicates in local state
    refreshData();
    setIsModalOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: TransactionType.ENTREE,
      category: TransactionCategory.QUETE,
      amount: 0,
      description: '',
      cevReference: ''
    });
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEntrees = transactions.filter(t => t.type === TransactionType.ENTREE).reduce((acc, curr) => acc + curr.amount, 0);
  const totalSorties = transactions.filter(t => t.type === TransactionType.SORTIE).reduce((acc, curr) => acc + curr.amount, 0);
  const solde = totalEntrees - totalSorties;

  const pieData = Object.values(TransactionCategory).map(cat => ({
    name: cat,
    value: transactions.filter(t => t.category === cat).reduce((acc, curr) => acc + curr.amount, 0)
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-10">
      <div className="print-header">
        <h1 className="text-2xl font-black uppercase tracking-widest">{api.getSettings()?.name}</h1>
        <p className="text-sm font-bold">Rapport Financier - {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingUp className="w-3 h-3 text-emerald-500" /> Recettes</p>
          <p className="text-4xl font-black text-emerald-600 tracking-tighter">{totalEntrees.toLocaleString()} <span className="text-xs">FCFA</span></p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingDown className="w-3 h-3 text-rose-500" /> Dépenses</p>
          <p className="text-4xl font-black text-rose-600 tracking-tighter">{totalSorties.toLocaleString()} <span className="text-xs">FCFA</span></p>
        </div>
        <div className="bg-[#001A4D] p-10 rounded-[3rem] shadow-2xl">
          <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest mb-2">Solde de Caisse</p>
          <p className="text-4xl font-black text-white tracking-tighter">{solde.toLocaleString()} <span className="text-xs">FCFA</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between no-print">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registre Analytique</h3>
            <div className="flex gap-4">
               <input 
                  type="text" 
                  placeholder="Rechercher une opération..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-6 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none shadow-sm focus:border-amber-500 transition-colors" 
                />
               <button onClick={() => setIsModalOpen(true)} className="bg-amber-500 text-[#001A4D] px-6 py-3 rounded-2xl shadow-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"><Plus className="w-4 h-4" /> Enregistrer</button>
            </div>
          </div>
          
          <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Catégorie</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Libellé de l'Opération</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-slate-900">{t.date}</p>
                      <p className="text-[9px] font-black text-amber-600 uppercase mt-1 tracking-widest">{t.category}</p>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm text-slate-700 font-semibold">{t.description}</p>
                      {t.cevReference && <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1 mt-1">Provenance: <ChevronRight className="w-2 h-2" /> {cevs.find(c => c.id === t.cevReference)?.name}</span>}
                    </td>
                    <td className={`px-8 py-6 text-lg font-black text-right tracking-tighter ${t.type === TransactionType.ENTREE ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === TransactionType.ENTREE ? '+' : '-'}{t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && <tr><td colSpan={3} className="py-24 text-center text-slate-300 font-black uppercase text-xs tracking-[0.2em]">Aucune transaction enregistrée</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8 no-print">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-900 text-xl mb-8">Ventilation des Fonds</h3>
            <div className="h-[300px] w-full min-h-[300px] flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as string] || '#94a3b8'} stroke="none" />)}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold'}} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Données insuffisantes</p>
              )}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-2">
               {pieData.map(d => (
                 <div key={d.name} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{backgroundColor: CATEGORY_COLORS[d.name]}}></div>
                   <span className="text-[9px] font-bold text-slate-500 uppercase truncate">{d.name}</span>
                 </div>
               ))}
            </div>
          </div>

          <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-4 py-6 bg-[#001A4D] text-amber-500 font-black rounded-3xl shadow-xl uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-colors">
            <Printer className="w-5 h-5" /> Générer Rapport Comptable
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-xl relative z-10 shadow-2xl border border-slate-200 p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900">Nouvelle Saisie</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 rounded-2xl hover:text-rose-600 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-6">
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button type="button" onClick={() => setFormData({...formData, type: TransactionType.ENTREE})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.type === TransactionType.ENTREE ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>Recette (Entrée)</button>
                <button type="button" onClick={() => setFormData({...formData, type: TransactionType.SORTIE})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.type === TransactionType.SORTIE ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}>Dépense (Sortie)</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Catégorie</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as TransactionCategory})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none">
                    {Object.values(TransactionCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Provenance CEV</label>
                  <select value={formData.cevReference} onChange={e => setFormData({...formData, cevReference: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none">
                    <option value="">Caisse Paroissiale</option>
                    {cevs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Montant (FCFA)</label>
                  <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: parseInt(e.target.value) || 0})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-lg text-indigo-900 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description / Libellé</label>
                <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Achat fournitures bureau secrétariat" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
              </div>
              <button type="submit" className="w-full py-5 bg-[#001A4D] text-amber-500 font-black rounded-3xl hover:bg-slate-800 transition-all shadow-xl uppercase tracking-widest text-xs">Finaliser l'enregistrement</button>
            </form>
          </div>
        </div>
      )}
      <div className="print-footer">Système SGIP - Certifié Conforme pour Administration Paroissiale</div>
    </div>
  );
};

export default Finance;
