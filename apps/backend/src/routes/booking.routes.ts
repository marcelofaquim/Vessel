import { Router } from 'express';
import { createBookingHandler, getUserBookingsHandler, cancelBookingHandler } from './booking.controller';
import { validate } from '../middlewares/validate.middleware';
import { createBookingSchema } from '../schemas/booking.schemas';

const bookingRoutes = Router();

bookingRoutes.post('/', validate(createBookingSchema), createBookingHandler);
bookingRoutes.get('/user/:userId', getUserBookingsHandler);
bookingRoutes.patch('/:id/cancel', cancelBookingHandler)

export { bookingRoutes };