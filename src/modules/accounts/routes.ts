import { Router } from 'express';
import { createAccount, loginUser } from './controller';
import { loginValidator, signupValidator } from './validators';

export const accountsRoutes = Router();

accountsRoutes.post('/signup', signupValidator, createAccount);
accountsRoutes.post('/login', loginValidator, loginUser);