import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    userId: z.string().uuid({ message: 'userId deve ser um UUID válido' }),
    propertyId: z.string().uuid({ message: 'propertyId deve ser um UUID válido' }),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
  }).refine((data) => {
    const start = new Date(data.checkIn || data.startDate || '');
    const end = new Date(data.checkOut || data.endDate || '');
    return !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start;
  }, {
    message: 'A data de check-out deve ser posterior à data de check-in.',
    path: ['checkOut'],
  }),
});