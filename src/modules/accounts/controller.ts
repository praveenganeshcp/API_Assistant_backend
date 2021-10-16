import { Request, Response } from "express";
import { UtilityService } from "../../services/utility.service";
import { accountService } from "./service";

export async function createAccount(request: Request, response: Response) {
    try {
        let { username, mailId, password } = request.body;
        const newUser = await accountService.createUserAccount(username, mailId, password);
        const token = UtilityService.createJWTSignature({user_id: newUser?._id});
        response.status(201).json({success: true, result: {user: newUser, token}});
    }
    catch(err) {
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function loginUser(request: Request, response: Response) {
    try {
        let { mailId, password } = request.body;
        let { token, user } = await accountService.verifyLogin(mailId, password);
        response.json({success: true, result: {token, user}});
    }
    catch(err: any) {
        console.error(err);
        if(err.errMsg) {
            response.status(200).json({success: false, message: err.errMsg});
            return;
        }
        response.status(500).json({success: false, message: "Internal server error"});
    }
}