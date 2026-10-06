'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  images: string[];
  amenities: string[];
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Apartamento de Luxo com Vista para o Mar',
    description:
      'Lindo apartamento totalmente equipado em frente à praia de Copacabana. Conta com varanda espaçosa, ar condicionado em todos os cômodos e decoração moderna.',
    location: 'Copacabana, Rio de Janeiro - RJ',
    pricePerNight: 450,
    maxGuests: 4,
    bedrooms: 2,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&auto=format&fit=crop',
    ],
    amenities: ['Wi-Fi', 'Ar Condicionado', 'Vista para o Mar', 'Cozinha Equipada', 'Estacionamento'],
  },
  {
    id: '2',
    title: 'Chalé Aconchegante nas Montanhas',
    description:
      'Perfeito para relaxar nos dias frios. Possui lareira, banheira de hidromassagem e vista panorâmica para as montanhas de Campos do Jordão.',
    location: 'Campos do Jordão, São Paulo - SP',
    pricePerNight: 620,
    maxGuests: 2,
    bedrooms: 1,
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
    ],
    amenities: ['Lareira', 'Hidromassagem', 'Wi-Fi', 'Aquecedor', 'Estacionamento Grátis'],
  },
];

export default function PropertyDetailsPage() {
  const params = useParams();
  const propertyId = params?.id as string;
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Estados do formulário de reserva
  const [checkIn, setCheckIn] = useState('2026-11-10');
  const [checkOut, setCheckOut] = useState('2026-11-13');
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  useEffect(() => {
    async function loadProperty() {
      if (!propertyId) return;

      try {
        const response = await api.get(`/properties/${propertyId}`, {
          validateStatus: (status) => status < 500,
        });

        if (response.status === 200 && response.data) {
          setProperty(response.data);
        } else {
          fallbackToMock();
        }
      } catch {
        fallbackToMock();
      } finally {
        setLoading(false);
      }
    }

    function fallbackToMock() {
      const foundMock =
        MOCK_PROPERTIES.find((item) => item.id === propertyId) || MOCK_PROPERTIES[0];
      setProperty(foundMock);
    }

    loadProperty();
  }, [propertyId]);

  // Cálculo das noites e preço total
  const calculateTotalNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const totalNights = calculateTotalNights();
  const totalPrice = (property?.pricePerNight || 0) * totalNights;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert('Por favor, faça login para realizar uma reserva.');
      router.push(`/login?redirect=/properties/${propertyId}`);
      return;
    }

    if (!property) return;

    setIsSubmitting(true);

    const newBooking = {
      id: 'b_' + Date.now(),
      propertyTitle: property.title,
      propertyLocation: property.location,
      propertyImage: property.images?.[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'CONFIRMED' as const,
    };

    // 1. Grava no localStorage para persistência imediata no Dashboard
    try {
      const existing = localStorage.getItem('vessel_user_bookings');
      const currentBookings = existing ? JSON.parse(existing) : [];
      const updatedBookings = [newBooking, ...currentBookings];
      localStorage.setItem('vessel_user_bookings', JSON.stringify(updatedBookings));
    } catch {
      console.warn('Não foi possível guardar no localStorage.');
    }

    // 2. Tenta guardar via API backend se disponível
    try {
      await api.post('/bookings', {
        propertyId: property.id,
        checkIn,
        checkOut,
        guests,
        totalPrice,
      }, {
        validateStatus: (status) => status < 500,
      });
    } catch {
      console.warn('Backend indisponível. Reserva gravada apenas localmente.');
    } finally {
      setIsSubmitting(false);
      // 3. Redireciona para o painel de reservas
      router.push('/dashboard');
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">A carregar detalhes da acomodação...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">Acomodação não encontrada</h2>
        <button
          onClick={() => router.push('/')}
          className="mt-4 rounded-xl bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div
            onClick={() => router.push('/')}
            className="flex cursor-pointer items-center gap-2 text-2xl font-black tracking-tight text-blue-600"
          >
            <span>⛵</span> Vessel
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition"
              >
                Meu Painel
              </button>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo da Acomodação */}
      <main className="mx-auto max-w-7xl px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="mb-4 text-sm font-semibold text-gray-500 hover:text-blue-600 transition flex items-center gap-1"
          >
            ← Voltar para acomodações
          </button>
          <h1 className="text-3xl font-black text-gray-900">{property.title}</h1>
          <p className="mt-1 text-sm font-medium text-gray-500">📍 {property.location}</p>
        </div>

        {/* Galeria de Fotos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 overflow-hidden rounded-2xl">
          <img
            src={property.images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'}
            alt={property.title}
            className="h-96 w-full object-cover md:col-span-2 rounded-2xl"
          />
          <div className="flex flex-col gap-4">
            {property.images.slice(1, 3).map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`${property.title} ${idx + 2}`}
                className="h-[184px] w-full object-cover rounded-2xl"
              />
            ))}
          </div>
        </div>

        {/* Detalhes + Card de Reserva */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900">Sobre esta acomodação</h2>
              <p className="mt-2 text-gray-600 leading-relaxed">{property.description}</p>
              <div className="mt-4 flex gap-6 text-sm font-medium text-gray-500">
                <span>👥 Até {property.maxGuests} hóspedes</span>
                <span>🛏️ {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">O que este lugar oferece</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-blue-600">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card Flutuante de Reserva */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-2xl font-black text-gray-900">R$ {property.pricePerNight}</span>
                  <span className="text-sm text-gray-500"> / noite</span>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-200 p-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-xs font-semibold text-gray-700 bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                  <div className="border-l border-gray-200 pl-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Checkout</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs font-semibold text-gray-700 bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 p-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Hóspedes</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-xs font-semibold text-gray-700 bg-transparent focus:outline-none"
                  >
                    {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'hóspede' : 'hóspedes'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 border-t pt-4 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>R$ {property.pricePerNight} x {totalNights} {totalNights === 1 ? 'noite' : 'noites'}</span>
                    <span>R$ {totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-gray-900 border-t pt-2">
                    <span>Total</span>
                    <span>R$ {totalPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'A processar...' : 'Reservar Agora'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}