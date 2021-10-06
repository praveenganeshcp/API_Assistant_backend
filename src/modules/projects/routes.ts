import { Router } from 'express';
import { requestValidator } from '../../middlewares/request-validaor';
import { createProject, fetchProjects } from './controller';
import { createProjectValidator } from './validators';

export const projectRoutes = Router();

projectRoutes.post('/', createProjectValidator, requestValidator, createProject);
projectRoutes.get('/', fetchProjects)
