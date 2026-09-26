'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Introduza um e-mail válido'),
  password: z.string().min(6, 'A palavra-passe deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage('');
      await signIn(data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            setErrorMessage(error.message);
        } else {
            setErrorMessage('Ocorreu um erro inesperado.');
        }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Entrar na Vessel
        </h2>

        {errorMessage && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Palavra-passe</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 py-2 px-4 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}