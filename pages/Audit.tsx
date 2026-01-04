
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Clock, User, Info, Search, Database } from 'lucide-react';
import { api } from '../services/api';
import { AuditLog } from '../types';

const Audit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setLogs(api.getAuditLogs());
    const interval = setInterval(() => {
      setLogs(api.getAuditLogs());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(l => 
    l.userName.toLowerCase().includes(filter.toLowerCase()) || 
    l.action.toLowerCase().includes(filter.toLowerCase()) ||
    l.module.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Database className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
            <ShieldAlert className="w-10 h-10 text-rose-500" /> Audit & Traçabilité
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Surveillance système en temps réel</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Filtrer les événements..."
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filteredLogs.length} événements enregistrés</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Horodatage</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acteur</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action & Module</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Détails de l'opération</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 text-slate-500 font-medium">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">{log.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-900 text-[10px]">
                        {log.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{log.userName}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">IP: {log.ipAddress}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        log.action === 'SUPPRESSION' ? 'bg-rose-100 text-rose-700' : 
                        log.action === 'CONNEXION' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {log.action}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">{log.module}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Terminal className="w-4 h-4 text-slate-300" />
                      <p className="text-sm font-medium">{log.details}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLogs.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              <Info className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-bold uppercase text-[10px] tracking-widest">Aucun log trouvé pour cette recherche</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Audit;
