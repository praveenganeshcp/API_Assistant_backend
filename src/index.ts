import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { appRoutes } from './routes';
import { UtilityService } from './services/utility.service';

const PORT = Number(UtilityService.getEnvProp('PORT'));

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use((request: Request, response: Response, next: NextFunction) => {
    next();
    response.setHeader('Access-Control-Allow-Origin', '*');
})

app.use('/api/v1', appRoutes);

app.listen(PORT, () => {
    console.log('Listening on port '+PORT);
})