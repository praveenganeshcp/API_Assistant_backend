import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

async function createSubfolders(storagePath: string) {
    let splittedPath = storagePath.split('/');
    let completedPath: string[] = ['storage']
    splittedPath.forEach(pathValue => {
        completedPath.push(pathValue);
        let currentPath = path.join(process.cwd(), ...completedPath);
        if(!fs.existsSync(currentPath)) {
            console.log('creating path '+currentPath);
            fs.mkdirSync(currentPath)
        }
    })
    return path.join(process.cwd(), ...completedPath);
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        let fullPath = await createSubfolders(req.headers['project_auth']+'/'+req.body.path);
        cb(null, fullPath);
    },
    filename: (req: Request, file, cb) => {
        cb(null, file.originalname);
    }
})

export const multerStorage = multer({storage});