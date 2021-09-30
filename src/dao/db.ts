import { Db, MongoClient } from "mongodb";

export class DbService {

    private static dbConnection: Db | null = null;

    private constructor() {}

    private static async createConnection(): Promise<Db> {
        let mongo = new MongoClient("mongodb://localhost:27017");
        let client = await mongo.connect();
        const db = client.db('cpbase');
        return db;
    }

    static async getInstance(): Promise<Db> {
        if(this.dbConnection == null) {
            console.log('creating new connection ...');
            this.dbConnection = await this.createConnection();
        }
        return this.dbConnection;
    }
}