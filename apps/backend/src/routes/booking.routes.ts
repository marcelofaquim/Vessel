import { Router } from 'express';
import { createBookingHandler, getUserBookingsHandler, cancelBookingHandler } from './booking.controller';

const bookingRoutes = Router();

bookingRoutes.post('/', createBookingHandler);
bookingRoutes.get('/user/:userId', getUserBookingsHandler);
bookingRoutes.patch('/:id/cancel', cancelBookingHandler)

export { bookingRoutes };