import { TAction } from "../types";

import produce from "immer";
import { ROLE_OWNER } from "../../utils/constants";
import { IProfile } from "../../interfaces/IProfile";

const initialState: IProfile = {
  id_user: null,
  name: "",
  lastname: "",
  phone_number: "",
  email: "",
  id_role: ROLE_OWNER,
  photo_profile: "",
  token: ""
};


export default(state = initialState, action: TAction):IProfile => 
   produce (state, draftState => 
        {
        switch (action.type) {
            case 'SET_PROFILE':
                return action.payload;
            // case 'SET_PHOTO_PROFILE':
            //     return {...state, photo_profile : action.payload };
            case 'SET_PASSWORD':
                return {...state, password: action.payload };
            case 'SET_LOGOUT':
                 return state = initialState; //this case is necessary in all the reducers so we restart all the states
            default:
                return state;
        }
    });
