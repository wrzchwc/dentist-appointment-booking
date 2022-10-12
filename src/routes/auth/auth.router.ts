import { Router } from 'express';
import authGoogleRouter from '../auth-google/auth-google.router';
import { signOut } from './auth.controller';

const authRouter = Router();

authRouter.use('/google', authGoogleRouter);
authRouter.get('/sign-out', signOut);

export default authRouter;
