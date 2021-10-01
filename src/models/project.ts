export interface IProject {
    _id?: number;
    name: string;
    user_id: number;
    created_on: Date;
    updated_on: Date | null;
}