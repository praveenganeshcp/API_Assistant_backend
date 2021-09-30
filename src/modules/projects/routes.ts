import { Router } from 'express';
import { createProject } from './controller';

export const projectRoutes = Router();

projectRoutes.post('/', createProject);
