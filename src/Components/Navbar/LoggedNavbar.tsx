import React, { PureComponent } from "react";
import "./style.css";

import { IProfile } from "../../interfaces/IProfile";
import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { Redirect } from "react-router-dom";

interface IProps {}

interface IGlobalProps {
  userProfile: IProfile;
}

type TProps = IProps & IGlobalProps;

interface IState {
  isOpen: boolean;
  number: number;
  redirect: boolean;
}

class LoggedNavbar extends PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      isOpen: false,
      number: 1,
      redirect: false
    };
  }

  handleOnClick() {
    this.setState({ redirect: true });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/profile" />;
    }

    // const { token } = this.props.userProfile;
    // const { logout } = this.props;

    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-light ">
        <div className="collapse navbar-collapse navbarCss">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item miniLogo">
              <div className=""></div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (store: IStore) => ({ userProfile: store.userProfile });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoggedNavbar);
