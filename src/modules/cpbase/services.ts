import { DbService } from "../../dao/db";

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

export const cpBaseService = {
    fetchProjectCollectionNames
}