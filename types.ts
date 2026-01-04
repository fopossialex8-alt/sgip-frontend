
export enum UserRole {
  ADMIN = 'Super-Administrateur',
  CURE = 'Curé',
  VICAIRE = 'Vicaire',
  SECRETAIRE = 'Secrétaire',
  COMPTABLE = 'Comptable',
  PRESIDENT_CONSEIL = 'Président du Conseil',
  FIDEL = 'Fidèle'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  email: string;
  role: UserRole;
  fullName: string;
  parishName: string;
  isActive: boolean;
  token?: string;
}

export interface ParishSettings {
  name: string;
  diocese: string;
  address: string;
  phone: string;
  email: string;
  cureName: string;
  logoUrl?: string;
}

export interface MassIntention {
  id: string;
  requesterName: string;
  content: string;
  date: string;
  type: 'ACTION_DE_GRACE' | 'DEFUNTS' | 'SANTE' | 'AUTRE';
  amount: number;
  status: 'PAYE' | 'EN_ATTENTE';
  recordedAt: string;
}

export enum SacramentType {
  BAPTEME = 'Baptême',
  CONFIRMATION = 'Confirmation',
  MARIAGE = 'Mariage',
  DECES = 'Obsèques'
}

export interface SacramentRecord {
  id: string;
  type: SacramentType;
  parishionerId: string;
  parishionerName: string;
  date: string;
  minister: string;
  godFather?: string;
  godMother?: string;
  registerVolume: string;
  registerPage: string;
  registerNumber: string;
  verificationKey: string; // Clé de sécurité anti-fraude
}

export enum TransactionType {
  ENTREE = 'Entrée',
  SORTIE = 'Sortie'
}

export enum TransactionCategory {
  QUETE = 'Quête Dominicale',
  DIME = 'Denier du Culte (Dîme)',
  INTENTION = 'Intention de Messe',
  RECOLTE = 'Récolte de Fonds / Kermesse',
  PROJET = 'Projet de Construction',
  DEPENSE_FONCTIONNEMENT = 'Entretien / Travaux',
  AUMONE = 'Caritas / Social',
  AUTRE = 'Autre'
}

export interface ParishProject {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  status: 'EN_COURS' | 'TERMINE' | 'PAUSE';
}

export interface FinanceTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  recordedBy: string;
  cevReference?: string;
  projectId?: string; // Référence à un projet spécifique
}

export interface Parishioner {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  address: string;
  cevId: string; 
  status: 'ACTIF' | 'INACTIF' | 'DECEDE';
  createdAt: string;
  baptized: boolean;
  confirmed: boolean;
  married: boolean;
}

export interface CEV {
  id: string;
  name: string;
  district: string;
  presidentName: string;
  presidentPhone: string;
  presidentEmail: string;
  meetingDay: string;
  memberCount: number;
  financialTarget: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
}

export interface LiturgyEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  celebrant: string;
  intentions: string[];
  type: 'MESSE' | 'REUNION' | 'FETE';
  color: string;
}
