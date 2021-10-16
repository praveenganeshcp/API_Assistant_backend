import { ObjectId } from "bson";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IUser } from "../../models/user";
import { IUserToken } from "../../models/user-key";
import { UtilityService } from "../../services/utility.service";

const daoService = new DaoService();

async function createUserAccount(username: string, mailId: string, password: string) {
    try {
        let newUser: IUser = {
            _id: new ObjectId().toHexString(),
            name: username,
            mailId: mailId,
            hashed_password: await UtilityService.createPasswordHash(password),
            created_on: new Date(),
            updated_on: null
        }
        let result = await daoService.insert<IUser>(COLLECTIONS.USERS, newUser);
        return result;
    }
    catch(err) {
        console.error(err);
        throw err;
    }
}

async function generateAPIKey(userId: string) {
    try {
        const authToken = userId + Date.now().toString();
        let hashedKey = await UtilityService.createPasswordHash(authToken);
        let doubleHashedKey = await UtilityService.createPasswordHash(hashedKey);
        let tokenObj: Partial<IUserToken> = {
            user_id: userId,
            token: doubleHashedKey,
            created_on: new Date(),
        }
        await daoService.updateOne<IUserToken>(COLLECTIONS.APIKEYs, {user_id: userId}, {
            $set: tokenObj
        }, {upsert: true});
        return hashedKey;
    }
    catch(err) {
        console.error(err);        
    }
}

async function verifyLogin(mailId: string, password: string) {
    try {
        let user = await daoService.find<IUser>(COLLECTIONS.USERS, {mailId}) as IUser;
        let isPasswordSame = await UtilityService.verifyPasswordHash(password, user?.hashed_password);
        if(isPasswordSame) {
            const token = UtilityService.createJWTSignature({user_id: user._id});
            return {
                user, token
            }
        }
        else {
            throw {errMsg: "Incorrect password"};
        }
    }
    catch(err) {
        console.error(err);
        throw err;
    }
}

export const accountService = {
    createUserAccount,
    verifyLogin,
    generateAPIKey
}