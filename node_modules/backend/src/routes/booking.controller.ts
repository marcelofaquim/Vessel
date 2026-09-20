import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { redlock } from '../../lib/redis';

export async function createBookingHandler(req: Request, res: Response) {
  const { propertyId, guestId, checkIn, checkOut, totalPrice } = req.body;

  // Recurso de bloqueio do Redlock baseado na propriedade
  const lockResource = `locks:property:${propertyId}`;
  const ttl = 5000; // Tempo de vida do lock em ms (5s)

  let lock;

  try {
    // 1. Tenta adquirir o bloqueio distribuído
    lock = await redlock.acquire([lockResource], ttl);

    // 2. Verifica se a propriedade existe
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: 'Propriedade não encontrada.' });
    }

    // 3. Checa conflito de datas na base de dados
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            checkIn: { lte: checkOutDate },
            checkOut: { gte: checkInDate },
          },
        ],
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        error: 'A propriedade já possui uma reserva confirmada ou pendente para este período.',
      });
    }

    // 4. Cria a reserva
    const booking = await prisma.booking.create({
      data: {
        propertyId,
        guestId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        status: 'PENDING',
      },
    });

    return res.status(201).json(booking);
  } catch (error: any) {
    if (error.name === 'ExecutionError') {
      return res.status(429).json({
        error: 'Alta demanda para esta propriedade. Tente novamente em instantes.',
      });
    }

    console.error('Erro ao processar reserva:', error);
    return res.status(500).json({ error: 'Erro interno ao criar reserva.' });
  } finally {
    // 5. Liberta o bloqueio se tiver sido adquirido
    if (lock) {
      await lock.release().catch(() => {});
    }
  }
}