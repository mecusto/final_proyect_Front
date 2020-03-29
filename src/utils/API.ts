import { IProperty } from "./../interfaces/IProperties";

import { IUser } from "../interfaces/IUser";
import { IReportDeleted } from "../interfaces/IReport";
import { IUserEmail } from "../interfaces/IUserEmail";
import { ITenant } from "../interfaces/ITenant";

const host = "http://localhost:5000";

const myFetch = async ({
  path,
  method,
  json,
  token,
  formData
}: {
  path: string;
  method: string;
  json?: Object;
  token?: string;
  formData?: FormData;
}): Promise<any> => {
  let headers = new Headers();
  let body = undefined;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (json) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  } else if (formData) {
    body = formData;
  }

  const response = await fetch(host + path, {
    method: method,
    headers: headers,
    body: body
  });

  const res = await response.json();
  console.log(res);
  return res;
};

//-------------------USERS--------------------

export const getEmailExists = async (email: string): Promise<boolean> =>
  await myFetch({ path: `/emailExists/${email}`, method: "GET" });

export const getEmail = async (id_property: number): Promise<IUserEmail> =>
  myFetch({ path: `/useremail/${id_property}`, method: "GET" });

export const getTenantEmail = async (
  id_property: number
): Promise<IUserEmail> =>
  myFetch({ path: `/tenants/useremail/${id_property}`, method: "GET" });

export const registerUser = async (user: IUser) =>
  await myFetch({ path: "/register", method: "POST", json: user });

// on loginForm
export const authUser = async (email: string, password: string) =>
  await myFetch({
    path: "/auth",
    method: "POST",
    json: { email: email, password: password }
  });

export const getUser = async (token: any) =>
  myFetch({ path: "/user", method: "GET", token: token });

export const editUser = async (token: any, id_user: number, user: IUser) =>
  myFetch({
    path: `/update/${id_user}`,
    method: "POST",
    token: token,
    json: user
  });

export const editPassword = async (
  token: any,
  id_user: number,
  password: string
) =>
  myFetch({
    path: `/updatePassword/${id_user}`,
    method: "POST",
    token: token,
    json: { password: password }
  });

export const postPhoto_profile = async (token: any, formData: FormData) =>
  myFetch({
    path: `/uploadPhotoProfile`,
    method: "POST",
    token: token,
    formData: formData
  });

export const deleteUser = async (token: any) =>
  myFetch({
    path: `/delete`,
    method: "POST",
    token: token
  });

// ------------------ PROPERTIES -----------------------------

export const getProperties = async (token: any) =>
  myFetch({
    path: `/properties`,
    method: "GET",
    token: token
  });

export const getProperty = async (
  token: any,
  id_property: number
): Promise<IProperty> =>
  myFetch({
    path: `/properties/property/${id_property}`,
    method: "GET",
    token: token
  });

export const getPropertyTenant = async (token: any): Promise<IProperty> =>
  myFetch({
    path: `/properties/propertyTenant/`,
    method: "GET",
    token: token
  });

export const addProperty = async (token: any, formData: FormData) =>
  await myFetch({
    path: `/properties/register`,
    method: "POST",
    token: token,
    formData: formData
  });

export const updateProperty = async (
  token: any,
  id: number,
  formData: FormData
) =>
  myFetch({
    path: `/properties/edit/'${id}'`,
    method: "POST",
    token: token,
    formData: formData
  });

export const deleteProperty = async (token: any, id: number) =>
  myFetch({
    path: `/properties/delete/'${id}'`,
    method: "POST",
    token: token
  });

// ----------------- REPORTS -----------------------
// export const getReports = async (token: any, id_property: number) =>
//   myFetch({
//     path: `/reports/propertyreports/${id_property}`,
//     method: "GET",
//     token: token
//   });

export const getAllReports = async (token: any) =>
  myFetch({
    path: `/reports/propertyreports`,
    method: "GET",
    token: token
  });

export const getReportwithProperty = async (token: any, id_report: number) =>
  myFetch({
    path: `/reports/${id_report}`,
    method: "GET",
    token: token
  });

export const postNewReport = async (token: any, formData: FormData) =>
  myFetch({
    path: `/reports`,
    method: "POST",
    token: token,
    formData: formData
  });

export const updateReport = async (
  token: any,
  formData: FormData,
  id_report: number
) =>
  myFetch({
    path: `/reports/update/${id_report}`,
    method: "POST",
    token: token,
    formData: formData
  });

export const updateStatus = async (
  token: any,
  id_report_state: number,
  id_report: number
) =>
  myFetch({
    path: `/reports/updateState/${id_report}`,
    method: "POST",
    token: token,
    json: { id_report_state: id_report_state }
  });

export const deletePhoto = async (token: any, photo: string) =>
  myFetch({
    path: `/reports/photo/${photo}`,
    method: "POST",
    token: token
  });

export const deleteReport = async (
  token: any,
  id_report: number
): Promise<IReportDeleted> =>
  myFetch({
    path: `/reports/delete/${id_report}`,
    method: "POST",
    token: token
  });

//---------------------------TENANTS------------------

export const checkIn = async (
  token: any,
  tenant: ITenant,
  id_property: number
) =>
  myFetch({
    path: `/tenants/checkIn/${id_property}`,
    method: "POST",
    token: token,
    json: tenant
  });

export const getTenants = async (token: any) =>
  myFetch({
    path: `/tenants`,
    method: "GET",
    token: token
  });

export const getTenantPropertyDetails = async (token: any, id_tenant: number) =>
  myFetch({
    path: `/tenants/getPropertydetails/${id_tenant}`,
    method: "GET",
    token: token
  });

export const getTenantReportDetails = async (token: any, id_property: number) =>
  myFetch({
    path: `/tenants/getReportDetails/${id_property})`,
    method: "GET",
    token: token
  });

export const deleteTenant = async (token: any, id_property: number) =>
  myFetch({
    path: `/deleteTenant/${id_property}`,
    method: "POST",
    token: token
  });
