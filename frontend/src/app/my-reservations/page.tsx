'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getUserBookingsRequest, Booking } from '../../services/bookingServices';

export default function MyReservationsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = Cookies.get('vessel_token');

      // Se não estiver autenticado, redireciona para a página de login
      if (!token) {
        router.push('/login?redirect=/my-reservations');
        return;
      }

      try {
        const data = await getUserBookingsRequest();
        setBookings(data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const message = err.response?.data?.error || 'Erro ao carregar as suas reservas.';
          setErrorMessage(message);
        } else {
          setErrorMessage('Erro inesperado ao buscar reservas.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 animate-pulse">A carregar as suas reservas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Minhas Reservas</h1>

      {errorMessage && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
          {errorMessage}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-gray-50">
          <p className="text-gray-600 mb-4">Ainda não efetuou nenhuma reserva.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Explorar acomodações
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded-xl p-4 shadow-sm bg-white flex flex-col justify-between">
              <div>
                {booking.property.images?.[0] && (
                  <img
                    src={booking.property.images[0]}
                    alt={booking.property.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold">{booking.property.title}</h2>
                <p className="text-sm text-gray-500 mb-3">{booking.property.location}</p>

                <div className="text-sm space-y-1 text-gray-700 border-t pt-3 mb-4">
                  <p>
                    <span className="font-semibold">Check-in:</span>{' '}
                    {new Date(booking.checkIn).toLocaleDateString('pt-BR')}
                  </p>
                  <p>
                    <span className="font-semibold">Check-out:</span>{' '}
                    {new Date(booking.checkOut).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center border-t pt-3 mt-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-800">
                  {booking.status}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  R$ {Number(booking.totalPrice).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
