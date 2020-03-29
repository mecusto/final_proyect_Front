import { ITenantInfo } from './../../interfaces/ITenantInfo';
import { TAction } from "../types";
import produce from "immer";
// import { IProfile } from "../../interfaces/IProfile";
const initialState: ITenantInfo = {
  id_property: null,
    address_line1:"",
    address_line2: "",
    locality: "",
    postcode: null,
    isDeleted: false,
    id_user: null,
    photo_property:"",
    check_in: "",
    check_out: ""

};
export default (state = initialState, action: TAction) =>
  produce(state, draftState => {
    switch (action.type) {
      case "SET_TENANT_INFO":
        return action.payload;
      case "SET_LOGOUT":
        return (state = initialState); //this case is necessary in all the reducers so we restart all the states
      default:
        return state;
    }
  });