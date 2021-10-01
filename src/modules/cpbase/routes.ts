import { Router } from 'express';
import { multerStorage } from '../../middlewares/multer';
import { cpBaseFunction, cpBaseStorage } from './controller';
import { cpBaseGlobalValidator } from './validators';

export const cpBaseRoutes = Router();

cpBaseRoutes.post('/global', cpBaseGlobalValidator, cpBaseFunction);
cpBaseRoutes.post('/storage', multerStorage.single('file'), cpBaseStorage);