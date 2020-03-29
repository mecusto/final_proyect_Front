import { IProfile } from "../interfaces/IProfile";
import { ROLE_OWNER } from "./constants";
import jwt from 'jsonwebtoken';
import { IMessage } from '../interfaces/IMessage';
import firebase from '../config/config';

const db = firebase.firestore()


interface IPayload {
    id_user: number | null;
    name: string;
    lastname: string;
    phone_number: string;
    email: string;
    id_role: number;
    photo_profile: string;
}

// función que decodifica el token y obtiene datos del payload

export function setProfileFromToken(token: string | null):IProfile {
    let userProfile: IProfile = { 
        id_user: null ,
        name: "", 
        lastname: "",
        phone_number: "", 
        email: "", 
        id_role: ROLE_OWNER, 
        photo_profile:"",
        token: ""
    }

    if (token) {
        const { id_user, name, lastname, phone_number, email, id_role, photo_profile } = jwt.decode(token) as IPayload;
        userProfile = { id_user, token, name, lastname, phone_number, email, id_role, photo_profile };
    }
    return userProfile
}

export function hasUpperCase(str: string) {
    return /[A-Z]/.test(str);
  }

export function getDate() { 
      let d = new Date();  
      return d.toLocaleDateString();
  }

// create message group for firebase chat
export const sendGroupMsg = (message: IMessage, groupChat:string) => {
    return db.collection(groupChat).add(message);
};




