import { check, checkSchema } from 'express-validator';
import { COLLECTIONS } from '../../constants';
import { DaoService } from '../../dao/dao';
import { IUser } from '../../models/user';
const daoService = new DaoService();

export const signupValidator = checkSchema({
    username: {
        in: ['body'],
        isString: true,
    },
    mailId: {
        in: ['body'],
        isEmail: true,
        custom: {
            options: async (value: string) => {
                let user = await daoService.find<IUser>(COLLECTIONS.USERS, {mailId: value});
                if(user) {
                    return Promise.reject('Mail id already exists');
                }
                return Promise.resolve();
            }
        }
    },
    password: {
        in: ['body'],
        isStrongPassword: true,
    },
})

export const loginValidator = checkSchema({
    mailId: {
        in: ['body'],
        isEmail: true,
        custom: {
            options: async (value: string) => {
                let user = await daoService.find<IUser>(COLLECTIONS.USERS, {mailId: value});
                if(!user) {
                    return Promise.reject('Mail id not registered');
                }
                return Promise.resolve();
            }
        }
    },
    password: {
        in: ['body'],
        isStrongPassword: true,
    }
})