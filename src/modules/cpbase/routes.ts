import { Router } from 'express';
import { cpBaseFunction } from './controller';

export const cpBaseRoutes = Router();

cpBaseRoutes.post('/', cpBaseFunction);