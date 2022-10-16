import { Router } from 'express';
import { router as authRouter } from './auth/auth.router';

export const api = Router();

api.use('/auth', authRouter);
