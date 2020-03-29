import React from "react";
import { connect } from "react-redux";
import {
  setProfileAction,
  setTenantInfoAction,
  setReportsAction
} from "../../Redux/actions";
import { IProfile } from "../../interfaces/IProfile";
import { IStore } from "../../interfaces/IStore";

import {
  getTenantPropertyDetails,
  getTenantReportDetails
} from "../../utils/API";

import { Link } from "react-router-dom";
import { ITenantInfo } from "../../interfaces/ITenantInfo";
import { IReports, IReport } from "../../interfaces/IReport";
import {
  host,
  REPORT_STATE_RESOLVED,
  PRIORITY_URGENT,
  PRIORITY_MEDIUM,
  PRIORITY_LOW,
  REPORT_STATE_NEW
} from "../../utils/constants";

interface IState {
  report: IReport;
  areReportsVisible: boolean;
}
interface IProps {}
interface IGlobalProps {
  userProfile: IProfile;
  tenantInfo: ITenantInfo;
  reports: IReports;
  setProfile(profile: IProfile): void;
  setInfo(info: ITenantInfo): void;
  setReports(reports: IReport[]): void;
}

type TProps = IProps & IGlobalProps;

class TenantView extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);
    this.state = {
      areReportsVisible: false,
      report: {
        id_report: null,
        id_property: this.props.tenantInfo.id_property,
        title: "",
        description: "",
        openDate: "",
        closeDate: "",
        id_report_state: null,
        id_priority: null,
        isDeleted: false,
        photos: []
      }
    };
  }

  componentDidMount() {
    const { id_user, token } = this.props.userProfile;
    (async () => {
      const tenantProperty: ITenantInfo = await getTenantPropertyDetails(
        token,
        id_user
      );
      this.props.setInfo(tenantProperty);
      const id_property = this.props.tenantInfo.id_property; //si el idproperty ya esta en el store porque no puedo acceder en el render????
      const reports = await getTenantReportDetails(token, id_property);
      this.props.setReports(reports);
    })();
  }

  render() {
    const { byId } = this.props.reports;
    const reports = Object.values(byId);
    const { tenantInfo } = this.props;
    //we just want to show the reports which state is not solved so we filter them first
    const activeReports = reports.filter(
      item =>
        item.id_property === this.props.tenantInfo.id_property &&
        item.id_report_state !== REPORT_STATE_RESOLVED
    );
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 emptyBox2"></div>
          </div>
          <div className="row">
            <div className=" col-md-5">
              <div className="ml-1 tenantInfo">
                <h3>{tenantInfo.address_line1}</h3>
                <h6>Entrada: {tenantInfo.check_in.slice(0, 10)}</h6>
                <h6>Salida: {tenantInfo.check_out.slice(0, 10)}</h6>
              </div>
              <div className="row ">
                <div className="col-md-4 col-sm-1 tenantButtons">
                  <button
                    onClick={() =>
                      this.setState(prevState => ({
                        areReportsVisible: !prevState.areReportsVisible
                      }))
                    }
                    type="submit"
                    className="btn btn-sm btn-outline-secondary mt-4 mb-3"
                  >
                    Ver incidencias
                  </button>
                </div>
                <div className="col-md-4 col-sm-1 tenantButtons">
                  <Link to={`/newReport/${this.props.tenantInfo.id_property}`}>
                    <button
                      type="submit"
                      className="btn btn-sm btn-outline-secondary mt-4"
                    >
                      Crear incidencia
                    </button>
                  </Link>
                </div>
              </div>
              {this.state.areReportsVisible &&
                activeReports.map(report => (
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
                        <p style={{ color: "red", cursor: "pointer" }}>
                          {report.title}
                        </p>
                      )}
                      {report.id_priority === PRIORITY_MEDIUM && (
                        <p
                          style={{
                            color: "rgb(165, 163, 21)",
                            cursor: "pointer"
                          }}
                        >
                          {report.title}
                        </p>
                      )}
                      {report.id_priority === PRIORITY_LOW && (
                        <p style={{ color: "green", cursor: "pointer" }}>
                          {report.title}
                        </p>
                      )}
                      {report.id_report_state === REPORT_STATE_NEW && (
                        <img
                          alt="Nueva incidencia"
                          className="ml-2"
                          style={{ width: "30px", height: "30px" }}
                          src="../../../img/fiber_new-24px.svg"
                        />
                      )}
                    </div>
                  </Link>
                ))}
            </div>
            <div className=" col-lg-6 col-md-6 col-12 ">
              <img
              className="photoPropertyTenant"
              style={{maxHeight: "60vh"}}
                src={`${host}properties/${this.props.tenantInfo.photo_property}`}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (store: IStore) => ({
  userProfile: store.userProfile,
  tenantInfo: store.tenantInfo,
  reports: store.reports
});
const mapDispatchToProps = {
  setProfile: setProfileAction,
  setInfo: setTenantInfoAction,
  setReports: setReportsAction
};
export default connect(mapStateToProps, mapDispatchToProps)(TenantView);
