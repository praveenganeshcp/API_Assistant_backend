import { checkSchema } from "express-validator";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";

const daoService = new DaoService();

export const createProjectValidator = checkSchema({
    name: {
        in: ['body'],
        isString: true,
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