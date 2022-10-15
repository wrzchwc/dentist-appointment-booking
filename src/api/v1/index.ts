import { Router } from 'express';
import { router as authRouter } from './auth';

export const api = Router();

api.use('/auth', authRouter);
