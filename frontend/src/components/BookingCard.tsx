'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { createBookingRequest } from '../services/bookingServices';

interface BookingCardProps {
  propertyId: string;
  pricePerNight: number;
}

export default function BookingCard({ propertyId, pricePerNight }: BookingCardProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * pricePerNight : 0;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const token = Cookies.get('vessel_token');
    if (!token) {
      router.push(`/login?redirect=/properties/${propertyId}`);
      return;
    }

    const totalPrice = calculateTotal();
    if (totalPrice <= 0) {
      setErrorMessage('Selecione datas válidas de check-in e check-out.');
      return;
    }

    try {
      setLoading(true);
      await createBookingRequest({
        propertyId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        totalPrice,
      });

      router.push('/my-reservations?success=true');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || 'Erro ao realizar a reserva.';
        setErrorMessage(message);
      } else {
        setErrorMessage('Erro inesperado ao realizar a reserva.');
      }
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="p-6 border rounded-2xl shadow-xl bg-white space-y-4">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-2xl font-bold">R$ {pricePerNight}</span>
          <span className="text-sm text-gray-500"> / noite</span>
        </div>
        <span className="text-xs font-semibold text-gray-700">★ 4.88</span>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        {/* Seletor com Inputs de Datas */}
        <div className="border rounded-xl overflow-hidden grid grid-cols-2 divide-x">
          <div className="p-2.5">
            <label className="block text-[10px] font-bold uppercase text-gray-500">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full text-sm outline-none bg-transparent cursor-pointer"
              required
            />
          </div>
          <div className="p-2.5">
            <label className="block text-[10px] font-bold uppercase text-gray-500">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-sm outline-none bg-transparent cursor-pointer"
              required
            />
          </div>
        </div>

        {total > 0 && (
          <div className="space-y-2 text-sm text-gray-600 border-t pt-3">
            <div className="flex justify-between">
              <span>R$ {pricePerNight} x {total / pricePerNight} noites</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de serviço Vessel</span>
              <span className="text-green-600 font-medium">Grátis</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 border-t pt-2">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <p className="text-red-500 text-xs font-semibold">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'A processar...' : 'Reservar Agora'}
        </button>
      </form>
    </div>
  );
}