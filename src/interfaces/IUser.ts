

// database structure

export interface IUser {
    id_user: number | null;
    email:string;
    password: string;
    name: string;
    lastname: string;
    phone_number: string;
    id_role: number;
    photo_profile: string;
    isDeleted: boolean;
}