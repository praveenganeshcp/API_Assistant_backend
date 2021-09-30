export interface ICpBaseRequest {
    collectionName: string;
    action: 'findOne' | 'insertOne',
    data: any
}