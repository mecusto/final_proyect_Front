import React from "react";
import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { IProperties } from "../../interfaces/IProperties";
import { checkIn, getEmailExists } from "../../utils/API";
import { setNewTenantAction } from "../../Redux/actions";
import { ITenant } from "../../interfaces/ITenant";

interface IState {
  emailExists: boolean;

  id_user: number;
  id_property: number;
  name: string;
  lastname: string;
  email: string;
  phone_number: string;
  password: string;
  check_in: string;
  check_out: string;
}

interface IGlobalProps {
  properties: IProperties;
  setNewTenant(tenant: ITenant): void;
}

interface IProps {
  id_property: number;
}
type TProps = IProps & IGlobalProps;

class CheckTenant extends React.Component<TProps, IState> {
  inputPhoto_propertyeRef: React.RefObject<HTMLInputElement>;
  constructor(props: TProps) {
    super(props);
    this.state = {
      emailExists: false,

      id_user: null,
      id_property: this.props.id_property,
      name: "",
      lastname: "",
      email: "",
      phone_number: "",
      password: "",
      check_in: "",
      check_out: ""
    };
    this.sendForm = this.sendForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.cleanForm = this.cleanForm.bind(this);
    this.emailExists = this.emailExists.bind(this);
  }

  async sendForm() {
    const token = localStorage.getItem("token");
    const {
      id_user,
      id_property,
      name,
      lastname,
      email,
      phone_number,
      password,
      check_in,
      check_out
    } = this.state;
    const tenant = {
      id_user,
      id_property,
      name,
      lastname,
      email,
      phone_number,
      password,
      check_in,
      check_out
    };

    const results = await checkIn(token, tenant, this.props.id_property);
    //if the backend returns true means the tenant has been adeed and we add it to redux too
    if (results) {
      this.props.setNewTenant(tenant);
    }
    this.cleanForm();
  }

  cleanForm() {
    this.setState({
      name: "",
      lastname: "",
      email: "",
      phone_number: "",
      password: "",
      check_in: "",
      check_out: ""
    });
  }

  async emailExists() {
    const { email } = this.state;
    const response = await getEmailExists(email);
    this.setState({ emailExists: response });
  }

  handleChange(e: any) {
    let value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    });
  }

  render() {
    const patt = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/; //regexp to control the date format DD/MM/YYYY
    let areDatesOk = false;
    let allFieldsFilled = false;
    let allfieldsOk = false;
    let emailOk = false;
    const {
      name,
      lastname,
      email,
      phone_number,
      password,
      emailExists
    } = this.state;

    if (
      email.length >= 8 &&
      email.includes("@") &&
      (email.includes(".es") || email.includes(".com"))
    ) {
      emailOk = !emailOk;
    }

    if (
      name.length > 1 &&
      lastname.length > 1 &&
      email.length > 1 &&
      phone_number.length > 8 &&
      password.length
    ) {
      allFieldsFilled = true;
    }

    if (this.state.check_in.match(patt) && this.state.check_out.match(patt)) {
      areDatesOk = true;
    }

    if (allFieldsFilled && areDatesOk && emailOk) {
      allfieldsOk = true;
    }

    return (
      <div className="tenantForm col-12">
        <label className="col-form-label">Nombre:</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={this.state.name}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Apellidos</label>
        <input
          type="text"
          className="form-control"
          name="lastname"
          value={this.state.lastname}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Email:</label>
        <input
          type="text"
          className="form-control"
          name="email"
          value={this.state.email}
          onChange={this.handleChange}
          onBlur={this.emailExists}
        ></input>

        {!emailOk ? (
          <div>
            <span style={{ color: "rgb(180, 11, 11)", fontSize: 12 }}>
              El email debe tener el formato correcto
            </span>
          </div>
        ) : null}

        {emailExists ? (
          <div>
            <span style={{ color: "rgb(180, 11, 11)", fontSize: 12 }}>
              El email ya existe en la base de datos
            </span>
          </div>
        ) : null}

        <label className="col-form-label">Telefono:</label>
        <input
          type="text"
          className="form-control"
          name="phone_number"
          value={this.state.phone_number}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Contraseña provisional:</label>
        <input
          type="password"
          className="form-control"
          name="password"
          value={this.state.password}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Entrada:</label>
        <input
          type="text"
          className="form-control"
          name="check_in"
          value={this.state.check_in}
          onChange={this.handleChange}
        ></input>
        {}

        <label className="col-form-label">Salida:</label>
        <input
          type="text"
          className="form-control"
          name="check_out"
          value={this.state.check_out}
          onChange={this.handleChange}
        ></input>

        {allfieldsOk && (
          <div className=" offset-md-4 col-md-3">
            {" "}
            <button
              style={{ marginLeft: "5%" }}
              type="submit"
              className="btn btn-sm btn-outline-secondary mt-4"
              onClick={this.sendForm}
              data-dismiss="modal"
              disabled={!allfieldsOk}
            >
              Enviar
            </button>
          </div>
        )}
        {!allFieldsFilled && (
          <div>
            {" "}
            <span
              style={{
                color: "rgb(180, 11, 11)",
                fontSize: 12,
                marginRight: "10%"
              }}
            >
              Todos los campos* deben estar rellenos
            </span>
          </div>
        )}

        {!areDatesOk && (
          <div>
            {" "}
            <span
              style={{
                color: "rgb(180, 11, 11)",
                fontSize: 12,
                marginRight: "10%"
              }}
            >
              la fecha debe tener el formato DD/MM/YYY
            </span>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (store: IStore) => ({
  properties: store.properties
});

const mapDispatchToProps = {
  setNewTenant: setNewTenantAction
};

export default connect(mapStateToProps, mapDispatchToProps)(CheckTenant);
