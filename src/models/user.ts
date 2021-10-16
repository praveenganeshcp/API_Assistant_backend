export interface IUser {
    _id: string;
    name: string;
    mailId: string;
    hashed_password: string;
    created_on: Date;
    updated_on: Date | null;
    last_login: Date | null;
}