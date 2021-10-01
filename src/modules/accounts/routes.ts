import { Router } from 'express';
import { createAccount } from './controller';
import { signupValidator } from './validators';

export const accountsRoutes = Router();

accountsRoutes.post('/signup', signupValidator, createAccount);