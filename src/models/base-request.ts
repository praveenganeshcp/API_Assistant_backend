export interface ICpBaseRequest {
    collectionName: string;
    action: 'findOne'| 'find' | 'insertOne' | 'insertMany' | 'updateOne' | 
    'updateMany' | 'deleteOne' | 'deleteMany' | 'aggregate';
    data: any
}