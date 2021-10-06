import { NextFunction, Request, response, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { COLLECTIONS } from "../constants";
import { DaoService } from "../dao/dao";
import { IUser } from "../models/user";
import { UtilityService } from "../services/utility.service";

const daoService = new DaoService();

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.headers['authorization'] as string;
        if(!token) {
            res.status(401).json({success: false, message: "Token not found in Authorization header"});    
            return; 
        }
        token = token.split(' ')[1];
        let payload = UtilityService.verifyJWTSignature(token);
        console.log(payload);
        req.user = await daoService.find<IUser>(COLLECTIONS.USERS, {_id: payload.user_id}) as IUser;
        next();
    }
    catch(err) {
        console.log(err);
        if(err instanceof JsonWebTokenError) {
            res.status(401).json({success: false, message: "Token expired"});    
            return;        
        }
        res.status(500).json({success: false, message: "Internal server error"});
    }
}