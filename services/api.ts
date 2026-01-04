
import { 
  Parishioner, CEV, SacramentRecord, FinanceTransaction, User, 
  UserRole, SacramentType, TransactionType, TransactionCategory, 
  AuditLog, MassIntention, ParishSettings, ParishProject 
} from '../types';

class ParishBackend {
  private parishioners: Parishioner[] = [];
  private transactions: FinanceTransaction[] = [];
  private sacrements: SacramentRecord[] = [];
  private intentions: MassIntention[] = [];
  private users: User[] = [];
  private cevs: CEV[] = [];
  private projects: ParishProject[] = [];
  private auditLogs: AuditLog[] = [];
  private settings: ParishSettings | null = null;

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const get = (key: string) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : [];
      };

      this.parishioners = get('sgip_parishioners');
      this.transactions = get('sgip_finances');
      this.sacrements = get('sgip_sacrements');
      this.cevs = get('sgip_cevs');
      this.auditLogs = get('sgip_audit');
      this.intentions = get('sgip_intentions');
      this.projects = get('sgip_projects');
      const sSet = localStorage.getItem('sgip_settings');
      this.settings = sSet ? JSON.parse(sSet) : null;
      this.users = get('sgip_users');

      if (this.cevs.length === 0) {
        this.cevs = [{ 
          id: 'cev-default', name: 'Communauté Saint-Esprit', district: 'Centre', 
          presidentName: 'M. Le Curé', presidentPhone: '600000000', 
          presidentEmail: 'admin@paroisse.cm', meetingDay: 'Dimanche', 
          memberCount: 0, financialTarget: 100000 
        }];
        this.save();
      }
    } catch (e) { console.error("Data Load Error", e); }
  }

  private save() {
    localStorage.setItem('sgip_parishioners', JSON.stringify(this.parishioners));
    localStorage.setItem('sgip_finances', JSON.stringify(this.transactions));
    localStorage.setItem('sgip_sacrements', JSON.stringify(this.sacrements));
    localStorage.setItem('sgip_cevs', JSON.stringify(this.cevs));
    localStorage.setItem('sgip_users', JSON.stringify(this.users));
    localStorage.setItem('sgip_audit', JSON.stringify(this.auditLogs));
    localStorage.setItem('sgip_intentions', JSON.stringify(this.intentions));
    localStorage.setItem('sgip_projects', JSON.stringify(this.projects));
    if (this.settings) localStorage.setItem('sgip_settings', JSON.stringify(this.settings));
  }

  logAudit(user: User, action: string, module: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleString(),
      userId: user.id, userName: user.fullName,
      action, module, details, ipAddress: 'Local'
    };
    this.auditLogs.unshift(log);
    this.save();
  }

  isInitialized() { return this.settings !== null; }
  getSettings() { return this.settings; }
  getParishioners() { return this.parishioners; }
  getTransactions() { return this.transactions; }
  getIntentions() { return this.intentions; }
  getCEVs() { return this.cevs; }
  getSacrements() { return this.sacrements; }
  getProjects() { return this.projects; }
  getAuditLogs() { return this.auditLogs; }
  getUsers() { return this.users.map(({password, ...u}) => u as User); }

  initializeParish(settings: ParishSettings, adminUser: User) {
    this.settings = settings;
    const adminWithPass = { ...adminUser, password: 'admin_password_change_me' };
    this.users = [adminWithPass];
    this.save();
  }

  authenticate(username: string, password: string): User | null {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user && user.isActive) return user;
    return null;
  }

  // Fix: Added authenticateFidel method to allow parishioners to log in with their matricule and phone number
  authenticateFidel(matricule: string, phone: string): Parishioner | null {
    const fidel = this.parishioners.find(p => p.id === matricule && p.phone === phone);
    if (fidel && fidel.status === 'ACTIF') return fidel;
    return null;
  }

  addSacrement(user: User, s: Omit<SacramentRecord, 'id' | 'verificationKey'>) {
    const vKey = `VERIF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newS = { ...s, id: `SAC-${Date.now()}`, verificationKey: vKey };
    this.sacrements.unshift(newS as SacramentRecord);
    this.save();
    this.logAudit(user, 'ENREGISTREMENT', 'SACREMENT', `Clé générée pour ${s.parishionerName}: ${vKey}`);
    return newS;
  }

  addProject(user: User, project: Omit<ParishProject, 'id' | 'currentAmount'>) {
    const newProject = { ...project, id: `PROJ-${Date.now()}`, currentAmount: 0 };
    this.projects.push(newProject as ParishProject);
    this.save();
    return newProject;
  }

  addTransaction(user: User, t: Omit<FinanceTransaction, 'id'>) {
    const newT = { ...t, id: `T-${Date.now()}-${Math.random()}` };
    this.transactions.unshift(newT as FinanceTransaction);
    
    // Si c'est un projet, on met à jour le montant du projet
    if (t.projectId) {
      const pIndex = this.projects.findIndex(p => p.id === t.projectId);
      if (pIndex !== -1) {
        this.projects[pIndex].currentAmount += (t.type === TransactionType.ENTREE ? t.amount : -t.amount);
      }
    }
    
    this.save();
    return newT;
  }

  addParishioner(user: User, p: Omit<Parishioner, 'id' | 'createdAt'>) {
    const id = `FID-${Math.floor(1000 + Math.random() * 8999)}`;
    const newP = { ...p, id, createdAt: new Date().toISOString() };
    this.parishioners.unshift(newP as Parishioner);
    this.save();
    return newP;
  }

  addIntention(user: User, i: Omit<MassIntention, 'id' | 'recordedAt'>) {
    const id = `INT-${Date.now()}`;
    const newI = { ...i, id, recordedAt: new Date().toISOString() };
    this.intentions.unshift(newI as MassIntention);
    if (i.status === 'PAYE') {
      this.addTransaction(user, {
        date: new Date().toISOString().split('T')[0],
        type: TransactionType.ENTREE,
        category: TransactionCategory.INTENTION,
        amount: i.amount,
        description: `Intention de Messe: ${i.requesterName}`,
        recordedBy: user.fullName
      });
    }
    this.save();
    return newI;
  }

  addCEV(user: User, cev: Omit<CEV, 'id'>) {
    const newCev = { ...cev, id: `CEV-${Date.now()}` };
    this.cevs.push(newCev as CEV);
    this.save();
    return newCev;
  }

  deleteCEV(user: User, id: string) {
    this.cevs = this.cevs.filter(c => c.id !== id);
    this.save();
  }

  addUser(creator: User, u: User) {
    this.users.push(u);
    this.save();
    return u;
  }

  deleteUser(creator: User, id: string) {
    this.users = this.users.filter(u => u.id !== id);
    this.save();
  }
}

export const api = new ParishBackend();
