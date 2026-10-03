import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export async function createPropertyHandler(req: Request, res: Response) {
  try {
    const { title, description, pricePerNight, location, maxGuests, hostId, images } = req.body;

    if (!title || !pricePerNight || !hostId) {
      return res.status(400).json({ error: 'Título, preço por noite e hostId são obrigatórios.' });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        pricePerNight: Number(pricePerNight),
        location,
        maxGuests: Number(maxGuests) || 1,
        // Garante que images é gravado (passa um array vazio por omissão se não for fornecido)
        images: Array.isArray(images) ? images : [],
        host: {
          connect: { id: hostId },
        },
      },
    });

    return res.status(201).json(property);
  } catch (error) {
    console.error('Erro ao criar propriedade:', error);
    return res.status(500).json({ error: 'Erro interno ao criar propriedade.' });
  }
}

export async function getPropertiesHandler(req: Request, res: Response) {
try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ message: 'Imóvel não encontrado.' });
    }

    return res.json(property);
  } catch (error) {
    console.error('Erro ao buscar imóvel por ID:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}

export async function getPropertyAvailabilityHandler(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ error: 'Propriedade não encontrada.' });
    }

    // Procura reservas ativas
    const bookings = await prisma.booking.findMany({
      where: {
        propertyId: id,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
      },
      orderBy: {
        checkIn: 'asc',
      },
    });

    return res.status(200).json({
      propertyId: id,
      busyRanges: bookings.map((b) => ({
        bookingId: b.id,
        checkIn: b.checkIn,
        checkOut: b.checkOut,
      })),
    });
  } catch (error) {
    console.error('Erro ao buscar disponibilidade:', error);
    return res.status(500).json({ error: 'Erro interno ao consultar disponibilidade.' });
  }
}

export async function getPropertyByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if(!id || id === 'undefined') {
      return res.status(400).json({ message: 'ID da propriedade é obrigatório '})
    }
    
    // Busca imóvel pelo ID utilizando o Prisma
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return res.status(404).json({ message: 'Imóvel não encontrado.' });
    }

    return res.json(property);
  } catch (error) {
    console.error('Erro ao buscar imóvel por ID:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}