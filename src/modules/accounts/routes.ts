import { Router } from 'express';
import { requestValidator } from '../../middlewares/request-validaor';
import { createAccount, loginUser } from './controller';
import { loginValidator, signupValidator } from './validators';

export const accountsRoutes = Router();

accountsRoutes.post('/signup', signupValidator, requestValidator,createAccount);
accountsRoutes.post('/login', loginValidator, requestValidator, loginUser);