import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { appRoutes } from './routes';
import { UtilityService } from './services/utility.service';
import cors from 'cors';

const PORT = Number(UtilityService.getEnvProp('PORT'));

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(cors());

app.use('/api/v1', appRoutes);

app.listen(PORT, () => {
    console.log('Listening on port '+PORT);
})