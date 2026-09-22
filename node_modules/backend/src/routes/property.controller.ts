import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma';

export async function createPropertyHandler(req: Request, res: Response) {
  try {
    const { title, description, pricePerNight, location, maxGuests, hostId } = req.body;

    if (!title || !pricePerNight || !hostId) {
      return res.status(400).json({ error: 'Título, preço por noite e hostId são obrigatórios.' });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description,
        pricePerNight: Number(pricePerNight),
        location,
        maxGuests: Number(maxGuests) || 1, // Campo obrigatório exigido pelo schema
        host: {
          connect: { id: hostId }, // Conecta ao modelo User pelo ID
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
    const properties = await prisma.property.findMany();
    return res.json(properties);
  } catch (error) {
    console.error('Erro ao buscar propriedades:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar propriedades.' });
  }

} 

  export async function getPropertyAvailabilityHandler(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const property = await prisma.property.findUnique({
        where: { id },
      });

      if (!property) {
        return res.status(404).json({ error: 'Pripriedade não encontrada.' });
      }

      //Procura reservas ativas
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
      console.error('Erro ao buscar disponibilidade', error);
      return res.status(500).json({ error: 'Erro interno ao consultar disponibilidade.'});
    }
    
  }
