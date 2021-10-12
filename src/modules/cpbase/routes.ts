import { Router } from 'express';
import { multerStorage } from '../../middlewares/multer';
import { requestValidator } from '../../middlewares/request-validaor';
import { cpBaseFunction, cpbaseLogin, cpBaseStorage, createAccountCpBase, fetchCollections, fetchDirectories } from './controller';
import { cpBaseGlobalValidator, cpbaseSignupValidator, projectAuthValidator } from './validators';

export const cpBaseRoutes = Router();

cpBaseRoutes.post('/signup', cpbaseSignupValidator, requestValidator, createAccountCpBase);
cpBaseRoutes.post('/login', cpbaseSignupValidator, requestValidator, cpbaseLogin);
cpBaseRoutes.post('/global', cpBaseGlobalValidator, requestValidator, cpBaseFunction);
cpBaseRoutes.get('/collections', projectAuthValidator, requestValidator, fetchCollections);
cpBaseRoutes.post('/storage', projectAuthValidator, requestValidator, multerStorage.single('file'), cpBaseStorage);
cpBaseRoutes.get('/directories', projectAuthValidator, requestValidator, fetchDirectories);