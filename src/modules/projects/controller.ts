import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";

const daoService = new DaoService();

export async function createProject(request: Request, response: Response) {
    try {
        let validationErrors = validationResult(request);
        if(validationErrors.isEmpty()) {
            let newProject: IProject = {
                _id: new ObjectId().toHexString(),
                user_id: request.user._id as string,
                name: request.body.name,
                created_on: new Date(),
                updated_on: null
            }
            await daoService.insert(COLLECTIONS.PROJECTS, newProject);
            response.json({success: true, result: newProject});    
        }
        else {
            response.status(400).json({success: false, message: validationErrors});
        }
    }
    catch(err) {
        response.status(500).json({success: false, message: "Internal server error"});
    }
    
}