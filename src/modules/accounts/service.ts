import { ObjectId } from "bson";
import { COLLECTIONS } from "../../constants";
import { DaoService } from "../../dao/dao";
import { IUser } from "../../models/user";
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
    verifyLogin
}