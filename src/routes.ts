import { Router } from 'express';
import { projectRoutes } from './modules/projects/routes';

export const appRoutes = Router();

appRoutes.use('/projects', projectRoutes);