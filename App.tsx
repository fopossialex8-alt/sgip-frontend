
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Parishioners from './pages/Parishioners';
import Finance from './pages/Finance';
import Sacraments from './pages/Sacraments';
import Events from './pages/Events';
import AdminUsers from './pages/AdminUsers';
import Communication from './pages/Communication';
import Audit from './pages/Audit';
import Intentions from './pages/Intentions';
import Projects from './pages/Projects';
import { api } from './services/api';
import { Church, Loader2, Lock, UserCircle, Globe, Settings, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User, UserRole, ParishSettings } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isInitialized, setIsInitialized] = useState(true);
  const [loginMode, setLoginMode] = useState<'STAFF' | 'FIDEL' | 'SETUP'>('STAFF');
  const [authForm, setAuthForm] = useState({ username: '', password: '', phone: '', matricule: '' });
  const [authError, setAuthError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [setupData, setSetupData] = useState<ParishSettings>({
    name: '', diocese: '', address: '', phone: '', email: '', cureName: ''
  });

  useEffect(() => {
    const initialized = api.isInitialized();
    setIsInitialized(initialized);
    if (!initialized) setLoginMode('SETUP');

    const savedUser = localStorage.getItem('sgip_session');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    setTimeout(() => {
      const auth = api.authenticate(authForm.username, authForm.password);
      if (auth) {
        setCurrentUser(auth);
        localStorage.setItem('sgip_session', JSON.stringify(auth));
        setActiveTab('dashboard');
      } else {
        setAuthError('Identifiants de bureau invalides.');
      }
      setIsAuthenticating(false);
    }, 600);
  };

  const handleFidelLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    setTimeout(() => {
      const fidel = api.authenticateFidel(authForm.matricule, authForm.phone);
      if (fidel) {
        const userFidel: User = {
          id: fidel.id,
          username: fidel.id,
          fullName: `${fidel.lastName} ${fidel.firstName}`,
          role: UserRole.FIDEL,
          email: fidel.email,
          parishName: api.getSettings()?.name || 'Ma Paroisse',
          isActive: true
        };
        setCurrentUser(userFidel);
        localStorage.setItem('sgip_session', JSON.stringify(userFidel));
        setActiveTab('dashboard');
      } else {
        setAuthError('Matricule ou téléphone introuvable.');
      }
      setIsAuthenticating(false);
    }, 600);
  };

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const adminUser: User = {
      id: 'admin-01',
      username: 'admin',
      fullName: 'Administrateur',
      role: UserRole.ADMIN,
      email: setupData.email,
      parishName: setupData.name,
      isActive: true
    };
    api.initializeParish(setupData, adminUser);
    setIsInitialized(true);
    setSetupSuccess(true);
    setTimeout(() => {
      setLoginMode('STAFF');
      setSetupSuccess(false);
      setAuthForm({ ...authForm, username: 'admin', password: 'admin_password_change_me' });
    }, 2000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sgip_session');
    setActiveTab('dashboard');
    setAuthForm({ username: '', password: '', phone: '', matricule: '' });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-sans">
        <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-[#001A4D] p-12 text-center text-white relative">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"><Globe className="w-full h-full scale-150 rotate-12" /></div>
             <Church className="w-16 h-16 text-amber-500 mx-auto mb-6" />
             <h1 className="text-3xl font-black tracking-tighter">SGIP <span className="text-amber-500">PRO</span></h1>
             <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200 mt-2">Gestion Paroissiale de Précision</p>
          </div>

          <div className="p-10 lg:p-12">
            {setupSuccess ? (
              <div className="text-center py-10 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
                <h2 className="text-2xl font-black text-slate-900">Paroisse Activée !</h2>
                <p className="text-slate-500 font-medium mt-2">Redirection vers la connexion...</p>
              </div>
            ) : loginMode === 'SETUP' ? (
              <form onSubmit={handleSetup} className="space-y-5">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6"><Settings className="w-6 h-6 text-amber-500" /> Assistant de déploiement</h2>
                <div className="grid grid-cols-2 gap-4">
                  <SetupInput label="Nom Paroisse" value={setupData.name} onChange={v => setSetupData({...setupData, name: v})} />
                  <SetupInput label="Diocèse" value={setupData.diocese} onChange={v => setSetupData({...setupData, diocese: v})} />
                </div>
                <SetupInput label="Nom du Curé" value={setupData.cureName} onChange={v => setSetupData({...setupData, cureName: v})} />
                <div className="grid grid-cols-2 gap-4">
                  <SetupInput label="Téléphone" value={setupData.phone} onChange={v => setSetupData({...setupData, phone: v})} />
                  <SetupInput label="Email" value={setupData.email} onChange={v => setSetupData({...setupData, email: v})} />
                </div>
                <button type="submit" className="w-full py-5 bg-[#001A4D] text-amber-500 font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl mt-4">Démarrer le système</button>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                   <button onClick={() => { setLoginMode('STAFF'); setAuthError(''); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMode === 'STAFF' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Bureau Paroissial</button>
                   <button onClick={() => { setLoginMode('FIDEL'); setAuthError(''); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${loginMode === 'FIDEL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Mon Carnet Fidèle</button>
                </div>

                {authError && <p className="text-rose-500 text-[10px] font-black bg-rose-50 p-4 rounded-xl border border-rose-100">{authError}</p>}

                {loginMode === 'STAFF' ? (
                  <form onSubmit={handleStaffLogin} className="space-y-4">
                    <input required type="text" placeholder="Utilisateur" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" value={authForm.username} onChange={e => setAuthForm({...authForm, username: e.target.value})} />
                    <input required type="password" placeholder="Mot de passe" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} />
                    <button type="submit" className="w-full py-5 bg-[#001A4D] text-amber-500 font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                      {isAuthenticating ? <Loader2 className="animate-spin" /> : "Connexion sécurisée"} <ArrowRight className="w-4 h-4" />
                    </button>
                    {authForm.username === 'admin' && <p className="text-[9px] text-center text-slate-400 font-bold uppercase mt-2">Pass: admin_password_change_me</p>}
                  </form>
                ) : (
                  <form onSubmit={handleFidelLogin} className="space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl mb-4 text-[10px] text-amber-800 font-bold leading-relaxed italic">
                        Accès réservé aux fidèles inscrits. Munissez-vous de votre matricule FID-XXXX.
                    </div>
                    <input required type="text" placeholder="Matricule (ex: FID-1234)" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" value={authForm.matricule} onChange={e => setAuthForm({...authForm, matricule: e.target.value})} />
                    <input required type="tel" placeholder="Téléphone enregistré" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" value={authForm.phone} onChange={e => setAuthForm({...authForm, phone: e.target.value})} />
                    <button type="submit" className="w-full py-5 bg-[#001A4D] text-amber-500 font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                      {isAuthenticating ? <Loader2 className="animate-spin" /> : "Ouvrir mon carnet"} <UserCircle className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const checkPermission = (allowedRoles: UserRole[]) => {
    if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.CURE) return true;
    return allowedRoles.includes(currentUser.role);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={currentUser} setActiveTab={setActiveTab} />;
      case 'parishioners': return checkPermission([UserRole.VICAIRE, UserRole.SECRETAIRE]) ? <Parishioners creator={currentUser} /> : <Unauthorized />;
      case 'sacraments': return checkPermission([UserRole.VICAIRE, UserRole.SECRETAIRE]) ? <Sacraments creator={currentUser} /> : <Unauthorized />;
      case 'intentions': return <Intentions user={currentUser} />;
      case 'projects': return <Projects creator={currentUser} />;
      case 'finance': return checkPermission([UserRole.COMPTABLE]) ? <Finance creator={currentUser} /> : <Unauthorized />;
      case 'communication': return checkPermission([UserRole.SECRETAIRE]) ? <Communication /> : <Unauthorized />;
      case 'events': return <Events />;
      case 'admin_users': return checkPermission([UserRole.ADMIN]) ? <AdminUsers creator={currentUser} /> : <Unauthorized />;
      case 'audit': return checkPermission([UserRole.ADMIN]) ? <Audit /> : <Unauthorized />;
      default: return <Dashboard user={currentUser} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={currentUser}>
      {renderContent()}
    </Layout>
  );
};

const SetupInput = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input required value={value} onChange={e => onChange(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-amber-500 transition-colors" />
  </div>
);

const Unauthorized = () => (
  <div className="bg-white p-20 rounded-[3rem] shadow-xl text-center border border-slate-100 animate-in fade-in duration-500">
    <Lock className="w-16 h-16 text-rose-500 mx-auto mb-6" />
    <h2 className="text-2xl font-black text-slate-900 mb-2">Accès Non Autorisé</h2>
    <p className="text-slate-500 font-medium">Seul le clergé ou le secrétariat peut accéder à ce module.</p>
  </div>
);

export default App;
