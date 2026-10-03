import { Router } from 'express';
import { createBooking, getUserBookings }  from '../controllers/bookingController';
import { ensureAuthenticated}  from '../middlewares/auth.middleware';

const router = Router();

//Rota protegida: exige usuário autenticado
router.post('/bookings', ensureAuthenticated, createBooking)

//Rota para listar as reservas do usuario logado
router.post('/booking/me', ensureAuthenticated, getUserBookings)
export default router;
