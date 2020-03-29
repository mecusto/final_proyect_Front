import React, { PureComponent } from "react";
import Swal from "sweetalert2";
import {} from "reactstrap";
import { IStore } from "../../interfaces/IStore";
import { connect } from "react-redux";
import { IProperties } from "../../interfaces/IProperties";
import UpdateProperty from "../UpdateProperty/UpdateProperty";
import { deletePropertyAction } from "../../Redux/actions";
import { deleteProperty, deleteTenant } from "../../utils/API";
import { IReports } from "../../interfaces/IReport";
import { Link } from "react-router-dom";
import {
  PRIORITY_URGENT,
  PRIORITY_MEDIUM,
  PRIORITY_LOW,
  REPORT_STATE_NEW,
  REPORT_STATE_RESOLVED
} from "../../utils/constants";
import CheckTenant from "../CheckTenant/CheckTenant";
import Chat from "../chat";

//own props
interface IProps {
  selectedIdProperty?: number;
  closeDetails(): void;
}
//store props
interface IGlobalProps {
  properties: IProperties;
  reports: IReports;
  deletePropertyAct(id_property_details: number): void;
}

type TProps = IProps & IGlobalProps;

interface IState {}

class OnePropertyDetails extends PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.deleteOneProperty = this.deleteOneProperty.bind(this);
    this.delete = this.delete.bind(this);
  }

  deleteOneProperty() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons
      .fire({
        title: "¿Está seguro que quiere darse de baja?",
        text: "Esta operación no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Eliminar",
        cancelButtonText: "No, Cancelar!",
        reverseButtons: true
      })
      .then((result: any) => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            "Eliminado!",
            "La propiedad ha sido dada de baja.",
            "success"
          );
          this.delete();
        }
      });
  }

  delete() {
    (async () => {
      this.props.closeDetails(); //function coming from the parent to change the show details state
      const token = localStorage.getItem("token");
      await deleteProperty(token, this.props.selectedIdProperty); //fetch
      this.props.deletePropertyAct(this.props.selectedIdProperty); //action
      await deleteTenant(token, this.props.selectedIdProperty); // delete all tenants on property
    })();
  }

  render() {
    const reports = Object.values(this.props.reports.byId);

    // manage the selectedIdProperty: it may come from report or from propertyList
    let { selectedIdProperty } = this.props.properties;
    if (this.props.selectedIdProperty !== null) {
      selectedIdProperty = this.props.selectedIdProperty;
    }
    const property = this.props.properties.byId[selectedIdProperty];

    const ownReports = reports.filter(
      item =>
        item.id_property === property.id_property &&
        item.id_report_state !== REPORT_STATE_RESOLVED
    );
    const tenants = this.props.properties.tenants; //brings all the tenants from redux
    const ownTenants = tenants.filter(
      tenant => tenant.id_property === property.id_property
    );

    return (
      <div>
        <Chat></Chat>
        {/* ----------------PROPERTY DETAILS------------- */}
        <div
          className="card border-light property_details"
          style={{ width: "100", cursor: "default" }}
        >
          <div className="card-header " style={{ textAlign: "center" }}>
            <div className="card-body">
              <h4 className="card-title">{property.address_line1}</h4>
              <h6 className="card-title">{property.address_line2}</h6>
              <p className="card-text">{property.locality}</p>{" "}
              <p>
                {property.region}-{property.postcode}
              </p>
              {ownTenants.length ? (
                <div>
                  {" "}
                  <h5>INQUILINOS</h5>{" "}
                  {ownTenants.map(tenant => (
                    <p>
                      {tenant.name} {tenant.lastname} Salida:{" "}
                      {tenant.check_out.slice(0, 10)}
                    </p>
                  ))}
                </div>
              ) : null}
              <div style={{ display: "flex", flexDirection: "row" }}>
                {" "}
                <div className="col-md-5 ">
                  <button
                    style={{ width: "90%" }}
                    type="submit"
                    className="btn btn-sm btn-outline-secondary mt-4"
                    data-target="#updateProperty"
                    data-toggle="modal"
                  >
                    Editar
                  </button>
                </div>
                <Link
                  to={{
                    pathname: "/drive/pictures",
                    state: { id: this.props.selectedIdProperty }
                  }}
                >
                  <div className="box col-2 mt-3 storage">
                    <label htmlFor="storage">
                      <img
                        alt="Almacenamiento"
                        width={30}
                        src="../../../img/baseline_cloud_black_18dp.png"
                        style={{ cursor: "pointer" }}
                      />
                    </label>
                  </div>
                </Link>
                <div className="col-md-5 ">
                  {" "}
                  <button
                    style={{ width: "90%" }}
                    type="submit"
                    className="btn btn-sm btn-outline-secondary mt-4"
                    onClick={this.deleteOneProperty}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="propertyDetailsRow">
                <div className="offset-md-1 col-md-10 ">
                  <button
                    style={{ width: "90%" }}
                    type="submit"
                    className="btn btn-sm btn-outline-secondary mt-4"
                    data-target="#checkIn"
                    data-toggle="modal"
                  >
                    Registrar entrada
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* -------------REPORTS------------- */}
          <div className="reports text-center ">
            <h4 style={{ margin: "22px" }}>Incidencias</h4>
            {ownReports.map(report => (
              <Link
                to={{ pathname: `/report/${report.id_report}` }}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    textAlign: "left"
                  }}
                >
                  {report.id_priority === PRIORITY_URGENT && (
                    <p
                      style={{
                        color: "red",
                        cursor: "pointer",
                        margin: "15px"
                      }}
                    >
                      {report.title}
                    </p>
                  )}
                  {report.id_priority === PRIORITY_MEDIUM && (
                    <p
                      style={{
                        color: "rgb(165, 163, 21)",
                        cursor: "pointer",
                        margin: "15px"
                      }}
                    >
                      {report.title}
                    </p>
                  )}
                  {report.id_priority === PRIORITY_LOW && (
                    <p
                      style={{
                        color: "green",
                        cursor: "pointer",
                        margin: "15px"
                      }}
                    >
                      {report.title}
                    </p>
                  )}
                  {report.id_report_state === REPORT_STATE_NEW && (
                    <img
                      alt="Nueva incidencia"
                      className="ml-2"
                      style={{ width: "30px", height: "30px", margin: "15px" }}
                      src="../../../img/fiber_new-24px.svg"
                    />
                  )}
                </div>
              </Link>
            ))}

            <div className="col-md-12 divNewIncidencia">
              <Link to={`/newReport/${selectedIdProperty}`}>
                <button
                  type="submit"
                  className="btn btn-sm btn-outline-secondary my-3 "
                >
                  Crear incidencia
                </button>
              </Link>
              <p>
                <small style={{ color: "red" }}>Urgente </small>
                <small style={{ color: "rgb(165, 163, 21)" }}>
                  Prioridad media{" "}
                </small>
                <small style={{ color: "green" }}>Prioridad baja</small>
              </p>
            </div>
          </div>
        </div>

        {/* ----------- UPDATE MODAL ------------------------ */}
        <div
          className="modal fade"
          id="updateProperty"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Actualizar propiedad {selectedIdProperty}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <UpdateProperty propertyId={selectedIdProperty} />
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="checkIn"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Registrar entrada inquilino
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-body">
                <CheckTenant id_property={selectedIdProperty} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: IStore) => ({
  properties: store.properties,
  reports: store.reports
});

const mapDispatchToProps = {
  deletePropertyAct: deletePropertyAction
};

export default connect(mapStateToProps, mapDispatchToProps)(OnePropertyDetails);
