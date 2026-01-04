
import { CEV, UserRole, User, Parishioner, TransactionCategory } from './types';

export const APP_NAME = "SGIP v1.2 - Cameroon Edition";

export const MOCK_CEVS: CEV[] = [
  // Fix: Added missing properties 'presidentPhone', 'presidentEmail' and 'financialTarget'
  { id: 'cev-1', name: 'Saint Jean-Paul II', district: 'Mvolyé', presidentName: 'M. Abega Ferdinand', presidentPhone: '699000001', presidentEmail: 'ferdinand.abega@paroisse.cm', meetingDay: 'Mercredi', memberCount: 45, financialTarget: 500000 },
  { id: 'cev-2', name: 'Sainte Thérèse', district: 'Anguissa', presidentName: 'Mme. Ngo Batamack Lucy', presidentPhone: '699000002', presidentEmail: 'lucy.ngo@paroisse.cm', meetingDay: 'Jeudi', memberCount: 32, financialTarget: 500000 },
  { id: 'cev-3', name: 'Saint Kizito', district: 'Nkol-Eton', presidentName: 'M. Fotsing Emmanuel', presidentPhone: '699000003', presidentEmail: 'emmanuel.fotsing@paroisse.cm', meetingDay: 'Mardi', memberCount: 58, financialTarget: 500000 },
  { id: 'cev-4', name: 'Notre Dame de la Paix', district: 'Bastos', presidentName: 'Mme. Eposi Mary', presidentPhone: '699000004', presidentEmail: 'mary.eposi@paroisse.cm', meetingDay: 'Vendredi', memberCount: 25, financialTarget: 500000 },
];

export const MOCK_USER: User = {
  id: 'u-1',
  username: 'mgr_nkou',
  // Fix: Added missing properties 'email' and 'isActive'
  email: 'mgr.nkou@diocese-yaounde.cm',
  isActive: true,
  role: UserRole.CURE,
  fullName: 'Mgr Jean-Baptiste Nkou',
  parishName: 'Sainte Anne de Yaoundé'
};

export const MOCK_PARISHIONERS: Parishioner[] = [
  {
    id: 'p-1',
    firstName: 'Théophile',
    lastName: 'Abena',
    birthDate: '1975-04-12',
    gender: 'M',
    phone: '699887766',
    // Fix: Added missing property 'email'
    email: 't.abena@example.cm',
    address: 'Mvolyé, Yaoundé',
    cevId: 'cev-1',
    status: 'ACTIF',
    createdAt: '2022-01-10',
    baptized: true,
    confirmed: true,
    married: true
  },
  {
    id: 'p-2',
    firstName: 'Bernadette',
    lastName: 'Mvondo',
    birthDate: '1990-11-23',
    gender: 'F',
    phone: '677112233',
    // Fix: Added missing property 'email'
    email: 'b.mvondo@example.cm',
    address: 'Nkol-Eton, Yaoundé',
    cevId: 'cev-3',
    status: 'ACTIF',
    createdAt: '2023-05-15',
    baptized: true,
    confirmed: false,
    married: false
  },
  {
    id: 'p-3',
    firstName: 'Christian',
    lastName: 'Kamga',
    birthDate: '1988-02-05',
    gender: 'M',
    phone: '655443322',
    // Fix: Added missing property 'email'
    email: 'c.kamga@example.cm',
    address: 'Anguissa, Yaoundé',
    cevId: 'cev-2',
    status: 'ACTIF',
    createdAt: '2023-08-20',
    baptized: true,
    confirmed: true,
    married: false
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  [TransactionCategory.QUETE]: '#002366', // Royal Blue
  [TransactionCategory.DIME]: '#D4AF37',  // Gold
  [TransactionCategory.INTENTION]: '#8B0000', // Dark Red
  [TransactionCategory.RECOLTE]: '#10b981', // Emerald
  [TransactionCategory.DEPENSE_FONCTIONNEMENT]: '#ef4444', // Red
  [TransactionCategory.AUMONE]: '#8b5cf6', // Violet
};

export const LITURGICAL_COLORS = {
  ORDINAIRE: 'bg-green-600',
  CAREME: 'bg-purple-700',
  PAQUES: 'bg-amber-100 text-amber-900 border-amber-300',
  MARTYR: 'bg-red-700'
};
