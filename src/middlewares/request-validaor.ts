import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function requestValidator(request: Request, response: Response, next: NextFunction) {
    try {
        let validationErrors = validationResult(request);
        if(validationErrors.isEmpty()) {
            next();
        }
        else {
            response.status(400).json({success: false, message: validationErrors});
        }
    }
    catch(err) {
        response.status(500).json({success: false, message: "Internal server  error"});
    }
}