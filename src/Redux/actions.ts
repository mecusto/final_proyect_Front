import { TAction } from "./types";
import { IProfile } from "../interfaces/IProfile";
import { IProperty } from "./../interfaces/IProperties";
import { IReport } from "../interfaces/IReport";
import { ITenant } from "../interfaces/ITenant";
import { ITenantInfo } from "../interfaces/ITenantInfo";

export const setLogoutAction = (): TAction => ({
  type: "SET_LOGOUT"
});

export const setProfileAction = (userProfile: IProfile): TAction => ({
  type: "SET_PROFILE",
  payload: userProfile
});

export const setPasswordAction = (password: string): TAction => ({
  type: "SET_PASSWORD",
  payload: password
});

export const setIdeIntervalAction = (idInterval: number): TAction => ({
  type: "SET_ID_INTERVAL",
  payload: idInterval
})

// -----------------------PROPERTY ACTIONS ------------------------------

export const setPropertiesAction = (properties: IProperty[]): TAction => ({
  type: "SET_PROPERTIES",
  payload: properties
});

export const updatePropertyAction = (property: IProperty): TAction => ({
  type: "UPDATE_PROPERTY",
  payload: property
});

export const deletePropertyAction = (id: number): TAction => ({
  type: "DELETE_PROPERTY",
  payload: id
});

export const addPropertyAction = (property: IProperty): TAction => ({
  type: "SET_PROPERTY",
  payload: property
});

export const setSelectedPropertyAction = (
  id_selected_property: number
): TAction => ({
  type: "SET_SELECTED_PROPERTY",
  payload: id_selected_property
});

export const setDetailVisibleAction = (siOno: boolean): TAction => ({
  type: "SET_DETAIL_VISIBLE",
  payload: siOno
});

// --------------- REPORTS ACTIONS --------------------------------

export const setReportsAction = (reports: IReport[]): TAction => ({
  type: "SET_REPORTS",
  payload: reports
});

export const setNewReportAction = (report: IReport): TAction => ({
  type: "SET_NEW_REPORT",
  payload: report
});

export const setPhotoReportAction = (photoReport: string): TAction => ({
  type: "SET_PHOTO_REPORT",
  payload: photoReport
});

export const resetReportsAction = (): TAction => ({
  type: "SET_RESET_REPORTS"
});

//-----------------------------TENANT ACTIONS (ON PROPERTIES) -------------------
export const setTenantsAction = (tenants: ITenant[]): TAction => ({
  type: "SET_TENANTS",
  payload: tenants
});
export const setNewTenantAction = (tenant: ITenant): TAction => ({
  type: "SET_NEW_TENANT",
  payload: tenant
});

//-----------------------------TENANT ACTIONS (ON TENANT REDUCER) -------------------
export const setTenantInfoAction = (info: ITenantInfo): TAction => ({
  type: "SET_TENANT_INFO",
  payload: info
});
