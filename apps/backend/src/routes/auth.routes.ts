import { Router } from 'express';
import { loginHandler } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../schemas/auth.schema';

const authRoutes = Router();

authRoutes.post('/login', validate(loginSchema), loginHandler);

export { authRoutes};