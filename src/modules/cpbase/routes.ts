import { Router } from 'express';
import { multerStorage } from '../../middlewares/multer';
import { cpBaseFunction, cpBaseStorage, fetchCollections } from './controller';
import { cpBaseGlobalValidator, fetchCollectionsValidator } from './validators';

export const cpBaseRoutes = Router();

cpBaseRoutes.post('/global', cpBaseGlobalValidator, cpBaseFunction);
cpBaseRoutes.get('/collections', fetchCollectionsValidator, fetchCollections)
cpBaseRoutes.post('/storage', multerStorage.single('file'), cpBaseStorage);