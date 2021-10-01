import { Request, Response } from "express";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";

const daoService = new DaoService();

export async function createProject(req: Request, response: Response) {
    let newProject: IProject = {
        _id: Date.now(),
        user_id: req.user._id as number,
        name: req.body.name,
        created_on: new Date(),
        updated_on: null
    }
    await daoService.insert(COLLECTIONS.PROJECTS, newProject);
    response.json({message: "Hello praveen", newProject});
}