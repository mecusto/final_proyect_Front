

/* user profile on store */

export interface IProfile {
        id_user: number |null;
        name: string;
        lastname: string;
        phone_number: string;
        email: string;
        id_role: number;
        photo_profile: string;
        token: string;
}