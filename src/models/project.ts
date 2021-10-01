export interface IProject {
    _id: string;
    name: string;
    user_id: string;
    created_on: Date;
    updated_on: Date | null;
}