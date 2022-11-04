import { createAppointment, getQuestions, getServices } from './appointments.controller';
import { Router } from 'express';
import { authentication } from '../../middleware';
import { findUser } from '../../middleware/user/find-user';

export const router = Router();

router.get('/questions', authentication, getQuestions);
router.get('/services', getServices);
router.post('/', authentication, findUser, createAppointment);
