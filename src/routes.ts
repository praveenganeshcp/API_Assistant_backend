import { Router } from 'express';
import { cpBaseRoutes } from './modules/cpbase/routes';
import { projectRoutes } from './modules/projects/routes';

export const appRoutes = Router();

appRoutes.use('/projects', projectRoutes);
appRoutes.use('/cpbase', cpBaseRoutes);