import { Router } from 'express';
import { multerStorage } from '../../middlewares/multer';
import { requestValidator } from '../../middlewares/request-validaor';
import { cpBaseFunction, cpBaseStorage, fetchCollections, fetchDirectories } from './controller';
import { cpBaseGlobalValidator, fetchCollectionsValidator, fetchDirectoriesValidator } from './validators';

export const cpBaseRoutes = Router();

cpBaseRoutes.post('/global', cpBaseGlobalValidator, requestValidator, cpBaseFunction);
cpBaseRoutes.get('/collections', fetchCollectionsValidator, fetchCollections);
cpBaseRoutes.post('/storage', multerStorage.single('file'), cpBaseStorage);
cpBaseRoutes.get('/directories', fetchDirectoriesValidator, fetchDirectories);