import { Router } from 'express';
import { multerStorage } from '../../middlewares/multer';
import { requestValidator } from '../../middlewares/request-validaor';
import { cpBaseGlobal, cpbaseLogin, cpBaseStorage, createAccountCpBase, createDirectory, fetchCollections, fetchFileSystem, fetchObjectStats, removeObject } from './controller';
import { cpBaseGlobalValidator, cpbaseSignupValidator, createDirectoryValidator, fileStatValidator, projectAuthValidator } from './validators';

export const cpBaseRoutes = Router();

cpBaseRoutes.post('/signup', cpbaseSignupValidator, requestValidator, createAccountCpBase);
cpBaseRoutes.post('/login', cpbaseSignupValidator, requestValidator, cpbaseLogin);
cpBaseRoutes.post('/global', cpBaseGlobalValidator, requestValidator, cpBaseGlobal);
cpBaseRoutes.get('/collections', projectAuthValidator, requestValidator, fetchCollections);
cpBaseRoutes.post('/storage', projectAuthValidator, requestValidator, multerStorage.single('file'), cpBaseStorage);
cpBaseRoutes.get('/filesystem', projectAuthValidator, requestValidator, fetchFileSystem);
cpBaseRoutes.get('/object', fileStatValidator, requestValidator, fetchObjectStats);
cpBaseRoutes.post('/object', createDirectoryValidator, requestValidator, createDirectory);
cpBaseRoutes.delete('/object', projectAuthValidator, requestValidator, removeObject);
