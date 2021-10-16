import { Filter, FindOptions, OptionalId, UpdateFilter, UpdateOptions } from "mongodb";
import { DbService } from "./db";

export class DaoService {

    async find<T>(collectionName: string, filter: Filter<T>, findOptions: FindOptions<T> = {}): Promise<T | null> {
        const db = await DbService.getInstance();
        const collection = db.collection<T>(collectionName);
        return collection.findOne(filter, findOptions);
    }

    async insert<T>(collectionName: string, data: T): Promise<T | null> {
        const db = await DbService.getInstance();
        const collection = db.collection<T>(collectionName);
        await collection.insertOne(data as OptionalId<T>);
        return data as T;
    }
    async findMany<T>(collectionName: string, filter: Filter<T>, findOptions: FindOptions<T> = {}): Promise<T[] | null> {
        const db = await DbService.getInstance();
        const collection = db.collection<T>(collectionName);
        return collection.find(filter, findOptions).toArray();
    }

    async updateOne<T>(collectionName: string, filter: Filter<T>, update: UpdateFilter<T>, options: UpdateOptions = {}) {
        const db = await DbService.getInstance();
        const collection = db.collection<T>(collectionName);
        return collection.updateOne(filter, update, options);
    }

    async updateMany<T>(collectionName: string, filter: Filter<T>, update: UpdateFilter<T>, options: UpdateOptions = {}) {
        const db = await DbService.getInstance();
        const collection = db.collection<T>(collectionName);
        return collection.updateMany(filter, update, options);
    }
}

