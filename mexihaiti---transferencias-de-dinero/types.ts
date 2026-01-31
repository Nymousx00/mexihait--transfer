
export type TransactionStatus = 'Pendiente' | 'Completado' | 'Cancelado';

export type TransactionType = 'Recarga' | 'Envío';

export type WalletService = 'NatCash' | 'MonCash';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  balance: number;
  isAdmin: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amountMXN: number;
  feeMXN?: number;
  totalMXN: number;
  amountHTG?: number;
  status: TransactionStatus;
  date: string;
  service?: WalletService;
  receiverName?: string;
  receiverPhone?: string;
  senderName?: string;
  senderPhone?: string;
  receiptUrl?: string; // For Top-up proof
  notes?: string;
}

export interface AppState {
  currentUser: User | null;
  transactions: Transaction[];
  users: User[];
}
