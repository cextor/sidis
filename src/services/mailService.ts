import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase.ts';
import { MailIncoming, MailStatus, MailOutgoing, OutgoingStatus } from '../types.ts';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const mailService = {
  // --- Mail Incoming ---
  
  subscribeMailsIncoming: (callback: (mails: MailIncoming[]) => void) => {
    const q = query(collection(db, 'mailsIncoming'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const mails = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MailIncoming));
      callback(mails);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'mailsIncoming');
    });
  },

  addMailIncoming: async (mail: Partial<MailIncoming>) => {
    try {
      const docRef = await addDoc(collection(db, 'mailsIncoming'), {
        ...mail,
        status: MailStatus.PENDING,
        createdBy: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'mailsIncoming');
    }
  },

  // --- Mail Outgoing ---

  subscribeMailsOutgoing: (callback: (mails: MailOutgoing[]) => void) => {
    const q = query(collection(db, 'mailsOutgoing'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const mails = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MailOutgoing));
      callback(mails);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'mailsOutgoing');
    });
  },

  addMailOutgoing: async (mail: Partial<MailOutgoing>) => {
    try {
      const docRef = await addDoc(collection(db, 'mailsOutgoing'), {
        ...mail,
        status: OutgoingStatus.DRAFT,
        createdBy: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'mailsOutgoing');
    }
  }
};
