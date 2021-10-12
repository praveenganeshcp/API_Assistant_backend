import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

export class UtilityService {

    static getEnvProp(field: string) {
        return process.env[field] as string;
    }

    static createJWTSignature(payload: any) {
        return jwt.sign(payload, this.getEnvProp('JWT_SECRET'), {expiresIn: '1h'});
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

    static folderSetup() {
        let cwd = process.cwd();
        let storagePath = path.join(cwd, 'storage');
        if(!fs.existsSync(storagePath)) {
            console.log('creating storage folder');
            fs.mkdirSync(storagePath);
        }
    }
}