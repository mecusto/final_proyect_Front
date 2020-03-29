import React from "react";
import { connect } from "react-redux";

//import produce from 'immer';
import swal from "sweetalert";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
// npm install emailjs-com --save

import {
  setReportsAction,
  setNewReportAction,
  setPhotoReportAction
} from "../../Redux/actions";
import { IStore } from "../../interfaces/IStore";

import { IReports, IReport } from "../../interfaces/IReport";
import {
  PRIORITY_LOW,
  ROLE_TENANT,
  PRIORITY_URGENT,
  PRIORITY_MEDIUM,
  ROLE_OWNER,
  host,
  EMAIL_SERVICE_ID,
  EMAIL_TEMPLATE_ID,
  EMAIL_USER_ID,
  messageOkUpdate,
  messageError,
  REPORT_STATE_RESOLVED,
  REPORT_STATE_OPEN
} from "../../utils/constants";
import { IProperty, IProperties } from "../../interfaces/IProperties";
import { setProfileFromToken } from "../../utils/utils";
import {
  getEmail,
  getReportwithProperty,
  updateReport,
  deletePhoto,
  deleteReport,
  updateStatus,
  getTenantEmail
} from "../../utils/API";
import { IProfile } from "../../interfaces/IProfile";
import { IUserEmail } from "../../interfaces/IUserEmail";
import { Link } from "react-router-dom";
import ImageComponent from "../ImageComponent/Image";
import Profesionals from "../Profesionals/Profesionals";

interface IState {
  property: IProperty;
  report: IReport;
  photo_report: string;
  author_name: string;
  author_lastname: string;
  author_email: string;
  userRxEmail: IUserEmail; // who should receive the email

  id_role: number;
  files?: File[];
  imagesPreviewUrl?: any[];
}

interface IProps {
  match: any;
  logout(): void;
  location: any;
  history: any;
}

interface IGlobalProps {
  reports: IReports;
  properties: IProperties;
  userProfile: IProfile;
  setPhotoReport(photo_report: string): void;
  setReports(reports: IReport[]): void;
  setNewReport(report: IReport): void;
}

type TProps = IProps & IGlobalProps;

class Report extends React.PureComponent<TProps, IState> {
  inputPhotoReportRef: React.RefObject<HTMLInputElement>;

  constructor(props: TProps) {
    super(props);
    this.state = {
      report: {
        id_report: null,
        id_property: null,
        title: "",
        description: "",
        openDate: "",
        closeDate: "",
        id_report_state: null,
        id_priority: null, // new report
        isDeleted: false,
        photos: []
      },
      property: {
        id_property: null,
        id_user: null, // report written by
        address_line1: "",
        address_line2: "",
        locality: "",
        region: "",
        postcode: null,
        photo_property: "",
        isDeleted: false
      },

      author_name: "",
      author_lastname: "",
      author_email: "",
      userRxEmail: { name: "", email: "" },

      id_role: ROLE_OWNER,
      photo_report: "",

      files: [],
      imagesPreviewUrl: []
    };

    this.inputPhotoReportRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.updateReport = this.updateReport.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
    this.deleteRep = this.deleteRep.bind(this);
    this.delPhoto = this.delPhoto.bind(this);
    this.updateSt = this.updateSt.bind(this);
  }
  // Get info from backend to prevent reload
  componentDidMount() {
    (async () => {
      const { id_report } = this.props.match.params;

      // get info from report owner, maybe owner or tenant
      const token = localStorage.getItem("token");
      const { name, lastname, id_role, email } = setProfileFromToken(token);
      const { report } = await getReportwithProperty(token, id_report);

      let userRxEmail: IUserEmail = {
        email: "",
        name: ""
      };
      if (id_role === ROLE_TENANT) {
        userRxEmail = await getEmail(report.results.id_property);
      } else if (id_role === ROLE_OWNER) {
        // let tenant: IUserEmail
        userRxEmail = await getTenantEmail(report.results.id_property);
      }

      this.setState({
        author_name: name,
        author_lastname: lastname,
        author_email: email,
        userRxEmail: userRxEmail,
        id_role: id_role,
        photo_report: "",
        report: {
          id_report: id_report,
          id_property: report.results.id_property,
          title: report.results.title,
          description: report.results.description,
          openDate: report.results.openDate,
          closeDate: report.results.closeDate,
          id_report_state: REPORT_STATE_OPEN, // state to open
          id_priority: report.results.id_priority,
          isDeleted: report.results.false,
          photos: report.photos
        },
        property: {
          id_property: report.results.id_property,
          id_user: report.results.id_user,
          address_line1: report.results.address_line1,
          address_line2: report.results.address_line2,
          locality: report.results.locality,
          region: report.results.region,
          postcode: report.results.postcode,
          photo_property: report.results.photo_property,
          isDeleted: report.results.isDeleted
        }
      });
    })();
  }

