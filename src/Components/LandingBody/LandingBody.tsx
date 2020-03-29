import React, { PureComponent } from "react";

import {} from "reactstrap";

import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { setProfileFromToken } from "../../utils/utils";

import { IProfile } from "../../interfaces/IProfile";
import {
  setProfileAction,
  setLogoutAction,
  setPasswordAction
} from "../../Redux/actions";
import UnloggedView from "../UnloggedView/UnloggedView";
import Owner from "../Owner/Owner";
import { ROLE_OWNER, ROLE_TENANT } from "../../utils/constants";

import UnLoggedNavbar from "../Navbar/UnLoggedNavbar";
import LoggedNavbar from "../Navbar/LoggedNavbar";
import Tenant from "../Tenant/Tenant";

interface IProps {
  // history: any;
}

interface IGlobalProps {
  userProfile: IProfile;
  setProfile(profile: IProfile): void;
  setLogout(): void;
  setPassword(password: string): void;
}
type TProps = IProps & IGlobalProps;

interface IState {
  isVisibleRegister: boolean;
  isVisibleLogin: boolean;
  isVisibleUpdate: boolean;
}

class LandingBody extends PureComponent<TProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isVisibleRegister: false,
      isVisibleLogin: false,
      isVisibleUpdate: false
    };

    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.cleanBody = this.cleanBody.bind(this);
    this.isVisibleUpdate = this.isVisibleUpdate.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    if (token) {
      const profile = setProfileFromToken(token);
      this.props.setProfile(profile);
    }
  }

  cleanBody() {
    this.setState({ isVisibleRegister: false });
    this.setState({ isVisibleLogin: false });
  }

  register() {
    this.setState(state => ({ isVisibleRegister: !state.isVisibleRegister }));
  }

  login() {
    this.setState(state => ({ isVisibleLogin: !state.isVisibleLogin }));
  }

  logout() {
    localStorage.removeItem("token");
    this.props.setLogout();
  }

  isVisibleUpdate() {
    this.setState(state => ({ isVisibleUpdate: !state.isVisibleUpdate }));
  }
  render() {
    const { token, id_role } = this.props.userProfile;
    // const {  } = this.state;
    const { isVisibleRegister, isVisibleLogin } = this.state;
    return (
      <div>
        {!token && (
          <>
            <UnLoggedNavbar></UnLoggedNavbar>
            <UnloggedView
              cleanBody={this.cleanBody}
              register={this.register}
              isVisibleRegister={isVisibleRegister}
              isVisibleLogin={isVisibleLogin}
            />
          </>
        )}
        {token && (
          <div>
            {" "}
            <div className="loggedView">
              <LoggedNavbar />
              {id_role === ROLE_TENANT && (
                <div>
                  <Tenant logout={this.logout} />
                </div>
              )}
              {id_role === ROLE_OWNER && (
                <>
                  <Owner logout={this.logout} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(LandingBody);
