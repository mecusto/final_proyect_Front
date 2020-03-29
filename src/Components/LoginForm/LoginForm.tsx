import React from "react";
import { connect } from "react-redux";
// import "./form.css";

import swal from "sweetalert";
import { setProfileAction } from "../../Redux/actions";
import { messageError, messageOkLogin } from "../../utils/constants";
import { ROLE_OWNER } from "../../utils/constants";

import { IProfile } from "../../interfaces/IProfile";
import { setProfileFromToken } from "../../utils/utils";
import { IStore } from "../../interfaces/IStore";
import { authUser } from "../../utils/API";
import { Link } from "react-router-dom";

interface IState {
  email: string;
  password: string;
  id_role: number;
  isValidPassword: boolean;
}

interface IProps {
  cleanBody(): void;
  register(): void;
}
interface IGlobalProps {
  userProfile: IProfile;
  setProfile(userProfile: IProfile): void;
}
type TProps = IProps & IGlobalProps;

class Login extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      email: "",
      password: "",
      id_role: ROLE_OWNER,
      isValidPassword: false
    };

    this.getToken = this.getToken.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
  }
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
  getToken() {
    (async () => {
      const { email, password } = this.state;

      try {
        const { token } = await authUser(email, password);
        swal(token ? messageOkLogin : messageError);
        const profile: IProfile = setProfileFromToken(token); // get info from token

        this.props.setProfile(profile); // set profile on Store
        this.props.cleanBody(); // hide login form
        localStorage.setItem("token", profile.token);
      } catch (err) {
        console.log(err);
        swal(messageError);
      }
    })();
  }

  enterPressed(event: any) {
    let code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      this.getToken();
    }
  }

  render() {
    const { register } = this.props;
    return (
      <div className="loginBox">
        <div className="row">
          <div className="col">
            <label className=""> email:</label>
            <input
              type="email"
              name="email"
              className="form-control form-control-sm"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
          <div className="col">
            <label className=""> Contraseña:</label>
            <input
              type="password"
              name="password"
              className="form-control form-control-sm"
              value={this.state.password}
              onChange={this.handleChange}
              onKeyPress={this.enterPressed}
            />
          </div>
          <div className="col mt-2 buttonLogin">
            <button
              type="submit"
              className="btn btn-sm btn-outline-light mt-4 "
              onClick={this.getToken}
            >
              Login
            </button>
          </div>
        </div>
        <div className="mb-2">
          <Link to="/" className="" onClick={register}>
            <small>¿Aún no eres usuario? Regístrate!</small>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: IStore) => ({ userProfile: store.userProfile });

const mapDispatchToProps = { setProfile: setProfileAction };

export default connect(mapStateToProps, mapDispatchToProps)(Login);
