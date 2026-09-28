'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { MOCK_PROPERTIES, Property } from '../../page';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();

  const propertyId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '1';

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estado para cálculo de reserva simples
  const [nights, setNights] = useState<number>(3);

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        // Tenta buscar na API
        const response = await api.get(`/properties/${propertyId}`);
        const apiData = response.data;

        // Procura no mock ou combina dados da API
        const matchedMock = MOCK_PROPERTIES.find((p) => p.id === propertyId) || MOCK_PROPERTIES[0];
        
        setProperty({
          ...matchedMock,
          id: apiData.id || matchedMock.id,
          title: apiData.title || matchedMock.title,
          description: apiData.description || matchedMock.description,
          pricePerNight: apiData.pricePerNight || matchedMock.pricePerNight,
          location: apiData.location || matchedMock.location,
        });
      } catch {
        // Fallback direto para o mock se o ID não existir no backend ainda
        const matchedMock = MOCK_PROPERTIES.find((p) => p.id === propertyId) || MOCK_PROPERTIES[0];
        setProperty(matchedMock);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [propertyId]);

  const handleReserve = () => {
    if (!isAuthenticated) {
      // Lazy-Gated Auth: guarda o destino do imóvel e redireciona para login
      router.push(`/login?redirect=/properties/${propertyId}`);
      return;
    }

    alert(`Reserva solicitada para ${property?.title} por ${nights} noites! Total: R$ ${(property?.pricePerNight || 0) * nights}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Carregando detalhes do imóvel...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-xl font-bold text-gray-800">Acomodação não encontrada</h2>
        <button
          onClick={() => router.push('/')}
          className="mt-4 rounded-full bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          Voltar para as acomodações
        </button>
      </div>
    );
  }

  const totalPrice = property.pricePerNight * nights;

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-16">
      {/* Header */}
      <header className="border-b bg-white px-8 py-4 sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div 
            onClick={() => router.push('/')} 
            className="flex cursor-pointer items-center gap-2 text-2xl font-black text-blue-600"
          >
            <span>⛵</span> Vessel
          </div>

          <div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Olá, {user?.name}</span>
                <button
                  onClick={signOut}
                  className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push(`/login?redirect=/properties/${property.id}`)}
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto mt-6 max-w-7xl px-8">
        {/* Título & Informações Gerais */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            {property.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700">
            <span className="flex items-center gap-1 font-bold">
              ★ {property.rating} <span className="underline">({property.reviewsCount} avaliações)</span>
            </span>
            <span>•</span>
            <span className="underline">{property.location}</span>
          </div>
        </div>

        {/* Mosaico de Galeria de Fotos Estilo Airbnb */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 overflow-hidden rounded-2xl">
          <div className="md:col-span-2 h-[380px]">
            <img
              src={property.images[0]}
              alt={property.title}
              className="h-full w-full object-cover cursor-pointer hover:opacity-95 transition"
            />
          </div>
          <div className="hidden md:flex flex-col gap-2 h-[380px]">
            <img
              src={property.images[1] || property.images[0]}
              alt="Foto 2"
              className="h-1/2 w-full object-cover cursor-pointer hover:opacity-95 transition"
            />
            <img
              src={property.images[2] || property.images[0]}
              alt="Foto 3"
              className="h-1/2 w-full object-cover cursor-pointer hover:opacity-95 transition"
            />
          </div>
          <div className="hidden md:block h-[380px]">
            <img
              src={property.images[3] || property.images[0]}
              alt="Foto 4"
              className="h-full w-full object-cover cursor-pointer hover:opacity-95 transition"
            />
          </div>
        </div>

        {/* Conteúdo Principal Layout 2 Colunas */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna da Esquerda: Detalhes do Espaço */}
          <div className="lg:col-span-2 space-y-8">
            {/* Resumo do Imóvel */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Acomodação inteira em {property.location.split(',')[0]}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                {property.maxGuests} hóspedes • {property.bedrooms} quartos • {property.beds} camas • {property.baths} banheiros
              </p>
            </div>

            {/* Destaque Anfitrião */}
            <div className="flex items-center gap-4 border-b pb-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">
                V
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hospedado por Vessel Premium</h3>
                <p className="text-xs text-gray-500">Superhost • 3 anos hospedando</p>
              </div>
            </div>

            {/* Descrição Detalhada */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Sobre este espaço</h3>
              <p className="leading-relaxed text-gray-700 whitespace-pre-line text-sm sm:text-base">
                {property.description}
              </p>
            </div>

            {/* Comodidades */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">O que este lugar oferece</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-blue-600 text-lg">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Card Flutuante de Reserva */}
          <div>
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-2xl font-black text-gray-900">
                    R$ {property.pricePerNight}
                  </span>
                  <span className="text-sm text-gray-500"> / noite</span>
                </div>
                <div className="text-xs font-bold text-gray-700">
                  ★ {property.rating}
                </div>
              </div>

              {/* Seletor Simulado de Noites */}
              <div className="mb-4 rounded-xl border border-gray-300 p-3 bg-gray-50">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  DURAÇÃO DA ESTADIA
                </label>
                <select
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
                >
                  <option value={1}>1 noite</option>
                  <option value={2}>2 noites</option>
                  <option value={3}>3 noites</option>
                  <option value={5}>5 noites</option>
                  <option value={7}>7 noites (1 semana)</option>
                </select>
              </div>

              {/* Detalhamento dos Preços */}
              <div className="space-y-2 text-sm text-gray-600 my-4 border-t pt-4">
                <div className="flex justify-between">
                  <span>R$ {property.pricePerNight} x {nights} noites</span>
                  <span>R$ {totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de serviço Vessel</span>
                  <span>R$ 0 (Grátis)</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t pt-2 text-base">
                  <span>Total</span>
                  <span>R$ {totalPrice}</span>
                </div>
              </div>

              {/* Botão Principal com Autenticação Diferida */}
              <button
                type="button"
                onClick={handleReserve}
                className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-95"
              >
                {isAuthenticated ? 'Reservar Agora' : 'Entrar para Reservar'}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Você ainda não será cobrado
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}