import { getQuestions, getServices } from './appointments.controller';
import { Router } from 'express';
import { authentication } from '../../middleware';

export const router = Router();

router.get('/questions', authentication, getQuestions);
router.get('/services', getServices);
