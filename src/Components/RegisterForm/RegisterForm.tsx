import React from "react";

// import "./form.css";
import swal from "sweetalert";
import { messageError, messageOkRegister } from "../../utils/constants";
import { ROLE_OWNER } from "../../utils/constants";

import { IUser } from "../../interfaces/IUser";
import { registerUser, getEmailExists } from "../../utils/API";

import { hasUpperCase } from "../../utils/utils";

interface IState {
  emailExists: boolean;

  isValidPassword: boolean;
  id_user: null;
  email: string;
  password: string;
  validPassword: string;
  name: string;
  lastname: string;
  phone_number: string;
  id_role: number;
  photo_profile: string;
  isDeleted: boolean;
}

interface IProps {
  cleanBody(): void;
}

interface IGlobalProps {}

type TProps = IProps & IGlobalProps;

class RegisterForm extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      emailExists: false,
      id_user: null,
      email: "",
      password: "",
      validPassword: "",
      name: "",
      lastname: "",
      phone_number: "",
      id_role: ROLE_OWNER,
      photo_profile: "",
      isDeleted: false,
      isValidPassword: false
    };

    this.equalPassword = this.equalPassword.bind(this);
    this.register = this.register.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.emailExists = this.emailExists.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
  }

  componentDidMount() {}

  equalPassword = (value: String) => {
    const { password } = this.state;
    return password === value;
  };

  handleChange(e: any) {
    let value = e.target.value;

    if (e.target.name === "id_role") {
      value = Number(value);
    }
    this.setState({
      ...this.state,
      [e.target.name]: value
    });
  }

  async emailExists() {
    const { email } = this.state;
    const response = await getEmailExists(email);
    this.setState({ emailExists: response });
  }

  async register() {
    const {
      email,
      password,
      name,
      lastname,
      phone_number,
      id_role,
      photo_profile
    } = this.state;
    const user: IUser = {
      id_user: null,
      email: email.toLocaleLowerCase(),
      password: password,
      name: name,
      lastname: lastname,
      phone_number: phone_number,
      id_role: id_role,
      photo_profile: photo_profile,
      isDeleted: false
    };
    try {
      const { isRegistered } = await registerUser(user);
      this.props.cleanBody();
      swal(isRegistered === true ? messageOkRegister : messageError);
    } catch (err) {
      console.log(err);
    }
  }

  enterPressed(event: any) {
    let code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      this.register();
    }
  }

  render() {
    const {
      name,
      lastname,
      phone_number,
      email,
      password,
      validPassword,
      emailExists
    } = this.state;
    let emailOk = false;
    let passwordOk = false;
    let passwordMatch = false;
    let isEnabled = false;
    let allFieldsFilled = false;

    if (
      email.length >= 8 &&
      email.includes("@") &&
      (email.includes(".es") || email.includes(".com")) &&
      !emailExists
    ) {
      emailOk = !emailOk;
    }

    if (password.length >= 8 && hasUpperCase(password)) {
      passwordOk = !passwordOk;
    }

    if (password === validPassword && validPassword.length !== 0) {
      passwordMatch = !passwordMatch;
    }

    if (name.length > 1 && lastname.length > 1 && phone_number.length > 8) {
      allFieldsFilled = true;
    }

    if (emailOk && passwordOk && passwordMatch && allFieldsFilled) {
      isEnabled = true;
    }

    return (
      <div className="container-fluid registerForm">
        <div className="form-row formRow">
          <div className="form-group col-md-6">
            <label style={{ color: "white" }} className="col-form-label">
              {" "}
              Nombre:
            </label>
            <input
              type="text"
              name="name"
              className="form-control form-control-sm"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label style={{ color: "white" }} className="col-form-label">
              {" "}
              Apellidos:
            </label>
            <input
              type="text"
              value={this.state.lastname}
              className="form-control form-control-sm"
              name="lastname"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form-row formRow">
          <div className="form-group col-md-6">
            <label style={{ color: "white" }} className="col-form-label">
              {" "}
              Teléfono:
            </label>
            <input
              type="text"
              value={this.state.phone_number}
              className="form-control form-control-sm"
              name="phone_number"
              onChange={this.handleChange}
            />
          </div>

          <div className="form-group col-md-6">
            <label style={{ color: "white" }} className="col-form-label">
              {" "}
              email:
            </label>
            <input
              type="email"
              className="form-control form-control-sm"
              value={this.state.email}
              name="email"
              onChange={this.handleChange}
              onBlur={this.emailExists}
            />
            {!emailOk && !emailExists ? (
              <div style={{ textAlign: "right" }}>
                <span
                  style={{ color: "white", fontSize: 12, fontStyle: "italic" }}
                >
                  El email debe tener el formato correcto
                </span>
              </div>
            ) : null}

            {emailExists ? (
              <div style={{ textAlign: "right" }}>
                <span
                  style={{ color: "white", fontSize: 12, fontStyle: "italic" }}
                >
                  El email ya existe en la base de datos
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="form-row formRow2">
          <div className="form-group col-md-6">
            <label style={{ color: "white" }} className="col-form-label">
              {" "}
              Contraseña:
            </label>
            <input
              type="password"
              value={this.state.password}
              className="form-control form-control-sm"
              name="password"
              onChange={this.handleChange}
            />
            {!passwordOk && (
              <div>
                <span
                  style={{ color: "white", fontSize: 12, fontStyle: "italic" }}
                >
                  La contraseña debe tener al menos 8 caracteres y una mayúscula
                </span>
              </div>
            )}
          </div>
          <div className="form-group col-md-6">
            <label style={{ color: "white" }} className="col-form-label">
              {" "}
              Confirme contraseña:
            </label>
            <input
              type="password"
              name="validPassword"
              value={this.state.validPassword}
              className="form-control form-control-sm"
              onChange={this.handleChange}
              onKeyPress={this.enterPressed}
            />
            {!passwordMatch && (
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    color: "white",
                    fontSize: 12,
                    fontStyle: "italic"
                  }}
                >
                  Los campos contraseña no coinciden
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col m-3">
            <button
              type="submit"
              className="btn btn-sm btn-outline-light mt-4 "
              disabled={!isEnabled}
              onClick={this.register}
            >
              Registrar
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-outline-light mt-4 ml-2"
              onClick={this.props.cleanBody}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
