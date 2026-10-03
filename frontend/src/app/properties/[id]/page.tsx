'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Property, MOCK_PROPERTIES } from '@/app/page';

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    async function loadProperty() {
    if (!propertyId) return;

    try {
      // O validateStatus faz o Axios não disparar exceção para status 500, caindo no fallback suavemente
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">A carregar detalhes do imóvel...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Imóvel não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header simples de navegação */}
      <header className="border-b bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Voltar para a pesquisa
          </button>
          <span className="text-xl font-black text-blue-600">⛵ Vessel</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-10">
        {/* Título e Localização */}
        <h1 className="text-3xl font-extrabold text-gray-900">{property.title}</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">📍 {property.location}</p>

        {/* Galeria de Imagens */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <img
              src={property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'}
              alt={property.title}
              className="h-96 w-full rounded-2xl object-cover shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-4">
            {property.images?.slice(1, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${property.title} ${idx + 2}`}
                className="h-44 w-full rounded-2xl object-cover shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* Conteúdo Principal + Calendário/Card de Reserva */}
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Coluna da Esquerda: Detalhes, Descrição e Comodidades */}
          <div className="lg:col-span-2">
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Acomodação inteira • {property.maxGuests || 2} hóspedes
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {property.bedrooms || 1} quarto(s) • {property.beds || 1} cama(s) • {property.baths || 1} banheiro(s)
              </p>
            </div>

            {/* Descrição */}
            <div className="border-b py-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sobre este espaço</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* O que este lugar oferece (Comodidades) */}
            <div className="py-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">O que este lugar oferece</h3>
              <div className="grid grid-cols-2 gap-3">
                {(property.amenities || ['Wi-Fi', 'Estacionamento', 'Ar Condicionado']).map(
                  (item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <span>✓</span>
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Card de Reserva com Calendário de Datas */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="flex items-baseline justify-between border-b pb-4">
                <div>
                  <span className="text-2xl font-black text-gray-900">
                    R$ {Number(property.pricePerNight).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500"> / noite</span>
                </div>
                {property.rating && (
                  <span className="text-xs font-bold text-gray-900">
                    ★ {property.rating} ({property.reviewsCount || 0} avaliações)
                  </span>
                )}
              </div>

              {/* Formulário de Seleção de Datas (Calendário) */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-gray-300 p-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-500">
                      CHECK-IN
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-xs font-medium text-gray-800 outline-none bg-transparent"
                    />
                  </div>
                  <div className="border-l pl-2">
                    <label className="block text-[10px] font-bold uppercase text-gray-500">
                      CHECKOUT
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs font-medium text-gray-800 outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-gray-300 p-2">
                  <label className="block text-[10px] font-bold uppercase text-gray-500">
                    HÓSPEDES
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-xs font-medium text-gray-800 outline-none bg-transparent"
                  >
                    {[...Array(property.maxGuests || 4)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'hóspede' : 'hóspedes'}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Reserva solicitada para ${property.title}!`)}
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-95"
                >
                  Reservar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}