import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import fs from 'fs';
import path from 'path';
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";

const daoService = new DaoService();

export async function createProject(request: Request, response: Response) {
    try {
        let newProject: IProject = {
            _id: new ObjectId().toHexString(),
            user_id: request.user._id as string,
            name: request.body.name,
            created_on: new Date(),
            updated_on: null
        }
        await daoService.insert(COLLECTIONS.PROJECTS, newProject);
        let projectStoragePath = path.join(process.cwd(), 'storage', newProject._id);
        fs.mkdirSync(projectStoragePath);
        response.json({success: true, result: newProject});    
    }
    catch(err) {
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function fetchProjects(request: Request, response: Response) {
    try {
        let user_id = request.user._id;
        let projectsCreatedByUser = await daoService.findMany<IProject>(COLLECTIONS.PROJECTS, {user_id});
        response.json({success: true, result: projectsCreatedByUser});
    }
    catch(err) {
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }
    
}