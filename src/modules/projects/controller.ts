import { Request, Response } from "express";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";
import { projectService } from "./services";

const daoService = new DaoService();

export async function createProject(request: Request, response: Response) {
    try {
        let newProject: IProject = await projectService.createProject(request.user._id, request.body.name);
        response.json({success: true, result: newProject});    
    }
    catch(err) {
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function fetchProjects(request: Request, response: Response) {
    try {
        let userId = request.user._id;
        let projectsCreatedByUser = await projectService.fetchProjectsByUserId(userId);
        response.json({success: true, result: projectsCreatedByUser});
    }
    catch(err) {
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }   
}

export async function generateProjectAPIKey(request: Request, response: Response) {
    try {
        let projectKey = await projectService.generateProjectAPIKey(request.body.projectId);
        response.json({success: true, result: projectKey})
    }
    catch(err) {
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }
}