  handleChange(e: any) {
    let value = e.target.value;
    let name = e.target.name;

    if (e.target.name === "priority") {
      value = Number(value);
    }
    this.setState({ report: { ...this.state.report, [name]: value } });
  }

  onFileChange(e: any) {
    let newfiles: File[] = Array.from(e.target.files);
    for (let i = 0; i < newfiles.length; i++) {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({
          files: [...this.state.files, newfiles[i]],
          imagesPreviewUrl: [...this.state.imagesPreviewUrl, reader.result]
        });
      };
      reader.readAsDataURL(newfiles[i]);
    }
    this.setState({ photo_report: e.target.files });
  }

  sendEmail() {
    let templateParams = {};

    templateParams = {
      email: this.state.userRxEmail.email,
      name: this.state.userRxEmail.name,
      message_html: `La incidencia relativa a la vivienda ubicada en ${this.state.property.address_line1} ha sido modificada.`
    };

    emailjs
      .send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams, EMAIL_USER_ID)
      .then(
        function(response) {
          console.log("Email enviado!", response.status, response.text);
        },
        function(error) {
          console.log("Error...", error);
        }
      );
  }
  // TODO add report author on db and check who is before change status
  async updateSt() {
    const token = localStorage.getItem("token");
    let { id_report_state, id_report } = this.state.report;
    await updateStatus(token, id_report_state, id_report);
  }

  async updateReport() {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    if (this.inputPhotoReportRef.current?.files) {
      for (let i = 0; i < this.inputPhotoReportRef.current.files.length; i++) {
        formData.append(
          "photo_report",
          this.inputPhotoReportRef.current.files[i]
        );
      }
    }
    let {
      id_report,
      id_property,
      title,
      description,
      openDate,
      id_report_state,
      id_priority,
      isDeleted
    } = this.state.report;

    formData.append("id_report", String(id_report));
    formData.append("id_property", String(id_property));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("openDate", openDate);
    formData.append("closeDate", "");
    formData.append("id_report_state", String(id_report_state));
    formData.append("id_priority", String(id_priority));
    formData.append("isDeleted", String(isDeleted));

    const { reportUpdated } = await updateReport(token, formData, id_report);

    swal(reportUpdated === true ? messageOkUpdate : messageError);
    this.sendEmail();
    this.props.history.push("/");
  }

  async deleteRep() {
    const { id_report } = this.state.report;
    const token = localStorage.getItem("token");

    const { reportDeleted } = await deleteReport(token, id_report);
    if (reportDeleted === true) {
      this.sendEmail();
      this.props.history.push("/");
    }
  }

  async delPhoto(photo: string) {
    // delete photo on DB
    const token = localStorage.getItem("token");
    const { photoDeleted } = await deletePhoto(token, photo);
    // delete photo on state
    if (photoDeleted === true) {
      const aux = this.state.report.photos.filter(
        p => photo !== p.photo_report
      );
      this.setState({ report: { ...this.state.report, photos: aux } });
    }
  }

  deleteSwal(toDelete: string, photo?: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons
      .fire({
        title: "¿Está seguro que desea eliminar?",
        text: "Esta operación no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true
      })
      .then((result: any) => {
        if (result.value) {
          if (toDelete === "photo") {
            this.delPhoto(photo);
          } else if (toDelete === "report") {
            this.deleteRep();
          }

          swalWithBootstrapButtons.fire(
            "Eliminado!",
            "Los datos han sido eliminados",
            "success"
          );
        }
      });
  }

  // TODO mover container para meter profesionales
  render() {
    const { author_name, author_lastname, id_role } = this.state;
    const {
      title,
      description,
      id_priority,
      id_report_state
    } = this.state.report;

    const { address_line1, locality } = this.state.property;

    return (
      <div className="container-fluid fondoReport">
        {/* -------------- DATOS DEL AUTOR DEL REPORT Y DE LA VIVIENDA ---------------- */}
        <div className="container bigBoxReport">
          <div className="miniLogo"></div>
          <div className="row">
            <div className="col-md-2"></div>
            <div className="col-md-6 detailsBox">
              <h3 id="beginning">{address_line1}</h3>
              <h3>{locality}</h3>

              <h5>
                {" "}
                Autor: {author_name} {author_lastname}
              </h5>
            </div>
            {id_role === ROLE_OWNER ? (
              <div className="col-2 m-2">
                <a href="#profesionals">
                  <button
                    type="submit"
                    className="btn btn-sm btn-outline-dark ml-5"
                    style={{ cursor: "pointer" }}
                  >
                    Buscar profesionales
                  </button>
                </a>
              </div>
            ) : null}
          </div>
          {/* -------------- FORMULARIO INCIDENCIA ---------------- */}
          <div className="form-row">
            <div className="col-md-1"></div>
            <div className="col-md-6">
              <div className="form-group">
                <label className="col-form-label"> Título:</label>
                <input
                  type="text"
                  name="title"
                  className="form-control form-control-sm"
                  value={title}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label className="col-form-label"> Descripción:</label>
                <textarea
                  name="description"
                  className="form-control form-control-sm textArea"
                  value={description}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label className="col-form-label">Prioridad:</label>
                <select
                  name="id_priority"
                  onChange={this.handleChange}
                  className="form-control form-control-sm"
                >
                  <option
                    value={PRIORITY_URGENT}
                    selected={id_priority === PRIORITY_URGENT}
                  >
                    Urgente
                  </option>
                  <option
                    value={PRIORITY_MEDIUM}
                    selected={id_priority === PRIORITY_MEDIUM}
                  >
                    Prioridad media
                  </option>
                  <option
                    value={PRIORITY_LOW}
                    selected={id_priority === PRIORITY_LOW}
                  >
                    {" "}
                    Prioridad baja
                  </option>
                </select>
              </div>
              {/* ------------------ CHANGE STATUS ---------------- */}
              <div className="form-group">
                {id_role === ROLE_OWNER ? (
                  <>
                    <label className="col-form-label">Estado:</label>
                    <select
                      name="id_report_state"
                      onChange={this.handleChange}
                      className="form-control form-control-sm"
                    >
                      {" "}
                      <option selected value=""></option>
                      <option
                        value={REPORT_STATE_OPEN}
                        selected={id_report_state === REPORT_STATE_OPEN}
                      >
                        Incidencia sin resolver
                      </option>
                      <option
                        value={REPORT_STATE_RESOLVED}
                        selected={id_report_state === REPORT_STATE_RESOLVED}
                      >
                        Incidencia resuelta
                      </option>
                    </select>
                  </>
                ) : null}
              </div>
            </div>

            {/* -------------- SHOW EXISTING PHOTOS  ---------------- */}
            {/* 
            // TODO lupa on cursor */}
            <div className="col-md-4 boxFotos">
              {this.state.report.photos.map(photo => (
                <div>
                  <div
                    id="photos"
                    key={photo.id_photo_report}
                    className="card  my-2 ml-2"
                    style={{
                      width: "150px",
                      height: "150px"
                    }}
                  >
                    <ImageComponent
                      src={`${host}reports/${photo.photo_report}`}
                    ></ImageComponent>
                  </div>

                  {/* -------------- DELETE PHOTO BUTTON ---------------- */}
                  <div className="box col-md-4">
                    <label htmlFor="delete">
                      <img
                        alt="Borrar"
                        width={20}
                        src="../../img/delete-24px.svg"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          this.deleteSwal("photo", photo.photo_report)
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* -------------- BUTTONS  ---------------- */}
          <div className="row">
            {/* <div className="col-1"></div> */}
            {/* -------------- UPLOAD PHOTO  ---------------- */}
            <div className="box offset-md-1 col-md-2">
              <label htmlFor="photo_report">
                <small>Añadir fotos</small>
                <img
                  alt="Agregar foto"
                  style={{ cursor: "pointer", marginLeft: "5%" }}
                  width={20}
                  src="../../img/baseline_add_a_photo_black_18dp.png"
                />
              </label>
              <input
                type="file"
                id="photo_report"
                accept="image/*, .pdf" //any image file and .pdf, other option: "image/png, image/jpeg"
                ref={this.inputPhotoReportRef}
                style={{ display: "none" }}
                onChange={this.onFileChange}
                multiple
              />
              <div className="row">
                <div className="previewImage-container">
                  {this.state.imagesPreviewUrl
                    ? this.state.imagesPreviewUrl.map(image => (
                        <div className="image-container">
                          <img src={image} alt="icon" width={80} />{" "}
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>

            <div className=" my-3 responsive d-flex">
              <div className="col-md-3 botones">
                <button
                  type="submit"
                  className="btn btn-sm btn-outline-dark my-btn"
                  onClick={this.updateReport}
                  style={{ cursor: "pointer" }}
                >
                  Guardar
                </button>
              </div>
              <div className="col-md-3 botones">
                <button
                  className="btn btn-sm btn-outline-dark  my-btn"
                  onClick={() => this.deleteSwal("report")}
                  style={{ cursor: "pointer" }}
                >
                  Eliminar
                </button>
              </div>
              <div className="col-md-3 botones">
                <Link to="/">
                  <button
                    type="submit"
                    className="btn btn-sm btn-outline-dark  my-btn"
                    style={{ cursor: "pointer" }}
                    onClick={this.updateSt}
                  >
                    Volver
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {id_role === ROLE_OWNER ? (
          <div className="container bigBoxReport dissapear">
            <div className="row">
              <div className="col-2"></div>
              <div className="offset-md-1 col-md-6 detailsBox">
                <h3 className="m-3">Buscador de profesionales</h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12 listProfesional" id="profesionals">
                <Profesionals />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (store: IStore) => ({
  reports: store.reports,
  properties: store.properties,
  userProfile: store.userProfile
});

const mapDispatchToProps = {
  setReports: setReportsAction,
  setNewReport: setNewReportAction,
  setPhotoReport: setPhotoReportAction
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);
