import { checkSchema } from "express-validator";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";
import { Request } from 'express';
import { ICpBaseRequest } from "../../models/base-request";

const daoService = new DaoService();

export const cpBaseGlobalValidator = checkSchema({
    project_auth: {
        in: ['headers'],
        custom: {
            options: async (value: string) => {
                console.log(typeof value);
                let project = await daoService.find<IProject>(COLLECTIONS.PROJECTS, {_id: value});
                if(!project) {
                    return Promise.reject('Invalid project auth in header');
                }
                return Promise.resolve();
            }
        }
    },
    collectionName: {
        in: ['body'],
        isString: true,
        custom: {
            options: (value: string) => {
                let reservedCollectionNames = ['users', 'logs'];
                if(reservedCollectionNames.includes(value)) {
                    throw 'Reserved collection names cannot be used';
                }
                return true;
            }
        }
    },
    action: {
        in: ['body'],
        isString: true,
        custom: {
            options: (value: string) => {
                let allowedActions = ['findOne', 'find', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'aggregate', 'deleteOne', 'deleteMany'];
                if(allowedActions.includes(value)) { 
                    return true;
                }
                throw 'Invalid action value. valid actions are '+allowedActions.join(', ');
            }
        }
    },
    data: {
        in: ['body'],
        custom: {
            options: (value, {req}) => {
                let reqBody = req.body as ICpBaseRequest;
                if((reqBody.action == 'updateOne' || reqBody.action == 'updateMany') && (!reqBody.data.filter || !reqBody.data.update)) {
                    throw 'Filter and update objects are required in data field for update operations'
                }
                else if((reqBody.action == 'aggregate' || reqBody.action == 'insertMany') && (reqBody.data.__proto__ != Array.prototype)) {
                    throw `Array type is expected in data field for ${reqBody.action} operation`;
                }
                else if(reqBody.action == 'insertMany' && reqBody.data.length == 0) {
                    throw 'No objects found for insertMany operation';
                }
                return true;
            }
        }
    }
})


export const fetchCollectionsValidator = checkSchema({
    project_auth: {
        in: ['headers'],
        custom: {
            options: async (value: string) => {
                console.log(typeof value);
                let project = await daoService.find<IProject>(COLLECTIONS.PROJECTS, {_id: value});
                if(!project) {
                    return Promise.reject('Invalid project auth in header');
                }
                return Promise.resolve();
            }
        }
    },
})