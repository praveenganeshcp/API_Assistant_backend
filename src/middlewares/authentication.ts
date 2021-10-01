import { NextFunction, Request, response, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { COLLECTIONS } from "../constants";
import { DaoService } from "../dao/dao";
import { IUser } from "../models/user";
import { UtilityService } from "../services/utility.service";

const daoService = new DaoService();

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        let payload = UtilityService.verifyJWTSignature(req.headers['authorization'] as string);
        console.log(payload);
        req.user = await daoService.find<IUser>(COLLECTIONS.USERS, {_id: payload._id}) as IUser;
        next();
    }
    catch(err) {
        if(err instanceof JsonWebTokenError) {
            res.status(401).json({success: false, message: "Token expired"});    
            return;        
        }
        res.status(500).json({success: false, message: "Internal server error"});
    }
}