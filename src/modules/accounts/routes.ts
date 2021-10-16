import { Router } from 'express';
import { authenticationMiddleware } from '../../middlewares/authentication';
import { requestValidator } from '../../middlewares/request-validaor';
import { createAccount, generateAPIKey, loginUser } from './controller';
import { loginValidator, signupValidator } from './validators';

export const accountsRoutes = Router();

accountsRoutes.post('/signup', signupValidator, requestValidator,createAccount);
accountsRoutes.post('/login', loginValidator, requestValidator, loginUser);
accountsRoutes.post('/generate-key', authenticationMiddleware, generateAPIKey)