'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicializamos o estado lendo os cookies/localStorage logo no primeiro render
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    
    const token = Cookies.get('vessel_token');
    const storedUser = localStorage.getItem('vessel_user');

    if (token && storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signOut = () => {
    Cookies.remove('vessel_token');
    localStorage.removeItem('vessel_user');
    setUser(null);
    router.push('/login');
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      Cookies.set('vessel_token', token, { expires: 7 });
      localStorage.setItem('vessel_user', JSON.stringify(user));

      setUser(user);
      router.push('/dashboard');
    } catch (error: unknown) {
      if (axiosIsError(error) && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao efetuar login.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function axiosIsError(error: unknown): error is { response?: { data?: { error?: string } } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export const useAuth = () => useContext(AuthContext);