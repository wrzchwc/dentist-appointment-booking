import { Router } from 'express';
import { router as authRouter } from './auth/auth.router';
import { router as usersRouter } from './users/users.router';

export const api = Router();

api.use('/auth', authRouter);
api.use('/users', usersRouter);
