import { Router } from "express";
import { createUserHandler, getUsersHandler } from '../routes/user.controller';

const userRoutes = Router();

userRoutes.post('/', createUserHandler);
userRoutes.get('/', getUsersHandler);

export { userRoutes };