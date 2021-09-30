export interface ICpBaseRequest {
    collectionName: string;
    action: 'findOne'| 'find' | 'insertOne' | 'updateOne';
    data: any
}