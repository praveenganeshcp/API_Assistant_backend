import { Request, Response } from "express";
import { IUser } from "../../models/user";
import { UtilityService } from "../../services/utility.service";
import { accountService } from "./service";

export async function createAccount(request: Request, response: Response) {
    try {
        let { username, mailId, password } = request.body;
        const newUser = await accountService.createUserAccount(username, mailId, password) as IUser;
        const token = await UtilityService.createJWTSignature({user_id: newUser?._id});
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

export async function generateAPIKey(request: Request, response: Response) {
    try {   
        let apiKey = await accountService.generateAPIKey(request.user._id);
        response.json({success: true, result: apiKey});
    }
    catch(err) {
        console.error(err);
        response.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function changePassword(request: Request, response: Response) {
    try {
        let { oldPassword, newPassword } = request.body;
        let result = await accountService.changePassword(request.user.mailId, oldPassword, newPassword);
        response.json({success: true, result});
    }
    catch(err: any) {
        console.error(err);
        if(err.errMsg) {
            response.json({success: false, result: err.errMsg});
            return;
        }
        response.status(500).json({success: false, message: "Internal server error"});
    }
}