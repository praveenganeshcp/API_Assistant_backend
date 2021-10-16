import { Request } from "express";
import { checkSchema } from "express-validator";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";

const daoService = new DaoService();

const throwIfProjectIdInvalid = async (userId: string, projectId: string) => {
    let project = await daoService.find<IProject>(COLLECTIONS.PROJECTS, {user_id: userId, _id: projectId});
    if(project == null) {
        return Promise.reject('Invalid projectId in request body');
    }
    return Promise.resolve();
}

export const createProjectValidator = checkSchema({
    name: {
        in: ['body'],
        isString: {
            negated: false,
            errorMessage: 'Project name must be a string'
        },
        custom: {
            options: async (value: string) => {
                let project = await daoService.find<IProject>(COLLECTIONS.PROJECTS, {name: value});
                if(project) {
                    return Promise.reject('Project name is already exists');
                }
                return Promise.resolve();
            }
        }
    }
})

export const projectAPIKeyValidator = checkSchema({
    projectId: {
        in: ['body'],
        errorMessage: "Invalid projectId value",
        custom: {
            options: (projectId: string, {req}) => {
                let user = (req as Request).user;
                return throwIfProjectIdInvalid(user._id, projectId);
            }
        }
    }
})