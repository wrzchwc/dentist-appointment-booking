import * as controller from './services.controller';
import { Router } from 'express';

export const router = Router();

router.get('/', controller.getServices);
