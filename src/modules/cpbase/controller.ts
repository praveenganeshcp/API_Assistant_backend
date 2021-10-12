import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { MongoServerError, ObjectId } from "mongodb";
import { DaoService } from "../../dao/dao";
import { DbService } from "../../dao/db";
import { ICpBaseRequest } from "../../models/base-request";
import fs from 'fs/promises';
import path from 'path';
import { UtilityService } from "../../services/utility.service";
import { cpBaseService } from "./services";

export async function createAccountCpBase(req: Request, response: Response) {
    try {
        let project_id = req.headers['project_auth'];
        let client = await DbService.getClient();
        let db = client.db('project-'+project_id);
        let collection = db.collection('users');
        let user = req.body.user;
        let existingMailId = await collection.findOne({mailId: user.mailId});
        if(existingMailId) {
            response.status(400).json({success: false, messsage: "MailId already registered"});
            console.log('connection closed');
            client.close();
            return;
        }
        user.hashed_password = await UtilityService.createPasswordHash(user.password);
        delete user.password;
        await collection.insertOne(user);
        client.close();
        console.log('connection closed');
        response.status(201).json({success: true, result: user});
    }
    catch(err) {
        console.error(err);
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

export async function cpBaseFunction(req: Request, response: Response) {
    try {
    
        let project_id = req.headers['project_auth'];

        let client = await DbService.getClient();
        let db = client.db('project-'+project_id);

        const { collectionName, action, data } = req.body as ICpBaseRequest;
        let collection = db.collection(collectionName);

        let result;

        // find and fineOne  
        if(action == 'findOne') {
            console.log('Running findOne operation ...');
            console.log(JSON.stringify(data, undefined, 3));
            result = await collection[action](data);
        }
        else if(action == 'find') {
            console.log('Running findMany operation ...');
            console.log(JSON.stringify(data, undefined, 3));
            result = await collection[action](data).toArray();
        }

        // insertOne and many
        else if(action == 'insertOne') {
            data['_id'] = new ObjectId().toHexString();
            console.log('Running insertOne operation ...');
            console.log(JSON.stringify(data, undefined, 3));
            result = await collection[action](data);
        }
        else if(action == 'insertMany') {
            data.forEach((record: any) => {
                record['_id'] = new ObjectId().toHexString();
            })
            console.log('Running insertMany operation ...');
            console.log(JSON.stringify(data, undefined, 3));
            result = await collection[action](data);
        }

        // update one and many
        else if(action == 'updateOne') {
            console.log('Running updateOne operation ...');
            console.log(JSON.stringify(data, undefined, 3));
            result = await collection[action](data.filter, data.update);
        }
        else if(action == 'updateMany') {
            console.log('Running updateMany operation ...');
            console.log(JSON.stringify(data, undefined, 3));
            result = await collection[action](data.filter, data.update);
        }

        // aggregate
        else if(action == 'aggregate') {
            console.log('Running aggregate operation ...');
            console.log(JSON.stringify(data, undefined, 3));
            result = await collection[action](data).toArray();
        }

        // delete one and many options
        else if(action == 'deleteOne') {
            console.log('Running deleteOne operation ...');
            console.log(JSON.stringify(data, undefined, 3));
            result = await collection[action](data);
        }
        else if(action == 'deleteMany') {
            console.log('Running deleteMany operation ...');
            console.log(JSON.stringify(data, undefined, 3));
            result = await collection[action](data);
        }

        client.close();
        console.log('DB connection closed');
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
        let project_auth = request.headers['project_auth'] as string;
        const collectionNames = await cpBaseService.fetchProjectCollectionNames(project_auth);
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

export async function fetchDirectories(request: Request, response: Response) {
    try {
        let requestedPath = request.query.path as string;
        if(!requestedPath) {
            requestedPath = '/';
        }
        let project_id = request.headers['project_auth'] as string;
        let currentPath = path.join(process.cwd(), 'storage', project_id, ...requestedPath.split('/'));
        let result = await (await fs.readdir(currentPath, {withFileTypes: true})).map(result => ({name: result.name, isFile: result.isFile()}));
        response.json({success: true, result})
    }
    catch(err) {
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }
}