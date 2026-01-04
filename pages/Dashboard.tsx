
import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Church, Wallet, 
  Calendar, Heart, Sparkles, BrainCircuit,
  Plus, MessageSquare, Download, Loader2, BookOpen, CheckCircle, Printer
} from 'lucide-react';
import { api } from '../services/api';
import { getPastoralInsights } from '../services/geminiService';
import { User, UserRole, TransactionType, MassIntention, SacramentRecord } from '../types';

interface DashboardProps {
  user: User;
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setActiveTab }) => {
  const [stats, setStats] = useState({ parishioners: 0, intentions: 0, balance: 0, cevs: 0 });
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [recentIntentions, setRecentIntentions] = useState<MassIntention[]>([]);
  const [mySacrements, setMySacrements] = useState<SacramentRecord[]>([]);

  const isFidel = user.role === UserRole.FIDEL;
  const settings = api.getSettings();

  useEffect(() => {
    const p = api.getParishioners();
    const f = api.getTransactions();
    const i = api.getIntentions();
    const c = api.getCEVs();
    const s = api.getSacrements();

    if (isFidel) {
      const filteredIntentions = i.filter(item => 
        item.requesterName.toLowerCase().includes(user.fullName.toLowerCase()) || 
        item.id.includes(user.id)
      );
      const filteredSacrements = s.filter(item => item.parishionerId === user.id);
      
      setRecentIntentions(filteredIntentions.slice(0, 5));
      setMySacrements(filteredSacrements);
      setStats({ parishioners: 0, intentions: filteredIntentions.length, balance: 0, cevs: 0 });
    } else {
      const balance = f.reduce((acc, curr) => acc + (curr.type === TransactionType.ENTREE ? curr.amount : -curr.amount), 0);
      setStats({ parishioners: p.length, intentions: i.length, balance: balance, cevs: c.length });
      setRecentIntentions(i.slice(0, 3));
    }
  }, [user, isFidel]);

  const handlePrint = () => {
    window.print();
  };

  const fetchInsights = async () => {
    setLoadingInsights(true);
    const data = { fideles: stats.parishioners, finances: stats.balance, intentions: stats.intentions, cevs: stats.cevs, context: "Cameroun" };
    const res = await getPastoralInsights(data);
    setInsights(res);
    setLoadingInsights(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700">
      {/* En-tête d'impression invisible à l'écran */}
      <div className="print-header">
        <h1 className="text-2xl font-black uppercase tracking-widest">{settings?.name || "Paroisse Catholique"}</h1>
        <p className="text-sm font-bold">{settings?.diocese || "Archidiocèse de Yaoundé"}</p>
        <p className="text-[10px] uppercase font-medium mt-1">Date du rapport : {new Date().toLocaleDateString()}</p>
        <div className="mt-4 border-t border-slate-900 pt-2">
           <h2 className="text-lg font-black uppercase">Rapport de Situation Paroissiale</h2>
        </div>
      </div>

      {/* Zone Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        {!isFidel && <StatCard icon={Users} label="Fidèles Actifs" value={stats.parishioners} color="blue" />}
        {!isFidel && <StatCard icon={TrendingUp} label="Trésorerie" value={`${stats.balance.toLocaleString()} FCFA`} color="emerald" />}
        <StatCard icon={Heart} label={isFidel ? "Mes Intentions" : "Intentions Total"} value={stats.intentions} color="rose" />
        {isFidel ? (
          <StatCard icon={BookOpen} label="Mes Sacrements" value={mySacrements.length} color="amber" />
        ) : (
          <StatCard icon={Church} label="CEV Actives" value={stats.cevs} color="amber" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {!isFidel ? (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group print:hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><BrainCircuit className="w-32 h-32 text-indigo-600" /></div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><Sparkles className="w-6 h-6 text-indigo-500" /> Intelligence Pastorale</h3>
                </div>
                <button 
                  onClick={fetchInsights}
                  disabled={loadingInsights}
                  className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                >
                  {loadingInsights ? <Loader2 className="w-4 h-4 animate-spin" /> : "Générer Rapport IA"}
                </button>
              </div>
              <div className="prose prose-slate max-w-none">
                {insights ? (
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{insights}</div>
                ) : (
                  <div className="py-12 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest border-2 border-dashed border-slate-100 rounded-3xl">
                    Prêt pour analyse stratégique
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><BookOpen className="text-amber-500" /> Registre Sacrementel Personnel</h3>
                 <button onClick={handlePrint} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors no-print"><Printer className="w-5 h-5" /></button>
               </div>
               <div className="space-y-4">
                 {mySacrements.map(s => (
                   <div key={s.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center hover:bg-white transition-all group">
                     <div>
                       <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{s.type}</p>
                       <p className="text-[11px] text-slate-500 font-medium mt-1">Célébré le {s.date} par {s.minister}</p>
                     </div>
                     <CheckCircle className="text-emerald-500 w-6 h-6" />
                   </div>
                 ))}
                 {mySacrements.length === 0 && (
                   <div className="text-center py-12 text-slate-400 text-xs font-bold uppercase tracking-widest">Aucun sacrement archivé</div>
                 )}
               </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900">Journal des Intentions</h3>
              <button onClick={() => setActiveTab('intentions')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline no-print">Voir le registre</button>
            </div>
            <div className="space-y-3">
              {recentIntentions.map(intent => (
                <div key={intent.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center"><Heart className="w-5 h-5 fill-current" /></div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{intent.requesterName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Messe du {intent.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{intent.amount.toLocaleString()} FCFA</p>
                  </div>
                </div>
              ))}
              {recentIntentions.length === 0 && <p className="text-center py-10 text-slate-300 text-xs font-bold uppercase tracking-widest">Aucune intention récente</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6 print:hidden">
          <div className="bg-[#001A4D] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
             <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:scale-110 transition-transform"><MessageSquare className="w-48 h-48" /></div>
             <h3 className="text-lg font-black mb-6 relative z-10">Actions Rapides</h3>
             <div className="space-y-3 relative z-10">
               <QuickActionButton icon={Plus} label="Inscrire Intention" color="amber" onClick={() => setActiveTab('intentions')} />
               <QuickActionButton icon={Printer} label="Imprimer Rapport PDF" color="blue" onClick={handlePrint} />
               {!isFidel && <QuickActionButton icon={Users} label="Nouvelle Inscription" color="emerald" onClick={() => setActiveTab('parishioners')} />}
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-lg"><Calendar className="w-5 h-5 text-indigo-500" /> Agenda</h3>
             <div className="space-y-4">
                <Announcement title="Messe Chrismale" desc="Jeudi prochain à 10h à la cathédrale." type="liturgy" />
                <Announcement title="Permanence Curé" desc="Mardi et Vendredi (8h - 13h)." type="office" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }: any) => {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600"
  };
  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center mb-5`}><Icon className="w-6 h-6" /></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900 tracking-tighter mt-1">{value}</p>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label, color, onClick }: any) => {
  const colors: any = {
    amber: "bg-amber-500 hover:bg-amber-400 text-[#001A4D]",
    blue: "bg-white/10 hover:bg-white/20 text-white",
    emerald: "bg-emerald-500 hover:bg-emerald-400 text-white"
  };
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 ${colors[color]} rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
};

const Announcement = ({ title, desc, type }: any) => (
  <div className={`p-5 rounded-2xl border ${type === 'liturgy' ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
    <p className="text-sm font-black text-slate-900">{title}</p>
    <p className="text-[11px] text-slate-500 font-medium mt-1">{desc}</p>
  </div>
);

export default Dashboard;
