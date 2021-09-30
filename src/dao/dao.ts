import { Filter, OptionalId } from "mongodb";
import { DbService } from "./db";

export class DaoService {

    async find<T>(collectionName: string, filter: Filter<T>): Promise<T | null> {
        const db = await DbService.getInstance();
        const collection = db.collection<T>(collectionName);
        return collection.findOne(filter, {});
    }

    async insert<T>(collectionName: string, data: T): Promise<T | null> {
        const db = await DbService.getInstance();
        const collection = db.collection<T>(collectionName);
        await collection.insertOne(data as OptionalId<T>);
        return data as T;
    }

}

