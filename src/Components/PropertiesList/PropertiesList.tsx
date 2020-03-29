import React, { PureComponent } from "react";
import {} from "reactstrap";

import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { IProperty, IProperties } from "../../interfaces/IProperties";
import { IReport } from "../../interfaces/IReport";
import {
  setPropertiesAction,
  setTenantsAction,
  setSelectedPropertyAction,
  setDetailVisibleAction
} from "../../Redux/actions";
import { getProperties, getAllReports, getTenants } from "../../utils/API";
import { IProfile } from "../../interfaces/IProfile";
import OnePropertyDetails from "../OnePropertyDetails/OnePropertyDetails";
import PropertyForm from "../PropertyForm/PropertyForm";
import { host, REPORT_STATE_RESOLVED } from "../../utils/constants";
import { CSSTransition } from "react-transition-group";
import { IReports } from "../../interfaces/IReport";
import { setReportsAction, resetReportsAction } from "../../Redux/actions";
import { ITenant } from "../../interfaces/ITenant";

//own props
interface IProps {}

//props coming from the store
interface IGlobalProps {
  userProfile: IProfile;
  properties: IProperties;
  reports: IReports;
  setProperties(propertiesList: IProperty[]): void;
  setReports(reports: IReport[]): void;
  resetReports(): void;
  setTenants(tenants: ITenant[]): void;
  setSelectedProperty(id: number): void;
  setDetailVisible(siOno: boolean): void;
}

type TProps = IProps & IGlobalProps; //conjunto de las props propias y las que vienen del store

interface IState {
  detailsVisible: boolean;
  selectedIdProperty: number;
  addFormVisible: boolean;
  showTransition: boolean;
}

class PropertiesLlist extends PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);

    this.state = {
      detailsVisible: false,
      addFormVisible: false,
      selectedIdProperty: null,
      showTransition: true
    };
    this.showPropertyDetails = this.showPropertyDetails.bind(this);
    this.closePropertyDetails = this.closePropertyDetails.bind(this);
    this.toggleAddForm = this.toggleAddForm.bind(this);
  }

  componentDidMount() {
    // ojo results sin llaves !!!!
    (async () => {
      const { token } = this.props.userProfile;
      if (token) {
        //set all properties to the store
        const properties = await getProperties(token);
        this.props.setProperties(properties);
        //set all tenants to the store
        const tenants = await getTenants(token);
        if (tenants.length && !this.props.properties.tenants.length) {
          this.props.setTenants(tenants);
        }
        //set all the repoorts
        const { reports } = await getAllReports(token);
        if (reports.length) {
          this.props.setReports(reports);
        } else {
          this.props.resetReports();
        }
        const first_property = properties.slice(0, 1);
        if (this.props.properties.detailsVisible === false) {
          this.props.setSelectedProperty(first_property[0].id_property);
          this.showPropertyDetails(first_property[0].id_property);
        } else {
          this.showPropertyDetails(this.props.properties.selectedIdProperty);
        }
      }
    })();
  }

  showPropertyDetails(id: number): void {
    if (this.state.detailsVisible === true) {
      this.setState({ detailsVisible: false });
      this.props.setSelectedProperty(id);
      this.props.setDetailVisible(true);
      setTimeout(
        () => this.setState({ selectedIdProperty: id, detailsVisible: true }),
        200
      );
    } else {
      setTimeout(
        () => this.setState({ selectedIdProperty: id, detailsVisible: true }),
        10
      );
    }
  }

  closePropertyDetails(): void {
    this.setState({ detailsVisible: false });
  }

  toggleAddForm() {
    this.setState(prevState => ({
      addFormVisible: !prevState.addFormVisible
    }));
  }

  render() {
    const { byId } = this.props.properties;
    const properties = Object.values(byId); // it creates an array out of the object(byId)

    const { detailsVisible, showTransition } = this.state;

    const reportsById = this.props.reports.byId;
    const reports = Object.values(reportsById);
    return (
      <>
        <div className="container-fluid ">
          <div className="row">
            <div className="col-md-7 col-12 mx-0">
              <div className="col-md-12 ml-1">
                <div className="col-12 emptyBox2"></div>
                <button
                  style={{ width: "94%" }}
                  type="submit"
                  className="btn btn-sm property-button mt-4"
                  data-target="#addProperty"
                  data-toggle="modal"
                  onClick={this.toggleAddForm}
                >
                  Añadir Propiedad
                </button>
              </div>

              {/* ----------------LIST OF PROPERTIES------------- */}
              <div className="col-md-12 propertiesDiv">
                {properties.map(property => (
                  <div
                    id="propertiesList"
                    key={property.id_property}
                    className="card my-3 ml-1 mainProperty"
                    style={{
                      maxWidth: "13rem",
                      height: "13rem",
                      maxHeight: "13rem",
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      this.showPropertyDetails(property.id_property)
                    }
                  >
                    {property.photo_property === null ||
                    property.photo_property === "null" ? (
                      <img
                        style={{ height: "9rem" }}
                        src="https://www.esididiomas.es/blog/wp-content/uploads/2018/08/casa.jpg"
                        className="card-img-top"
                        alt="..."
                      />
                    ) : (
                      <img
                        style={{ height: "9rem" }}
                        src={`${host}properties/${property.photo_property}`}
                        className="card-img-top"
                        alt="..."
                      />
                    )}
                    <div
                      style={{
                        backgroundColor: "rgb(70, 88, 102)",
                        color: "white",
                        textAlign: "center",
                        maxHeight: "6rem"
                      }}
                      className="card-header card-bottomPart houses "
                    >
                      {reports.some(
                        item =>
                          item.id_property === property.id_property &&
                          item.id_report_state !== REPORT_STATE_RESOLVED
                      ) ? (
                        <img
                          src="../../../img/property_notification.png"
                          width={20}
                          alt="..."
                        />
                      ) : null}
                      <div className="card-body">
                        <p style={{ fontSize: 14 }} className="card-title">
                          {property.address_line1}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* ------------------DETAILS-------------- */}

            <div className="col-md-5 mt-5">
              {" "}
              {detailsVisible ? (
                <CSSTransition
                  in={showTransition}
                  appear={true}
                  timeout={500}
                  classNames="fade"
                >
                  <OnePropertyDetails
                    closeDetails={this.closePropertyDetails}
                    selectedIdProperty={this.state.selectedIdProperty}
                  />
                </CSSTransition>
              ) : null}
            </div>

            {/* -------------------MODAL------------- */}
            <div>
              <div
                className="modal fade"
                id="addProperty"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Añadir propiedad
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        data-target="#addProperty"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body updatePropertyForm">
                      <PropertyForm
                        showPropertyDetails={this.showPropertyDetails}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

//states we are gonna take from the IStore
const mapStateToProps = (store: IStore) => ({
  userProfile: store.userProfile,
  properties: store.properties,
  reports: store.reports
});

// we send actions to the reducer(only to save states) and the reducer save what we send in the action
const mapDispatchToProps = {
  setProperties: setPropertiesAction,
  setReports: setReportsAction,
  resetReports: resetReportsAction,
  setTenants: setTenantsAction,
  setSelectedProperty: setSelectedPropertyAction,
  setDetailVisible: setDetailVisibleAction
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesLlist);
