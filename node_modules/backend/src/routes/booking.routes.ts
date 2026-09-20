import { Router } from 'express';
import { createBookingHandler } from './booking.controller';

const bookingROutes = Router();

bookingROutes.post('/', createBookingHandler);

export { bookingROutes };