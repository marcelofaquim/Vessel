'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export interface Booking {
  id: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

const INITIAL_MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    propertyTitle: 'Chalé Aconchegante nas Montanhas de Campos do Jordão',
    propertyLocation: 'Campos do Jordão, São Paulo - SP',
    propertyImage:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop',
    checkIn: '2026-11-10',
    checkOut: '2026-11-13',
    guests: 2,
    totalPrice: 1860,
    status: 'CONFIRMED',
  },
  {
    id: 'b2',
    propertyTitle: 'Apartamento de Luxo com Vista para o Mar',
    propertyLocation: 'Copacabana, Rio de Janeiro - RJ',
    propertyImage:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
    checkIn: '2026-12-20',
    checkOut: '2026-12-25',
    guests: 4,
    totalPrice: 2250,
    status: 'CONFIRMED',
  },
];

export default function DashboardPage() {
  const { isAuthenticated, user, signOut } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
      return;
    }

    async function loadBookings() {
      // 1. Tenta carregar do localStorage do navegador primeiro
      const savedBookings = localStorage.getItem('vessel_user_bookings');
      if (savedBookings !== null) {
        try {
          setBookings(JSON.parse(savedBookings));
          setLoading(false);
          return;
        } catch {
          // Em caso de falha no JSON, segue para a API/Mock
        }
      }

      // 2. Tenta carregar da API backend
      try {
        const response = await api.get('/bookings', {
          validateStatus: (status) => status < 500,
        });

        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
          setBookings(response.data);
          localStorage.setItem('vessel_user_bookings', JSON.stringify(response.data));
        } else {
          setBookings(INITIAL_MOCK_BOOKINGS);
          localStorage.setItem('vessel_user_bookings', JSON.stringify(INITIAL_MOCK_BOOKINGS));
        }
      } catch {
        setBookings(INITIAL_MOCK_BOOKINGS);
        localStorage.setItem('vessel_user_bookings', JSON.stringify(INITIAL_MOCK_BOOKINGS));
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadBookings();
    }
  }, [mounted, isAuthenticated, router]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Tem a certeza de que deseja cancelar esta reserva?')) return;

    // Tenta cancelar no backend
    try {
      await api.delete(`/bookings/${bookingId}`, {
        validateStatus: (status) => status < 500,
      });
    } catch {
      console.warn('Backend indisponível. Cancelamento guardado localmente.');
    }

    // Atualiza o estado local e persiste a alteração no localStorage
    setBookings((prevBookings) => {
      const updated = prevBookings.filter((b) =>
        b.id !== bookingId); 
      localStorage.setItem('vessel_user_bookings', JSON.stringify(updated))
      return updated;
    });
  };

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">A carregar o seu painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header do Painel */}
      <header className="sticky top-0 z-50 border-b bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div
            onClick={() => router.push('/')}
            className="flex cursor-pointer items-center gap-2 text-2xl font-black tracking-tight text-blue-600"
          >
            <span>⛵</span> Vessel
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
            >
              Explorar Imóveis
            </button>
            <button
              onClick={signOut}
              className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-600 transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo do Dashboard */}
      <main className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Minhas Reservas
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Bem-vindo de volta, <span className="font-semibold text-gray-700">{user?.name || 'Viajante'}</span>! Acompanhe as suas viagens agendadas.
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 text-center shadow-sm border border-gray-100">
            <span className="text-4xl mb-3">🧳</span>
            <h3 className="text-lg font-bold text-gray-800">Nenhuma reserva encontrada</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              Ainda não efetuou nenhuma reserva. Explore as nossas acomodações e planeie a sua próxima viagem!
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              Procurar Acomodações
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition duration-200 hover:shadow-md md:flex-row"
              >
                <img
                  src={booking.propertyImage}
                  alt={booking.propertyTitle}
                  className="h-48 w-full object-cover md:h-auto md:w-64"
                />

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">
                        📍 {booking.propertyLocation}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {booking.status === 'CONFIRMED'
                          ? 'Confirmada'
                          : booking.status === 'CANCELLED'
                          ? 'Cancelada'
                          : 'Pendente'}
                      </span>
                    </div>

                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                      {booking.propertyTitle}
                    </h3>

                    <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-3 text-xs md:grid-cols-3">
                      <div>
                        <span className="block font-bold text-gray-400 uppercase text-[10px]">
                          Check-in
                        </span>
                        <span className="font-semibold text-gray-700">
                          {booking.checkIn}
                        </span>
                      </div>
                      <div>
                        <span className="block font-bold text-gray-400 uppercase text-[10px]">
                          Checkout
                        </span>
                        <span className="font-semibold text-gray-700">
                          {booking.checkOut}
                        </span>
                      </div>
                      <div>
                        <span className="block font-bold text-gray-400 uppercase text-[10px]">
                          Hóspedes
                        </span>
                        <span className="font-semibold text-gray-700">
                          {booking.guests} {booking.guests === 1 ? 'pessoa' : 'pessoas'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xs text-gray-500">Valor Total</span>
                      <p className="text-xl font-black text-gray-900">
                        R$ {Number(booking.totalPrice).toFixed(2)}
                      </p>
                    </div>

                    {booking.status !== 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                      >
                        Cancelar Reserva
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}