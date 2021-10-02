import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ObjectId } from "mongodb";
import { IUser } from "../../models/user";
import { DaoService } from "../../dao/dao";
import { COLLECTIONS } from "../../constants";
import { UtilityService } from "../../services/utility.service";

const daoService = new DaoService();

export async function createAccount(request: Request, response: Response) {
    try {
        let validationErrors = validationResult(request);
        if(validationErrors.isEmpty()) {
            let newUser: IUser = {
                _id: new ObjectId().toHexString(),
                name: request.body.username,
                mailId: request.body.mailId,
                hashed_password: await UtilityService.createPasswordHash(request.body.password),
                created_on: new Date(),
                updated_on: null
            }
            let result = await daoService.insert<IUser>(COLLECTIONS.USERS, newUser);
            let token = UtilityService.createJWTSignature({user_id: result?._id});
            response.status(201).json({success: true, token, result});
        }
        else {
            response.status(400).json({success: false,validationErrors});
        }
    }
    catch(err) {
        response.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function loginUser(request: Request, response: Response) {
    try {
        let validationErrors = validationResult(request);
        if(validationErrors.isEmpty()) {
            let { mailId, password } = request.body;
            let user = await daoService.find<IUser>(COLLECTIONS.USERS, {mailId}) as IUser;
            let isPasswordSame = await UtilityService.verifyPasswordHash(password, user?.hashed_password);
            if(isPasswordSame) {
                let token = UtilityService.createJWTSignature({user_id: user._id});
                response.json({success: true, token, result: user});
            }
            else {
                response.status(200).json({success: false, message: "Incorrect password"});
            }
        }
        else {
            response.status(400).json({success: false, message: validationErrors});
        }
    }
    catch(err) {
        response.status(500).json({success: false, message: "Internal server error"});
    }
}