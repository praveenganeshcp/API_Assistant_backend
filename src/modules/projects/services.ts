import { ObjectId } from "bson";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";
import path from 'path';
import fs from 'fs';

const daoService = new DaoService();

async function createProject(userId: string, projectName: string) {
    try {
        let newProject: IProject = {
            _id: new ObjectId().toHexString(),
            user_id: userId,
            name: projectName,
            created_on: new Date(),
            updated_on: null
        }
        await daoService.insert(COLLECTIONS.PROJECTS, newProject);
        let projectStoragePath = path.join(process.cwd(), 'storage', newProject._id);
        fs.mkdirSync(projectStoragePath);
        return newProject;
    }
    catch(err) {
        console.error(err);
        throw err;
    }
}

async function fetchProjectsByUserId(userId: string) {
    try {
        let projectsCreatedByUser = await daoService.findMany<IProject>(COLLECTIONS.PROJECTS, {user_id: userId});
        return projectsCreatedByUser;
    }
    catch(err) {
        console.error(err);
        throw err;
    }
}

export const projectService = {
    createProject,
    fetchProjectsByUserId
}