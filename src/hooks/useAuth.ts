import { useState, useEffect } from 'react';
import api from '../services/api.ts';
import { User } from '../types.ts';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/me');
        if (response.data.status) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
