import { IProperties, IProperty } from "./../interfaces/IProperties";
// import { IPropertyForm } from './../interfaces/IPropertyForm';
import { IProfile } from "../interfaces/IProfile";
import { IReport } from "../interfaces/IReport";
import { ITenant } from "../interfaces/ITenant";
import { ITenantInfo } from "../interfaces/ITenantInfo";

// --------- LOGIN --------------------
interface ILogout {
  type: "SET_LOGOUT"; // inteface para que ts no se queje
}

interface ISetProfile {
  type: "SET_PROFILE";
  payload: IProfile;
}

interface setPhotoProfileAction {
  type: "SET_PHOTO_PROFILE";
  payload: string;
}

interface ISetProperties {
  type: "SET_PROPERTIES";
  payload: IProperty[];
}

interface setPasswordAction {
  type: "SET_PASSWORD";
  payload: string;
}

interface setIdIntervaAction {
  type: "SET_ID_INTERVAL";
  payload: number;
}

interface updateProperty {
  type: "UPDATE_PROPERTY";
  payload: IProperty;
}

interface deleteProperty {
  type: "DELETE_PROPERTY";
  payload: number;
}

interface addProperty {
  type: "SET_PROPERTY";
  payload: IProperty;
}

interface setSelectedProperty {
  type: "SET_SELECTED_PROPERTY";
  payload: number;
}
interface setDetailVisible {
  type: "SET_DETAIL_VISIBLE";
  payload: boolean;
}

interface setNewMessage {
  type: "SET_NEW_MESSAGE";
  payload: { isNewMessage: boolean; id_property: number };
}

// --------- REPORTS ---------
interface setReports {
  type: "SET_REPORTS";
  payload: IReport[];
}

interface setNewReport {
  type: "SET_NEW_REPORT";
  payload: IReport;
}

interface setPhotoReport {
  type: "SET_PHOTO_REPORT";
  payload: string;
}

interface ISetResetPassword {
  type: "SET_RESET_REPORTS";
}

//-------------TENANTS-----------
interface ISetTenants {
  type: "SET_TENANTS";
  payload: ITenant[];
}
interface ISetNewTenant {
  type: "SET_NEW_TENANT";
  payload: ITenant;
}
interface ISetTenantPropertyInfo {
  type: "SET_TENANT_INFO";
  payload: ITenantInfo;
}

export type TAction =
  | ILogout
  | ISetProfile
  | ISetProperties
  | setPasswordAction
  | updateProperty
  | deleteProperty
  | addProperty
  | setPhotoReport
  | setReports
  | setNewReport
  | ISetResetPassword
  | ISetTenants
  | ISetNewTenant
  | ISetTenantPropertyInfo
  | setSelectedProperty
  | setDetailVisible
  | setIdIntervaAction;
