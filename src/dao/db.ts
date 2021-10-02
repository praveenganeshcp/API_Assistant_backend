import { Db, MongoClient } from "mongodb";
import { UtilityService } from "../services/utility.service";

export class DbService {

    private static dbConnection: Db | null = null;

    private constructor() {}

    private static async createConnection(dbName: string): Promise<Db> {
        let mongo = new MongoClient(UtilityService.getEnvProp('DB_URL'));
        let client = await mongo.connect();
        const db = client.db(dbName);
        return db;
    }

    static async getClient(): Promise<MongoClient> {
        let mongo = new MongoClient(UtilityService.getEnvProp('DB_URL'));
        let client = await mongo.connect();
        console.log('New client created');
        return client;
    }

    static async getInstance(dbName: string = UtilityService.getEnvProp('DB_NAME')): Promise<Db> {
        if(this.dbConnection == null) {
            console.log('creating new connection ...');
            this.dbConnection = await this.createConnection(dbName);
        }
        return this.dbConnection;
    }
}