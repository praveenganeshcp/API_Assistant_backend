import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { appRoutes } from './routes';
import { UtilityService } from './services/utility.service';

const PORT = Number(UtilityService.getEnvProp('PORT'));

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/v1', appRoutes);

app.listen(PORT, () => {
    console.log('Listening on port '+PORT);
})