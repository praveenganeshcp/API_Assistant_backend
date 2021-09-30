import { Request, Response } from "express";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { DbService } from "../../dao/db";
import { ICpBaseRequest } from "../../models/base-request";
import { IProject } from "../../models/project";
const daoService = new DaoService();

export async function cpBaseFunction(req: Request, response: Response) {
    let project_id = Number(req.headers['project-auth']);
    let project = await daoService.find<IProject>(COLLECTIONS.PROJECTS, {_id: project_id});
    if(!project) {
        response.json({message: "Project not found"});
        return;
    }
    let client = await DbService.getClient();
    let db = client.db('project-'+project_id);
    const { collectionName, action, data } = req.body as ICpBaseRequest
    let collection = db.collection(collectionName);
    let result;
    if(action == 'findOne') {
        console.log('Running findOne operation ...');
        console.log(JSON.stringify(data, undefined, 3));
        result = await collection[action](data);
    }
    else if(action == 'insertOne') {
        console.log('Running insertOne operation ...');
        console.log(JSON.stringify(data, undefined, 3));
        result = await collection[action](data);
    }
    client.close();
    console.log('DB connection closed');
    response.json({message: "Hello", result});
}