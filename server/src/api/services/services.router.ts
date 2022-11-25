import * as controller from './services.controller';
import { Router } from 'express';
import { authorisation } from '../../middleware';

export const router = Router();

router.patch('/:serviceId', controller.updateService);
router.get('/', authorisation, controller.getServices);
