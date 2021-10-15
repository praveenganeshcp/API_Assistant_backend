import { Request, Response } from "express";
import { MongoServerError, ObjectId } from "mongodb";
import { DbService } from "../../dao/db";
import { ICpBaseRequest } from "../../models/base-request";
import { UtilityService } from "../../services/utility.service";
import { cpBaseService } from "./services";

export async function createAccountCpBase(req: Request, response: Response) {
    try {
        let projectId = req.headers['project_auth'] as string;
        let user = req.body.user;
        let result = await cpBaseService.createAccount(projectId, user);
        response.status(201).json({success: true, result});
    }
    catch(err: any) {
        console.error(err);
        if(err.existingMailId) {
            response.status(400).json({success: false, message: err.existingMailId});
            return;
        }
        response.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function cpbaseLogin(req: Request, res: Response) {
    try {
        let project_id = req.headers['project_auth'];
        let client = await DbService.getClient();
        let db = client.db('project-'+project_id);

        let user = req.body.user;
        let { mailId, password } = user;

        let collection = db.collection('users');
        let existingUser = await collection.findOne({mailId});
        if(!existingUser) {
            res.status(400).json({success: false, message: "MailId not registered"});
            client.close();
            console.log('connection closed');
            return;
        }
        let isPasswordSame = await UtilityService.verifyPasswordHash(password, existingUser.hashed_password);
        if(isPasswordSame == false) {
            res.status(400).json({success: false, message: "Incorrect password"});
            client.close();
            console.log('connection closed');
            return;
        }
        res.json({success: true, result: existingUser});
        client.close();
        console.log('connection closed');
    }
    catch(err) {
        console.error(err);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function cpBaseGlobal(req: Request, response: Response) {
    try {
        let projectId = req.headers['project_auth'] as string;
        const { collectionName, action, data } = req.body as ICpBaseRequest;
        let result = await cpBaseService.executeQueries(projectId, collectionName, action, data);
        response.json({success: true, result});   
    }
    catch(err) {
        console.error(err);
        if(err instanceof MongoServerError) {
            response.status(400).json({success: false, message: err.message});
            return;
        }
        response.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function fetchCollections(request: Request, response: Response) {
    try {
        let projectId = request.headers['project_auth'] as string;
        const collectionNames = await cpBaseService.fetchProjectCollectionNames(projectId);
        response.json({success: true, result: collectionNames});
    }
    catch(err) {
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function cpBaseStorage(request: Request, response: Response) {
    response.status(201).json({success: true, path: request.file?.path})
}

export async function fetchFileSystem(request: Request, response: Response) {
    try {
        let requestedPath = request.query.path as string;
        let projectId = request.headers['project_auth'] as string;
        let result = await cpBaseService.fetchFileSystem(projectId, requestedPath);
        response.json({success: true, result})
    }
    catch(err: any) {
        if(err.code == 'ENOENT') {
            response.status(400).json({success: false, message: "Requested path does not exists in the filesystem"});
            return;
        }
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function fetchObjectStats(req: Request, res: Response) {
    try {
        let projectId: string = req.headers['project_auth'] as string;
        let objectPath = req.query.path as string;
        let result = await cpBaseService.fetchObjectStat(projectId, objectPath);
        res.json({success: true, result});
    }
    catch(err: any) {
        console.error(err);
        if(err.errMsg) {
            res.status(400).json({success: false, result: "Object path does not exists"});
            return;
        }
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function createDirectory(req: Request, res: Response) {
    try {
        let projectId: string = req.headers['project_auth'] as string;
        let { rootPath, dirName } = req.body;
        await cpBaseService.createDirectory(projectId, rootPath, dirName);
        res.json({success: true, result: "Directory created successfully"});
    }
    catch(err: any) {
        if(err.errMsg) {
            res.status(400).json({success: false, result: err.errMsg});
            return;
        }
        console.error(err);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function removeObject(req: Request, res: Response) {
    try {
        let projectId: string = req.headers['project_auth'] as string;
        let path = req.query.path as string;
        await cpBaseService.removeObject(projectId, path);
        res.json({success: true, result: "Removed successfully"});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}