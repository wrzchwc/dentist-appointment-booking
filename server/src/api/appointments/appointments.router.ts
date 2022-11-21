import * as controller from './appointments.controller';
import { Router } from 'express';

export const router = Router();

router.get('/questions', controller.getQuestions);
router.post('/', controller.createAppointment);
router.patch('/:appointmentId/starts-at', controller.updateAppointmentStartDate);
router.get('/', controller.getAppointments);
router.get('/me', controller.getClientAppointments);
router.get('/available-dates', controller.getAvailableDates);
