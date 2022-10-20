import { Router } from 'express';
import { authentication } from '../../../middleware';
import { getMe } from './users.controller';

export const router = Router();

router.get('/me', authentication, getMe);
