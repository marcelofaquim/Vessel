'use client'


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'GUEST' | 'HOST'>('GUEST');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulação do registo do utilizador
      const newUser = {
        id: 'user_' + Date.now(),
        name,
        email,
        role, // 'GUEST' ou 'HOST'
      };

      // Guarda os dados no localStorage para o AuthContext e sessões futuras
      localStorage.setItem('vessel_user', JSON.stringify(newUser));


      alert(`Conta criada com sucesso como ${role === 'HOST' ? 'Anfitrião' : 'Viajante'}!`);

      // Redirecionamento com base no tipo de conta escolhido
      if (role === 'HOST') {
        router.push('/host');
      } else {
        router.push('/');
      }
    } catch {
      alert('Erro ao realizar registo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        {/* Cabeçalho */}
        <div className="text-center">
          <div
            onClick={() => router.push('/')}
            className="inline-flex cursor-pointer items-center gap-2 text-3xl font-black text-blue-600"
          >
            <span>⛵</span> Vessel
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Crie a sua conta
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Junte-se à maior plataforma de alojamentos e embarcações.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Seleção de Tipo de Conta */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Tipo de Conta
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('GUEST')}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-center transition ${
                  role === 'GUEST'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-1">🧳</span>
                <span className="text-xs font-semibold">Viajante</span>
                <span className="text-[10px] text-gray-400 mt-1">Quero reservar</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('HOST')}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-center transition ${
                  role === 'HOST'
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl mb-1">🏠</span>
                <span className="text-xs font-semibold">Anfitrião</span>
                <span className="text-[10px] text-gray-400 mt-1">Quero anunciar</span>
              </button>
            </div>
          </div>

          {/* Campos do Formulário */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 focus:border-blue-600 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 focus:border-blue-600 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
                Palavra-passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 focus:border-blue-600 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? 'A criar conta...' : 'Criar Conta'}
          </button>
        </form>

        {/* Link para Login */}
        <div className="text-center text-xs font-medium text-gray-500">
          Já tem uma conta?{' '}
          <button
            onClick={() => router.push('/login')}
            className="font-bold text-blue-600 hover:underline"
          >
            Iniciar Sessão
          </button>
        </div>
      </div>
    </div>
  );
}
