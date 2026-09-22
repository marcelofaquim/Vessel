import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';

export async function createBookingHandler(req: Request, res: Response) {
  const { userId, propertyId, checkIn, checkOut, startDate, endDate } = req.body;

  // Aceita checkIn/checkOut ou startDate/endDate
  const rawCheckIn = checkIn || startDate;
  const rawCheckOut = checkOut || endDate;

  if (!userId || !propertyId || !rawCheckIn || !rawCheckOut) {
    return res.status(400).json({ error: 'Usuário, propriedade, check-in e check-out são obrigatórios.' });
  }

  const checkInDate = new Date(rawCheckIn);
  const checkOutDate = new Date(rawCheckOut);

  // Valida se as datas são válidas
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return res.status(400).json({ error: 'Formato de data inválido.' });
  }

  // Chave de bloqueio temporário na propriedade
  const lockKey = `locks:property:${propertyId}`;
  const ttlInSeconds = 5;

  let acquiredLock = false;

  try {
    // NX = Set if Not eXists (só define a chave se ela não existir)
    // EX = Expire time em segundos
    const lockResult = await redis.set(lockKey, 'locked', 'EX', ttlInSeconds, 'NX');

    if (!lockResult) {
      return res.status(409).json({
        error: 'Outra transação está a processar uma reserva para esta propriedade. Tente novamente.',
      });
    }

    acquiredLock = true;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: 'Propriedade não encontrada.' });
    }

    // Verifica sobreposição de datas
    const existingBooking = await prisma.booking.findFirst({
      where: {
        propertyId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        OR: [
          {
            checkIn: { lte: checkOutDate },
            checkOut: { gte: checkInDate },
          },
        ],
      },
    });

    if (existingBooking) {
      return res.status(409).json({ error: 'Propriedade indisponível para estas datas.' });
    }

    // Cálculo do valor total
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = nights * Number(property.pricePerNight);

    // Criação da reserva passando diretamente os IDs (userId, propertyId)
    const booking = await prisma.booking.create({
      data: {
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        status: 'CONFIRMED',
        guestId: userId, // mapeia o userId recebido na requisição para a coluna
        propertyId,
      },
    });

    return res.status(201).json(booking);
  } catch (error: any) {
    console.error('Erro ao processar reserva:', error);
    return res.status(500).json({ error: 'Erro interno ao criar reserva.' });
  } finally {
    if (acquiredLock) {
      await redis.del(lockKey).catch(() => {});
    }
  }
}