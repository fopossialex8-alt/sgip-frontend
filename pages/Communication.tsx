
import React, { useState, useEffect } from 'react';
import { Mail, Send, Users, Info, Bell, Search, CheckCircle, Loader2, MessageCircle, Smartphone } from 'lucide-react';
import { api } from '../services/api';
import { CEV } from '../types';

const Communication: React.FC = () => {
  const [cevs, setCevs] = useState<CEV[]>([]);
  const [selectedCevs, setSelectedCevs] = useState<string[]>([]);
  const [message, setMessage] = useState({ subject: '', content: '' });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    setCevs(api.getCEVs());
  }, []);

  const handleWhatsAppBlast = () => {
    // Dans une version pro, on utiliserait une API de masse comme Twilio ou WhatsApp Business API
    // Ici on simule l'ouverture des contacts sélectionnés
    const selected = cevs.filter(c => selectedCevs.includes(c.id));
    if (selected.length === 0) return;

    // Pour le premier contact sélectionné (exemple)
    const target = selected[0];
    const text = encodeURIComponent(`*${message.subject.toUpperCase()}*\n\n${message.content}`);
    let phone = target.presidentPhone.replace(/\s/g, '');
    if (!phone.startsWith('237')) phone = '237' + phone;
    
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          {sendSuccess && (
            <div className="absolute inset-0 bg-emerald-600 z-50 flex flex-col items-center justify-center text-white animate-in slide-in-from-top duration-500 text-center p-10">
              <CheckCircle className="w-20 h-20 mb-4" />
              <h2 className="text-3xl font-black">Diffusion Réussie !</h2>
              <p className="font-bold opacity-80 mt-2">Le message a été transmis aux responsables CEV via WhatsApp/Mail.</p>
              <button onClick={() => setSendSuccess(false)} className="mt-8 px-8 py-3 bg-white text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest">Nouveau Message</button>
            </div>
          )}
          
          <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <Mail className="w-7 h-7 text-amber-500" /> Centre de Diffusion
          </h2>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-8 flex items-center gap-4">
             <div className="bg-amber-500 p-3 rounded-xl"><Smartphone className="w-6 h-6 text-white" /></div>
             <div>
               <p className="text-xs font-black text-amber-800 uppercase">Mode de Diffusion Directe</p>
               <p className="text-[10px] font-bold text-amber-600">Le système utilise WhatsApp Web pour garantir une réception immédiate au Cameroun.</p>
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Objet de l'annonce</label>
              <input 
                required
                value={message.subject}
                onChange={e => setMessage({...message, subject: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500 transition-colors" 
                placeholder="Ex: Réunion d'urgence Denier du Culte"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Corps du message</label>
              <textarea 
                required
                rows={6}
                value={message.content}
                onChange={e => setMessage({...message, content: e.target.value})}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-medium outline-none focus:border-amber-500 leading-relaxed"
                placeholder="Écrivez votre message ici..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                onClick={handleWhatsAppBlast}
                disabled={isSending || selectedCevs.length === 0}
                className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-4 uppercase tracking-widest disabled:opacity-30 shadow-lg shadow-emerald-900/10"
              >
                <MessageCircle className="w-5 h-5" /> Diffuser via WhatsApp
              </button>
              <button 
                disabled={true}
                className="w-full py-5 bg-slate-100 text-slate-400 font-black rounded-2xl flex items-center justify-center gap-4 uppercase tracking-widest cursor-not-allowed"
              >
                <Mail className="w-5 h-5" /> Diffuser via Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900">Destinataires ({selectedCevs.length})</h3>
            <button 
              onClick={() => setSelectedCevs(selectedCevs.length === cevs.length ? [] : cevs.map(c => c.id))}
              className="text-[10px] text-amber-600 font-black uppercase hover:underline"
            >
              Basculer tout
            </button>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {cevs.map(cev => (
              <label key={cev.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedCevs.includes(cev.id) ? 'bg-amber-50 border-amber-200 shadow-inner' : 'bg-slate-50 border-slate-100'
              }`}>
                <input 
                  type="checkbox"
                  checked={selectedCevs.includes(cev.id)}
                  onChange={e => {
                    if(e.target.checked) setSelectedCevs([...selectedCevs, cev.id]);
                    else setSelectedCevs(selectedCevs.filter(id => id !== cev.id));
                  }}
                  className="w-5 h-5 rounded-lg accent-amber-500"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-black text-slate-900 truncate">{cev.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{cev.presidentName}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communication;
