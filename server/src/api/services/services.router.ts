import { Router } from 'express';
import { authentication } from '../../middleware';
import { getServices } from './services.controller';

export const router = Router();
router.get('/', authentication, getServices);
