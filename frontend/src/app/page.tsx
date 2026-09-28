'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export interface Property {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  images: string[];
  location: string;
  rating: number;
  reviewsCount: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  amenities: string[];
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Apartamento de Luxo com Vista para o Mar',
    description:
      'Aproveite momentos inesquecíveis neste espaço único e acolhedor. Localizado na orla de Copacabana, conta com varanda espaçosa, vista panorâmica do oceano, decoração contemporânea e acabamentos em mármore.',
    pricePerNight: 450,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop'
    ],
    location: 'Copacabana, Rio de Janeiro - RJ',
    rating: 4.95,
    reviewsCount: 128,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    amenities: ['Wi-Fi de Alta Velocidade', 'Piscina', 'Vista para o Mar', 'Ar Condicionado', 'Cozinha Completa', 'Estacionamento Grátis']
  },
  {
    id: '2',
    title: 'Chalé Aconchegante nas Montanhas de Campos do Jordão',
    description:
      'Refúgio perfeito no meio da natureza e do clima frio das montanhas. Este chalé oferece uma lareira a lenha central e deck privativo com banheira de hidromassagem.',
    pricePerNight: 620,
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800&auto=format&fit=crop'
    ],
    location: 'Campos do Jordão, São Paulo - SP',
    rating: 4.88,
    reviewsCount: 94,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    amenities: ['Lareira', 'Hidromassagem Privativa', 'Wi-Fi', 'Aquecedor', 'Estacionamento', 'Vista da Montanha']
  },
  {
    id: '3',
    title: 'Casa Modernista com Piscina Privativa em Trancoso',
    description:
      'Um paraíso tropical exclusivo no Sul da Bahia. Casa ampla com arquitetura integrada à natureza, jardim exuberante e piscina de ilha.',
    pricePerNight: 1200,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
    ],
    location: 'Trancoso, Porto Seguro - BA',
    rating: 4.98,
    reviewsCount: 67,
    maxGuests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 4,
    amenities: ['Piscina Privativa', 'Espaço Gourmet', 'Ar Condicionado', 'Perto da Praia', 'Segurança 24h']
  },
  {
    id: '4',
    title: 'Loft Industrial Minimalista na Vila Madalena',
    description:
      'Espaço moderno e estiloso no coração do bairro mais vibrante de São Paulo. Teto alto, pé direito duplo e espaço para home office.',
    pricePerNight: 310,
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop'
    ],
    location: 'Vila Madalena, São Paulo - SP',
    rating: 4.91,
    reviewsCount: 156,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    amenities: ['Espaço para Trabalho', 'Wi-Fi de Alta Velocidade', 'Smart TV', 'Academia', 'Elevador']
  },
  {
    id: '5',
    title: 'Studio Beira-Mar na Praia de Jurerê',
    description:
      'Studio reformado com pé na areia na Praia de Jurerê. Sacada integrada com churrasqueira a carvão e acesso direto ao mar.',
    pricePerNight: 380,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'
    ],
    location: 'Jurerê Internacional, Florianópolis - SC',
    rating: 4.89,
    reviewsCount: 82,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    baths: 1,
    amenities: ['Pé na Areia', 'Churrasqueira na Varanda', 'Wi-Fi', 'Ar Condicionado', 'Cadeira de Praia']
  }
];

function PropertyCard({ property, onBook }: { property: Property; onBook: (id: string) => void }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        onClick={() => router.push(`/properties/${property.id}`)}
        className="cursor-pointer"
      >
        <div className="relative h-56 w-full overflow-hidden bg-gray-200">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="h-full w-full object-cover transition duration-300"
          />

          <div className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-gray-900 backdrop-blur-sm shadow-sm flex items-center gap-1">
            ★ {property.rating}
          </div>

          {/* Botões de navegação por setas exibidos no hover */}
          {property.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-800 shadow hover:bg-white opacity-0 group-hover:opacity-100 transition"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-gray-800 shadow hover:bg-white opacity-0 group-hover:opacity-100 transition"
              >
                ›
              </button>

              {/* Indicadores de bolinhas */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {property.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 pb-2">
          <h3 className="line-clamp-1 font-bold text-gray-900 text-base group-hover:text-blue-600 transition">
            {property.title}
          </h3>
          <p className="text-xs font-medium text-gray-500 mt-1">{property.location}</p>
          <p className="mt-2 text-xs text-gray-400">
            {property.maxGuests} hóspedes • {property.bedrooms} quartos
          </p>
        </div>
      </div>

      <div className="p-4 pt-2 border-t border-gray-50 flex items-center justify-between">
        <div>
          <span className="text-lg font-black text-gray-900">
            R$ {property.pricePerNight}
          </span>
          <span className="text-xs text-gray-500"> / noite</span>
        </div>

        <button
          type="button"
          onClick={() => onBook(property.id)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition active:scale-95"
        >
          Reservar
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
  async function loadProperties() {
    try {
      const response = await api.get('/properties');
      const apiData = response.data;

      if (Array.isArray(apiData) && apiData.length > 0) {
        // Mapeia os dados do banco e complementa com as acomodações extras do MOCK
        const updatedMock = MOCK_PROPERTIES.map((mockItem, index) => {
          if (apiData[index]) {
            return {
              ...mockItem,
              id: apiData[index].id || mockItem.id,
              title: apiData[index].title || mockItem.title,
              pricePerNight: apiData[index].pricePerNight || mockItem.pricePerNight,
              location: apiData[index].location || mockItem.location,
            };
          }
          return mockItem;
        });

        setProperties(updatedMock);
      } else {
        setProperties(MOCK_PROPERTIES);
      }
    } catch {
      setProperties(MOCK_PROPERTIES);
    } finally {
      setLoading(false);
    }
  }

  loadProperties();
}, []);

  const handleBook = (propertyId: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/${propertyId}`);
      return;
    }
    router.push(`/properties/${propertyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="sticky top-0 z-50 border-b bg-white px-8 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div 
            onClick={() => router.push('/')} 
            className="flex cursor-pointer items-center gap-2 text-2xl font-black tracking-tight text-blue-600"
          >
            <span>⛵</span> Vessel
          </div>

          <div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Olá, {user?.name}</span>
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
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow hover:bg-blue-700 transition"
              >
                Entrar / Cadastrar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 py-10">
        <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-gray-900">
          Acomodações em Destaque
        </h2>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500 font-medium">Carregando ofertas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} onBook={handleBook} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}