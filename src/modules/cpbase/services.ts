import { DbService } from "../../dao/db";
import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';

async function createDBConnection(projectId: string) {
    try {
        let dbName = 'project-'+ projectId;
        const dbClient = await DbService.getClient();
        const db = dbClient.db(dbName);
        return {
            db, 
            closeConnection: () => {dbClient.close(); console.log('connection closed '+projectId);},
        }
    }
    catch(err) {
        console.error(err);
        throw err;
    }
}

async function fetchProjectCollectionNames(projectId: string) {
    try {
        let { db, closeConnection  } = await createDBConnection(projectId);
        try {
            let collectionNames = await (await db.listCollections().toArray()).map(collection => collection.name);
            closeConnection();
            return collectionNames;
        }
        catch(err) {    
            closeConnection();
            throw err;
        }
    }
    catch(err) {
        console.error(err);
        throw err;
    }
}

async function fetchFileSystem(projectId: string, requestedPath: string) {
    try {
        if(!requestedPath) {
            requestedPath = '/';
        }
        let currentPath = path.join(process.cwd(), 'storage', projectId, ...requestedPath.split('/'));
        let result = await (await fsPromise.readdir(currentPath, {withFileTypes: true})).map(result => ({name: result.name, isFile: result.isFile()}));
        return result;
    }
    catch(err) {
        console.error(err);
        throw err;
    }
}

export const cpBaseService = {
    fetchProjectCollectionNames,
    fetchFileSystem
}