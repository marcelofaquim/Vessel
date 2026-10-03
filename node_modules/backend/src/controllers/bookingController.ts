import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface estendida para garantir o id do utilizador vindo do middleware de autenticação
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

interface CreateBookingInput {
  propertyId: string;
  checkIn: string; // ISO String (ex: "2026-10-15T00:00:00.000Z")
  checkOut: string;
  totalPrice: number;
}

/**
 * Cria uma nova reserva validando sobreposição de datas
 */
export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const guestId = req.user?.id;
    const { propertyId, checkIn, checkOut, totalPrice }: CreateBookingInput = req.body;

    if (!guestId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (!propertyId || !checkIn || !checkOut || !totalPrice) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);

    // Validação de datas válidas
    if (isNaN(newCheckIn.getTime()) || isNaN(newCheckOut.getTime())) {
      return res.status(400).json({ error: 'Datas em formato inválido.' });
    }

    if (newCheckIn >= newCheckOut) {
      return res.status(400).json({ error: 'A data de check-out deve ser posterior à data de check-in.' });
    }

    if (newCheckIn < new Date()) {
      return res.status(400).json({ error: 'A data de check-in não pode ser no passado.' });
    }

    // 1. Verificar se a propriedade existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: 'Acomodação não encontrada.' });
    }

    // 2. Verificar sobreposição com reservas existentes
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { not: 'CANCELLED' }, // Ignora reservas canceladas
        AND: [
          { checkIn: { lt: newCheckOut } },
          { checkOut: { gt: newCheckIn } },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(409).json({
        error: 'Acomodação indisponível para as datas selecionadas.',
      });
    }

    // 3. Persistir a reserva no banco de dados
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        guestId,
        checkIn: newCheckIn,
        checkOut: newCheckOut,
        totalPrice,
        status: 'PENDING',
      },
      include: {
        property: {
          select: {
            title: true,
            location: true,
            images: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Reserva criada com sucesso!',
      booking,
    });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a reserva.' });
  }
};

/**
 * Busca todas as reservas do utilizador autenticado
 */
export const getUserBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const guestId = req.user?.id;

    if (!guestId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        guestId,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            pricePerNight: true,
            images: true,
          },
        },
        payment: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('Erro ao buscar reservas do usuário:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar reservas.' });
  }
};