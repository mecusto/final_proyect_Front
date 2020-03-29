import React, { PureComponent } from "react";
import "./style.css";

import { IProfile } from "../../interfaces/IProfile";
import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { Redirect, Link } from "react-router-dom";


interface IProps {

}

interface IGlobalProps {
  userProfile: IProfile;
}

type TProps = IProps & IGlobalProps;

interface IState {
  isOpen: boolean;
  number: number;
  redirect: boolean;
}

class UnLoggedNavbar extends PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      isOpen: false,
      number: 1,
      redirect: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(isOpen => ({
      isOpen: !isOpen
    }));
  }

  handleOnClick() {
    this.setState({ redirect: true });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/profile" />;
    }

    const { token } = this.props.userProfile;
    

    return (
      <nav className="navbar fixed-top navbar-expand-lg navbar-light navbarUnlogged">
        <div className="col-md-2 boxLogo ml-3"></div>
       

        <div className="collapse navbar-collapse" >

          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              {token ? (
                <Link to="/" className="nav-link">
                  Inicio <span className="sr-only navbarItems"></span>
                </Link>
              ) : null}
            </li>
            <li className="nav-item">
              {(
                <Link to="/" className="nav-link navbarItems">
                  Home
                </Link>
              )}
            </li>
            
            <li className="nav-item navbarItems">
              {!token ? (
                <Link to="/" className="nav-link">
                  Quienes somos
                </Link>
              ) : null}
            </li>
            <li className="nav-item navbarItems">
              {!token ? (
                <Link to="/" className="nav-link" >
                  Contacto
                </Link>
              ) : null}
            </li>
          </ul>
          
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (store: IStore) => ({ userProfile: store.userProfile });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UnLoggedNavbar);
