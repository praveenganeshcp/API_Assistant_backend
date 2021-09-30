import { NextFunction, Request, Response } from "express";

export async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    req.user = {_id: 6, name: "praveen"};
    next();
}