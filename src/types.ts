export enum UserRole {
  ADMIN = 'ADMIN',
  KAPUS = 'KAPUS', // Kepala Pusat / Head
  SEKRETARIS = 'SEKRETARIS',
  STAFF = 'STAFF'
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  role: 'ADMINISTRATOR' | 'OPERATOR' | 'PEJABAT';
  avatarUrl?: string;
  nip?: string;
  position_name?: string;
  golongan?: string;
  unit_name?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export enum MailStatus {
  PENDING = 'PENDING',
  DISPOSED = 'DISPOSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

export interface MailIncoming {
  id: string;
  letterNumber: string;
  dateReceived: string;
  dateOnLetter: string;
  sender: string;
  subject: string;
  classification: string;
  status: MailStatus;
  expiryDate?: string;
  pdfUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export enum OutgoingStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ARCHIVED = 'ARCHIVED'
}

export interface MailOutgoing {
  id: string;
  letterNumber: string;
  dateSent?: string;
  recipient: string;
  subject: string;
  classification: string;
  status: OutgoingStatus;
  pdfUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export enum DispositionStatus {
  PENDING = 'PENDING',
  READ = 'READ',
  COMPLETED = 'COMPLETED'
}

export interface Disposition {
  id: string;
  mailIncomingId: string;
  fromId: string;
  toId: string;
  instruction: string;
  deadline?: string;
  status: DispositionStatus;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: 'DISPOSITION' | 'MAIL_INCOMING' | 'SYSTEM';
  read: boolean;
  link?: string;
  createdAt: string;
}
