import { checkSchema } from "express-validator";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IProject } from "../../models/project";
import { ICpBaseRequest } from "../../models/base-request";

const daoService = new DaoService();

const throwIfInvalidProjectAuth = async (value: string) => {
    let project = await daoService.find<IProject>(COLLECTIONS.PROJECTS, {_id: value});
    if(!project) {
        return Promise.reject('Invalid project auth in header');
    }
    return Promise.resolve();
}

export const cpBaseGlobalValidator = checkSchema({
    project_auth: {
        in: ['headers'],
        custom: {
            options: throwIfInvalidProjectAuth
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

export const cpbaseSignupValidator = checkSchema({
    project_auth: {
        in: ['headers'],
        custom: {
            options: throwIfInvalidProjectAuth
        }
    },
    user: {
        in: ['body'],
        isObject: {
            negated: false,
            errorMessage: "user field must be object"
        },
        errorMessage: "user object not found in request body",
    },
    'user.mailId': {
        in: ['body'],
        isEmail: {
            negated: false,
            errorMessage: "Invalid mailId value in user object",
        },
        errorMessage: "mailId value not present in user object"
    },
    'user.password': {
        in: ['body'],
        isStrongPassword: {
            negated: false,
            errorMessage: "Password must contain atleast one captial, small letter, digit and a special character"
        }
    }
})

export const projectAuthValidator = checkSchema({
    project_auth: {
        in: ['headers'],
        custom: {
            options: throwIfInvalidProjectAuth
        }
    },
})

export const createDirectoryValidator = checkSchema({
    project_auth: {
        in: ['headers'],
        custom: {
            options: throwIfInvalidProjectAuth
        }
    },
    rootPath: {
        in: ['body'],
        isString: true,
        errorMessage: "Invalid value for rootPath value",
    },
    dirName: {
        in: ['body'],
        isString: true,
        errorMessage: "Invalid value for dirName value",
    }
})

export const fileStatValidator = checkSchema({
    project_auth: {
        in: ['headers'],
        custom: {
            options: throwIfInvalidProjectAuth
        }
    },
    path: {
        in: ['query'],
        isString: true,
        errorMessage: "Invalid value for path field in query param"
    }
})

export const removeObjectValidator = checkSchema({
    project_auth: {
        in: ['headers'],
        custom: {
            options: throwIfInvalidProjectAuth
        }
    },
    path: {
        in: ['query'],
        isString: true,
        custom: {
            options: (value) => {
                if(value === '/' || value == '') {
                    throw "Cannot delete root directory object"
                }
                return true;
            }
        }
    }
})