import { Router } from 'express';
import { authenticationMiddleware } from '../../middlewares/authentication';
import { requestValidator } from '../../middlewares/request-validaor';
import { changePassword, createAccount, generateAPIKey, loginUser } from './controller';
import { changePasswordValidator, loginValidator, signupValidator } from './validators';

export const accountsRoutes = Router();

accountsRoutes.post('/signup', signupValidator, requestValidator,createAccount);
accountsRoutes.post('/login', loginValidator, requestValidator, loginUser);
accountsRoutes.post('/generate-key', authenticationMiddleware, generateAPIKey);
accountsRoutes.post('/change-password', authenticationMiddleware, changePasswordValidator, requestValidator, changePassword);