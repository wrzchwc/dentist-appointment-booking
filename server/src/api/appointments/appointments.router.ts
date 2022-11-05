import * as controller from './appointments.controller';
import { Router } from 'express';
import { authentication } from '../../middleware';
import { findUser } from '../../middleware/user/find-user';

export const router = Router();

router.get('/questions', authentication, controller.getQuestions);
router.get('/services', controller.getServices);
router.delete('/:appointmentId/services/:serviceId', authentication, controller.removeServiceFromAppointment);
router.post('/:appointmentId/services', authentication, controller.addServiceToAppointment);
router.post('/', authentication, findUser, controller.createAppointment);
