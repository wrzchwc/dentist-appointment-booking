import * as controller from './appointments.controller';
import { Router } from 'express';
import { findUser } from '../../middleware/user/find-user';

export const router = Router();

router.get('/questions', controller.getQuestions);
router.post('/', findUser, controller.createAppointment);
router.patch('/:appointmentId/starts-at', controller.updateAppointmentStartDate);
router.get('/', controller.getAppointments);
