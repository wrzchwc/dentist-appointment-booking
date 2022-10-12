import { Router } from 'express';
import authRouter from './auth/auth.router';

const apiV1 = Router();

apiV1.use('/auth', authRouter);

export default apiV1;
