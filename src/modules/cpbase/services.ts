import { DbService } from "../../dao/db";
import fsPromise from 'fs/promises';
import path from 'path';
import { ObjectId } from "mongodb";
import { UtilityService } from "../../services/utility.service";

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

export async function executeQueries(projectId: string, collectionName: string, action: string, data: any) {
    try {
        let { db, closeConnection } = await createDBConnection(projectId);
        try {
            const collection = db.collection(collectionName);
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
            
            closeConnection();
            return result;
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

export async function createAccount(projectId: string, userData: any) {
    try {
        let { db, closeConnection } = await createDBConnection(projectId);
        try {
            let collection = db.collection('users');
            let existingMailId = await collection.findOne({mailId: userData.mailId});
            if(existingMailId) {
                throw {existingMailId: "MailId already registered"};
            }
            userData.hashed_password = await UtilityService.createPasswordHash(userData.password);
            delete userData.password;
            await collection.insertOne(userData);
            closeConnection();
            return userData;
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

export const cpBaseService = {
    fetchProjectCollectionNames,
    fetchFileSystem,
    executeQueries,
    createAccount
}