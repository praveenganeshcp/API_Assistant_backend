import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { raw } from 'express';

export class UtilityService {

    static getEnvProp(field: string) {
        return process.env[field] as string;
    }

    static createJWTSignature(payload: any) {
        return jwt.sign(payload, this.getEnvProp('JWT_SECRET'));
    }

    static verifyJWTSignature(token: string): JwtPayload {
        return jwt.verify(token, this.getEnvProp('JWT_SECRET')) as JwtPayload;
    }

    static async createPasswordHash(rawPassword: string): Promise<string> {
        return bcrypt.hash(rawPassword, 10);
    }

    static async verifyPasswordHash(rawPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(rawPassword, hashedPassword);
    }
}