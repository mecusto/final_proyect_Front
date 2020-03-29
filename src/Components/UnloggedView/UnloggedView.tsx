import React, { PureComponent } from "react";

import {} from "reactstrap";

import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";

interface IProps {
  register(): void;
  cleanBody(): void;
  isVisibleRegister: boolean;
  isVisibleLogin: boolean;
}

interface IGlobalProps {}
type TProps = IProps & IGlobalProps;

interface IState {}

class UnloggedView extends PureComponent<TProps, IState> {
  render() {
    const { isVisibleLogin, isVisibleRegister } = this.props;

    return (
      <div>
        <div className="container-fluid initialView">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 emptyBox"></div>
            </div>
            <div className="row">
              <div className="col-md-4 col-12 positionLogin ml-3">
                <div>
                  {isVisibleLogin ? (
                    <LoginForm
                      cleanBody={this.props.cleanBody}
                      register={this.props.register}
                    />
                  ) : null}
                  <LoginForm
                    cleanBody={this.props.cleanBody}
                    register={this.props.register}
                  />
                </div>
              </div>

              <div className="col-md-7 col-12 registerBox">
                <div>
                  {isVisibleRegister ? (
                    <RegisterForm cleanBody={this.props.cleanBody} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: IStore) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(UnloggedView);
