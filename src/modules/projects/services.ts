import { ObjectId } from "bson";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";
import path from 'path';
import fs from 'fs';
import { IProjectKey } from "../../models/project-key";
import { randomBytes } from 'crypto';

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
        await generateProjectAPIKey(newProject._id);
        return newProject;
    }
    catch(err) {
        console.error(err);
        throw err;
    }
}

async function fetchProjectsByUserId(userId: string) {
    try {
        let projectsCreatedByUser = await daoService.aggregate<IProject>(COLLECTIONS.PROJECTS, [
            {$match:{user_id: userId}},
            {$lookup:{localField: '_id', foreignField: 'project_id', from: 'project_keys', as:'auth'}},
            {$addFields: {authObj: {$first:"$auth"}}},
            {$addFields: {token:"$authObj.token"}},
            {$project: {token:1, name:1, created_on:1}}
        ]);
        return projectsCreatedByUser;
    }
    catch(err) {
        console.error(err);
        throw err;
    }
}

async function generateProjectToken(): Promise<string> {
    return new Promise((resolve, reject) => {
        randomBytes(48, function(err, buffer) {
            if(err) {
                reject(err);
                return;
            }
            resolve(buffer.toString('hex'));
        });
    })
}

async function generateProjectAPIKey(projectId: string) {
    try {
        let hashedKey = await generateProjectToken();
        let tokenObj: Partial<IProjectKey> = {
            project_id: projectId,
            token: hashedKey,
            created_on: new Date(),
        }
        await daoService.updateOne<IProjectKey>(COLLECTIONS.PROJECTKEYS, {project_id: projectId}, {
            $set: tokenObj
        }, {upsert: true});
        return hashedKey;
    }
    catch(err) {
        console.error(err);        
    }
}

export const projectService = {
    createProject,
    fetchProjectsByUserId,
    generateProjectAPIKey
}