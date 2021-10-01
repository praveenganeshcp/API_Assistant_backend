import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { authenticationMiddleware } from './middlewares/authentication';
import { appRoutes } from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/v1', appRoutes);

app.listen(3000, () => {
    console.log('Listening on port 3000');
})