import * as controller from './appointments.controller';
import { Router } from 'express';
import { authorisation } from '../../middleware';

export const router = Router();

router.get('/available-dates', controller.getAvailableDates);
router.get('/questions', controller.getQuestions);
router.get('/me/:appointmentId', controller.getClientAppointment);
router.delete('/me/:appointmentId', controller.deleteClientAppointment);
router.get('/me', controller.getClientAppointments);
router.patch('/:appointmentId', controller.updateAppointment);
router.get('/:appointmentId', authorisation, controller.getAppointment);
router.delete('/:appointmentId', authorisation, controller.deleteAppointment);
router.get('/', authorisation, controller.getAppointments);
router.post('/', controller.createAppointment);
