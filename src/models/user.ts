export interface IUser {
    _id?: number;
    name: string;
    mailId: string;
    hashed_password: string;
    created_on: Date;
    updated_on: Date | null;
}