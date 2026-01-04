
import React from 'react';
import { Calendar as CalendarIcon, Clock, User, Heart, MessageSquare } from 'lucide-react';
import { LiturgyEvent } from '../types';

const Events: React.FC = () => {
  const events: LiturgyEvent[] = [
    {
      id: 'e-1',
      title: 'Messe du Dimanche de la Pentecôte',
      date: '2024-05-19',
      time: '09:00',
      celebrant: 'Abbé Paulin Fotsing',
      intentions: ['Repos de l\'âme de Papa Jean Atangana', 'Action de grâce Famille Kamga'],
      type: 'MESSE',
      // Fix: Added missing 'color' property
      color: 'MARTYR'
    },
    {
      id: 'e-2',
      title: 'Réunion Bureau CEV St Joseph',
      date: '2024-05-22',
      time: '17:30',
      celebrant: 'M. Bikoula (Président)',
      intentions: [],
      type: 'REUNION',
      // Fix: Added missing 'color' property
      color: 'ORDINAIRE'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-black text-slate-900 mb-8">Agenda Liturgique</h2>
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-32 flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{event.date.split('-')[1]}</span>
                <span className="text-3xl font-black text-slate-900">{event.date.split('-')[2]}</span>
                <span className="text-xs font-bold text-amber-600">{event.time}</span>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">{event.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                    event.type === 'MESSE' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {event.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>Célébrant : {event.celebrant}</span>
                </div>
                {event.intentions.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Heart className="w-3 h-3 text-rose-500" /> Intentions de Messe
                    </p>
                    <ul className="space-y-1">
                      {event.intentions.map((intent, i) => (
                        <li key={i} className="text-sm text-slate-600 italic">" {intent} "</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
          <h3 className="text-xl font-black mb-6 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-amber-500" />
            Annonces Paroissiales
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
              <p className="text-xs text-amber-500 font-bold mb-1">Secrétariat</p>
              <p className="text-sm font-medium leading-relaxed">Les inscriptions pour la prochaine session de baptême des adultes sont ouvertes jusqu'au 30 Juin.</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
              <p className="text-xs text-amber-500 font-bold mb-1">Conseil Pastoral</p>
              <p className="text-sm font-medium leading-relaxed">Grande kermesse paroissiale prévue le 15 Août. Toutes les CEV sont conviées à la réunion de préparation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;