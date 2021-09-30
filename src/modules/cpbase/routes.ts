import { Router } from 'express';
import { multerStorage } from '../../middlewares/multer';
import { cpBaseFunction, cpBaseStorage } from './controller';

export const cpBaseRoutes = Router();

cpBaseRoutes.post('/', cpBaseFunction);
cpBaseRoutes.post('/storage', multerStorage.single('file'), cpBaseStorage);