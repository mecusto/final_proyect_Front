import React from "react";

// import "./form.css";
import swal from "sweetalert";
import {
  messageError,
  messageOkUpdate,
  messageOkUpdatePassword
} from "../../utils/constants";
import { ROLE_OWNER } from "../../utils/constants";

import { IUser } from "../../interfaces/IUser";
import { editUser, editPassword } from "../../utils/API";
import { hasUpperCase, setProfileFromToken } from "../../utils/utils";
import { IProfile } from "../../interfaces/IProfile";
import {
  setProfileAction,
  setLogoutAction,
  setPasswordAction
} from "../../Redux/actions";
import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";

interface IState {
  emailExists: boolean;
  validatedData: boolean;
  isValidPassword: boolean;
  id_user: number;
  email: string;
  password: string;
  validPassword: string;
  name: string;
  lastname: string;
  phone_number: string;
  id_role: number;
  photo_profile: string;
  isDeleted: boolean;
  viewUpatePassword: boolean;

}

interface IProps {}

interface IGlobalProps {
  userProfile: IProfile;
  setProfile(user: IProfile): void;
  setPassword(password: string): void;
}

type TProps = IProps & IGlobalProps;

class UpdateForm extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      validatedData: true,
      emailExists: false,
      id_user: this.props.userProfile.id_user,
      email: this.props.userProfile.email,
      password: "",
      validPassword: "",
      name: this.props.userProfile.name,
      lastname: this.props.userProfile.lastname,
      phone_number: this.props.userProfile.phone_number,
      id_role: ROLE_OWNER,
      photo_profile: this.props.userProfile.photo_profile,
      isDeleted: false,
      isValidPassword: false,
      viewUpatePassword: false
    };
    // this.validateData = this.validateData.bind(this);

    this.equalPassword = this.equalPassword.bind(this);
    this.update = this.update.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.handleClickPassword = this.handleClickPassword.bind(this);
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
  
  handleClickPassword() {
    this.setState(state => ({ viewUpatePassword: !state.viewUpatePassword }));
  }

  async update() {
    const {
      email,
      password,
      name,
      lastname,
      phone_number,
      id_role,
      photo_profile,
      id_user
    } = this.state;

    const user: IUser = {
      id_user: id_user,
      email: email,
      password: password,
      name: name,
      lastname: lastname,
      phone_number: phone_number,
      id_role: id_role,
      photo_profile: photo_profile,
      isDeleted: false
    };

    try {
      const { token } = await editUser(
        this.props.userProfile.token,
        id_user,
        user
      );
      localStorage.setItem("token", token);
      swal(token ? messageOkUpdate : messageError);
      const profile: IProfile = setProfileFromToken(token);
      this.props.setProfile(profile); // set profile on Store
    } catch (err) {
      sweetAlert(messageError);
    }
  }

  async updatePassword() {
    const { password, id_user } = this.state;
    const { token } = this.props.userProfile;
    try {
      const { newPasswordOk } = await editPassword(token, id_user, password);
      swal(newPasswordOk === true ? messageOkUpdatePassword : messageError);
      this.handleClickPassword();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { password, validPassword, viewUpatePassword } = this.state;

    let passwordOk = false;
    let passwordMatch = false;
    let isEnabled = false;

    if (password.length >= 8 && hasUpperCase(password)) {
      passwordOk = !passwordOk;
    }

    if (password === validPassword && validPassword.length !== 0) {
      passwordMatch = !passwordMatch;
    }

    if (passwordOk && passwordMatch) {
      isEnabled = true;
    }


    return (
      <>
        <div className="container-fluid registerForm">
          <div
            className="form-row"
            style={{ opacity: viewUpatePassword ? 0.5 : 1 }}
          >
            <div className="form-group col-md-6">
              <label className="col-form-label"> Nombre:</label>
              <input
                type="text"
                name="name"
                className="form-control form-control-sm"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-6">
              <label className="col-form-label"> Apellidos:</label>
              <input
                type="text"
                value={this.state.lastname}
                className="form-control form-control-sm"
                name="lastname"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div
            className="form-row"
            style={{ opacity: viewUpatePassword ? 0.5 : 1 }}
          >
            <div className="form-group col">
              <label className="col-form-label"> Teléfono:</label>
              <input
                type="number"
                value={this.state.phone_number}
                className="form-control form-control-sm"
                name="phone_number"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col">
              <label className="col-form-label">Perfil:</label>
              <input
                name="id_role"
                className="form-control form-control-sm"
                value={
                  this.state.id_role === ROLE_OWNER
                    ? "Propietario o gestor"
                    : "Inquilino"
                }
                readOnly
              ></input>
            </div>
          </div>
          <div className="row" style={{ opacity: viewUpatePassword ? 0.5 : 1 }}>
            <div className="form-group col-md-12">
              <label className="col-form-label"> email:</label>
              <input
                type="email"
                className="form-control form-control-sm"
                value={this.state.email}
                name="email"
                readOnly
              />
            </div>
          </div>

          <div className="row">
            {/* ------------ UPDATE PASSWORD ------------------ */}
            {viewUpatePassword ? (
              <div className="container-fluid registerForm">
                <div className="row">
                  <div className="form-group col-md-6">
                    <label className="col-form-label"> Nueva contraseña:</label>
                    <input
                      type="password"
                      value={this.state.password}
                      className="form-control form-control-sm"
                      name="password"
                      onChange={this.handleChange}
                    />
                    {!passwordOk && (
                      <div>
                        <span style={{ color: "red", fontSize: 10 }}>
                          La contraseña debe tener al menos 8 caracteres y una
                          mayúscula
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label className="col-form-label">
                      {" "}
                      Confirme nueva contraseña:
                    </label>
                    <input
                      type="password"
                      name="validPassword"
                      value={this.state.validPassword}
                      className="form-control form-control-sm"
                      onChange={this.handleChange}
                    />
                    {!passwordMatch && (
                      <div>
                        <span style={{ color: "red", fontSize: 10 }}>
                          Los campos contraseña no coinciden
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary ml-5"
                  onClick={this.updatePassword}
                  disabled={!isEnabled}
                >
                  Actualizar contraseña
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary ml-5"
                  onClick={this.handleClickPassword}
                >
                  Cancelar
                </button>
              </div>
            ) : null}

            {/* ------------------------------------ */}

            <button
              type="submit"
              className="btn btn-sm btn-outline-secondary ml-5 mt-3"
              onClick={this.update}
              data-dismiss="modal"
            >
              Guardar
            </button>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary ml-3 mt-3"
              data-dismiss="modal"
            >
              Cerrar
            </button>
            {!viewUpatePassword ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary ml-3 mt-3"
                onClick={this.handleClickPassword}
              >
                Cambiar contraseña
              </button>
            ) : null}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (store: IStore) => ({
  userProfile: store.userProfile
});

const mapDispatchToProps = {
  setProfile: setProfileAction,
  setLogout: setLogoutAction,
  setPassword: setPasswordAction
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateForm);
