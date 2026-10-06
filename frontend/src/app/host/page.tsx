'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface HostProperty {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  maxGuests: number;
  images: string[];
}

export default function HostDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do formulário de novo imóvel
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [maxGuests, setMaxGuests] = useState('2');
  const [imageUrl, setImageUrl] = useState('');

  // Inicialização Lazy do estado a partir do localStorage (evita renders em cascata e duplicação)
  const [properties, setProperties] = useState<HostProperty[]>(() => {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem('vessel_host_properties');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }

    // Dados iniciais de exemplo se não houver nada no localStorage
    const initial: HostProperty[] = [
      {
        id: 'host_1',
        title: 'Acomodação de Teste do Anfitrião',
        location: 'São Paulo - SP',
        pricePerNight: 350,
        maxGuests: 4,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800'],
      },
    ];
    localStorage.setItem('vessel_host_properties', JSON.stringify(initial));
    return initial;
  });

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !location || !pricePerNight) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newProperty: HostProperty = {
      id: 'prop_' + Date.now(),
      title,
      location,
      pricePerNight: Number(pricePerNight),
      maxGuests: Number(maxGuests),
      images: [imageUrl || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800'],
    };

    const updated = [newProperty, ...properties];
    setProperties(updated);
    localStorage.setItem('vessel_host_properties', JSON.stringify(updated));

    // Resetar formulário e fechar modal
    setTitle('');
    setLocation('');
    setPricePerNight('');
    setMaxGuests('2');
    setImageUrl('');
    setIsModalOpen(false);
  };

  const handleDeleteProperty = (id: string) => {
    if (!confirm('Tem a certeza de que deseja remover este anúncio?')) return;
    const updated = properties.filter((p) => p.id !== id);
    setProperties(updated);
    localStorage.setItem('vessel_host_properties', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div
            onClick={() => router.push('/')}
            className="flex cursor-pointer items-center gap-2 text-2xl font-black text-blue-600"
          >
            <span>⛵</span> Vessel <span className="text-xs rounded-full bg-blue-100 px-2 py-1 text-blue-700 font-bold">Anfitrião</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition"
            >
              Modo Viajante
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Painel do Anfitrião</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie os seus anúncios e acompanhe os seus rendimentos.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition"
          >
            + Anunciar Novo Imóvel
          </button>
        </div>

        {/* Módulos de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase text-gray-400">Anúncios Ativos</p>
            <p className="text-3xl font-black text-gray-900 mt-2">{properties.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase text-gray-400">Reservas Recebidas</p>
            <p className="text-3xl font-black text-blue-600 mt-2">3</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase text-gray-400">Faturação Estimada</p>
            <p className="text-3xl font-black text-emerald-600 mt-2">R$ 4.250,00</p>
          </div>
        </div>

        {/* Lista de Imóveis Anunciados */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Os Seus Imóveis Anunciados</h2>

        {properties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-500 font-medium">Ainda não tem nenhum imóvel anunciado.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
            >
              Criar o Primeiro Anúncio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg">{property.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">📍 {property.location}</p>
                    <div className="mt-4 flex items-baseline justify-between">
                      <span className="text-xl font-black text-gray-900">R$ {property.pricePerNight} <span className="text-xs font-normal text-gray-500">/ noite</span></span>
                      <span className="text-xs font-semibold text-gray-500">👥 Até {property.maxGuests} hóspedes</span>
                    </div>
                  </div>
                </div>
                <div className="border-t px-5 py-3 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="text-xs font-bold text-red-600 hover:text-red-800 transition"
                  >
                    Remover Anúncio
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal para Adicionar Novo Imóvel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Anunciar Novo Imóvel</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500">Título do Anúncio</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Casa com Vista para a Marina"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500">Localização</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Angra dos Reis - RJ"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500">Preço por Noite (R$)</label>
                  <input
                    type="number"
                    required
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    placeholder="500"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500">Máx. Hóspedes</label>
                  <input
                    type="number"
                    required
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    placeholder="4"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500">URL da Imagem</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700"
                >
                  Salvar Anúncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}