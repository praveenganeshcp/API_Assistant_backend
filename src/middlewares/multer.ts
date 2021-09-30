import { Request } from 'express';
import multer from 'multer';
import path from 'path';

async function createSubfolders(path: string) {
    console.log(path)
}

const storage = multer.diskStorage({
    destination: async (req: Request, file, cb) => {
        const fullPath = path.join(process.cwd(), 'storage')
        await createSubfolders(req.headers['project-auth']+req.body.path);
        cb(null, fullPath);
    },
    filename: (req: Request, file, cb) => {
        cb(null, file.originalname);
    }
})

export const multerStorage = multer({storage});