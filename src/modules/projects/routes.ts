import { Router } from 'express';
import { requestValidator } from '../../middlewares/request-validaor';
import { createProject, fetchProjects, generateProjectAPIKey } from './controller';
import { createProjectValidator, projectAPIKeyValidator } from './validators';

export const projectRoutes = Router();

projectRoutes.post('/', createProjectValidator, requestValidator, createProject);
projectRoutes.get('/', fetchProjects);
projectRoutes.post('/generate-key', projectAPIKeyValidator, requestValidator, generateProjectAPIKey);