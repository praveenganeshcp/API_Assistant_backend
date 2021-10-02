import { Router } from 'express';
import { createProject } from './controller';
import { createProjectValidator } from './validators';

export const projectRoutes = Router();

projectRoutes.post('/', createProjectValidator, createProject);
