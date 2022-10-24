import { Router } from 'express';
import { authentication } from '../../middleware';
import { getQuestions } from './appointments.controller';

export const router = Router();

router.get('/questions', authentication, getQuestions);
