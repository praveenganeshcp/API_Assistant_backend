import { Router } from 'express';
import { authenticationMiddleware } from './middlewares/authentication';
import { accountsRoutes } from './modules/accounts/routes';
import { cpBaseRoutes } from './modules/cpbase/routes';
import { projectRoutes } from './modules/projects/routes';

export const appRoutes = Router();

appRoutes.use('/projects', authenticationMiddleware, projectRoutes);
appRoutes.use('/cpbase', cpBaseRoutes);
appRoutes.use('/accounts', accountsRoutes);