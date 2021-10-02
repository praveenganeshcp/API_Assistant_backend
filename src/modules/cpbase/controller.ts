import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { MongoServerError, ObjectId } from "mongodb";
import { DaoService } from "../../dao/dao";
import { DbService } from "../../dao/db";
import { ICpBaseRequest } from "../../models/base-request";
import fs from 'fs/promises';
import path from 'path';

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
        let validationErrors = validationResult(request);
        if(validationErrors.isEmpty()) {
            let project_auth = request.headers['project_auth'];
            let dbName = 'project-'+project_auth;
            const dbClient = await DbService.getClient();
            console.log('New client created');
            const db = dbClient.db(dbName);
            let collectionNames = await (await db.listCollections().toArray()).map(collection => collection.name);
            dbClient.close();
            console.log('connection closed');
            response.json({success: true, result: collectionNames});
        }
        else {
            response.status(400).json({success: false, message: validationErrors});
        }
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
        let validationErrors = validationResult(request);
        if(!validationErrors.isEmpty()) {
            response.status(400).json({success: false, message: validationErrors});
            return;
        }
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