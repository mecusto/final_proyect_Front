import { IUser } from "./IUser";
interface IUserFirebase {
    name: string;
    id: number;
}
export interface IMessage {
    createdDate: Date;
    text: string;
    id_user: number;
}

export interface IChatGroup {
    id_property: number;
    messages: Record<number, IMessage>;
    users:Record<number, IUserFirebase>;
}

