import api from './api.ts';
import { MailIncoming, MailOutgoing } from '../types.ts';

export const mailService = {
  // --- Mail Incoming ---
  
  subscribeMailsIncoming: (callback: (mails: MailIncoming[]) => void) => {
    // Mocking subscription with a single fetch for now
    api.get('/mails/incoming').then(response => {
      callback(response.data);
    }).catch(error => {
      console.error('Error fetching incoming mails', error);
    });
    
    // Return an unsubscribe function
    return () => {}; 
  },

  addMailIncoming: async (mail: Partial<MailIncoming>) => {
    try {
      const response = await api.post('/mails/incoming', mail);
      return response.data.id;
    } catch (error) {
      console.error('Error creating incoming mail', error);
      throw error;
    }
  },

  // --- Mail Outgoing ---

  subscribeMailsOutgoing: (callback: (mails: MailOutgoing[]) => void) => {
    api.get('/mails/outgoing').then(response => {
      callback(response.data);
    }).catch(error => {
      console.error('Error fetching outgoing mails', error);
    });

    return () => {};
  },

  addMailOutgoing: async (mail: Partial<MailOutgoing>) => {
    try {
      const response = await api.post('/mails/outgoing', mail);
      return response.data.id;
    } catch (error) {
      console.error('Error creating outgoing mail', error);
      throw error;
    }
  }
};
