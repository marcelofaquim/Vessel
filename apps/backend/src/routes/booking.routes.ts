import { Router } from 'express';
import { createBookingHandler } from './booking.controller';

const bookingRoutes = Router();

bookingRoutes.post('/', createBookingHandler);

export { bookingRoutes };