import * as controller from './appointments.controller';
import { Router } from 'express';
import { findUser } from '../../middleware/user/find-user';

export const router = Router();

router.get('/questions', controller.getQuestions);
router.delete('/:appointmentId/services/:serviceId', controller.removeServiceFromAppointment);
router.post('/:appointmentId/services', controller.addServiceToAppointment);
router.post('/', findUser, controller.createAppointment);
router.delete('/:appointmentId/facts/:factId', controller.removeFactFromAppointment);
router.post('/:appointmentId/facts', controller.addFactToAppointment);
router.patch('/:appointmentId/starts-at', controller.updateAppointmentStartDate);
router.patch('/:appointmentId/confirm', controller.updateAppointmentConfirmedStatus);
