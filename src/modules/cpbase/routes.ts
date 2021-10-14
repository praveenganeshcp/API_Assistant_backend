import { Router } from 'express';
import { multerStorage } from '../../middlewares/multer';
import { requestValidator } from '../../middlewares/request-validaor';
import { cpBaseGlobal, cpbaseLogin, cpBaseStorage, createAccountCpBase, fetchCollections, fetchFileSystem, fetchObjectStats } from './controller';
import { cpBaseGlobalValidator, cpbaseSignupValidator, projectAuthValidator } from './validators';

export const cpBaseRoutes = Router();

cpBaseRoutes.post('/signup', cpbaseSignupValidator, requestValidator, createAccountCpBase);
cpBaseRoutes.post('/login', cpbaseSignupValidator, requestValidator, cpbaseLogin);
cpBaseRoutes.post('/global', cpBaseGlobalValidator, requestValidator, cpBaseGlobal);
cpBaseRoutes.get('/collections', projectAuthValidator, requestValidator, fetchCollections);
cpBaseRoutes.post('/storage', projectAuthValidator, requestValidator, multerStorage.single('file'), cpBaseStorage);
cpBaseRoutes.get('/filesystem', projectAuthValidator, requestValidator, fetchFileSystem);
cpBaseRoutes.get('/object', fetchObjectStats);