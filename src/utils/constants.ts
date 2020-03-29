import { ISwal } from "../interfaces/ISwal";

export const ROLE_OWNER = 1;
export const ROLE_PROFFESIONAL = 3;
export const ROLE_TENANT = 2;

export const PRIORITY_URGENT = 1;
export const PRIORITY_MEDIUM = 2;
export const PRIORITY_LOW = 3;

export const REPORT_STATE_NEW = 1;
export const REPORT_STATE_OPEN = 2;
export const REPORT_STATE_RESOLVED = 3;

export const messageOkLogin: ISwal = {
    title: "Bienvenido!",
    text: "El login se ha realizado correctamente",
    icon: "success",
    button: "OK"
};

export const messageOkRegister: ISwal = {
    title: "El registro ha sido completado!",
    text: "Acceda mediante login",
    icon: "success",
    button: "OK"
};

export const messageOkUpdatePassword: ISwal = {
  title: "El perfil ha sido actualizado",
  text: "Recuerde acceder con su nueva contraseña",
  icon: "success",
  button: "OK"
};

export const messageOkUpdate: ISwal = {
  title: "Los datos han sido actualizados",
  text: "",
  icon: "success",
  button: "OK"
};

export const messageOkDelete: ISwal = {
  title: "El usuario ha sido dado de baja",
  text: "Se perfil ha sido eliminado",
  icon: "success",
  button: "OK"
};

export const messageError: ISwal = {
    title: "Error!",
    text: "Datos incorrectos",
    icon: "error",
    button: "VOLVER"
};

//const of the classes of the paginas amarillas elements we are aiming to
export const pathProfesionals1 =
  ".container .row .first-content-listado .col-lg-7.col-md-8.col-xs-12 .bloque-central .central .listado-item.item-ip .box .cabecera .row .col-xs-11.comercial-nombre a h2 span";
export const pathProfesionals2 =
  ".container .row .first-content-listado .col-lg-7.col-md-8.col-xs-12 .bloque-central .central .listado-item.item-ig .box .cabecera .row .col-xs-11.comercial-nombre a h2 span";
export const pathTelephones1 =
  ".container .row .first-content-listado .col-lg-7.col-md-8.col-xs-12 .bloque-central .central .listado-item.item-ip .box .pie-pastilla .row .col-xs-4 a.llama-desplegable.btn.btn-amarillo.btn-block.phone.hidden.d-none span";
export const pathTelephones2 =
  ".container .row .first-content-listado .col-lg-7.col-md-8.col-xs-12 .bloque-central .central .listado-item.item-ig .box .pie-pastilla .row .col-xs-4 a.llama-desplegable.btn.btn-amarillo.btn-block.phone.hidden.d-none span";
export const pathAddress1 = " span[itemprop = 'streetAddress']";


export const host ="http://localhost:5000/"


export const EMAIL_TEMPLATE_ID = "template_7SY4MerG";
export const EMAIL_SERVICE_ID = "gmail";
export const EMAIL_USER_ID = "user_Hg79JuihCza0BBIxpMcRq";

