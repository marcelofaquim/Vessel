'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HeaderAuth() {
  const { isAuthenticated, user, signOut } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Olá, {user?.name || 'Utilizador'}</span>
        <button
          onClick={() => router.push('/dashboard')}
          className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold hover:bg-gray-100 transition"
        >
          Painel
        </button>
        <button
          onClick={signOut}
          className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600 transition"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/login')}
      className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow hover:bg-blue-700 transition"
    >
      Entrar / Cadastrar
    </button>
  );
}