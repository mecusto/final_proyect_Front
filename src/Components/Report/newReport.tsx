import React from "react";
import { connect } from "react-redux";

import emailjs from "emailjs-com";

import {
  setReportsAction,
  setNewReportAction,
  setPhotoReportAction,
  setSelectedPropertyAction
} from "../../Redux/actions";
import { IStore } from "../../interfaces/IStore";

import { IReports, IReport } from "../../interfaces/IReport";
import {
  REPORT_STATE_NEW,
  PRIORITY_LOW,
  ROLE_TENANT,
  PRIORITY_URGENT,
  PRIORITY_MEDIUM,
  ROLE_OWNER,
  EMAIL_SERVICE_ID,
  EMAIL_TEMPLATE_ID,
  EMAIL_USER_ID
} from "../../utils/constants";
import { IProperty, IProperties } from "../../interfaces/IProperties";
import { setProfileFromToken, getDate } from "../../utils/utils";
import { getEmail, postNewReport, getProperty } from "../../utils/API";
import { IProfile } from "../../interfaces/IProfile";
import history from "../../utils/history";
import { Link } from "react-router-dom";
import { IUserEmail } from "../../interfaces/IUserEmail";

interface IState {
  id_report: number | null;
  id_property: number;
  property: IProperty;
  title: string;
  description: string;
  openDate: string;
  closeDate: string;
  id_report_state: number;
  id_priority: number;
  isDeleted: boolean;
  author_name: string;
  author_lastname: string;
  author_email: string;
  owner_email: string;
  owner_name: string;
  id_role: number;
  photo_report: string;

  files?: File[];
  imagesPreviewUrl?: any[];
}

interface IProps {
  match: any;
  history: any;
  logout(): void;
  location: any;
}

interface IGlobalProps {
  reports: IReports;
  properties: IProperties;
  userProfile: IProfile;
  setPhotoReport(photo_report: string): void;
  setReports(reports: IReport[]): void;
  setNewReport(report: IReport): void;
  setSelectedProperty(id_property: number): void;
}

type TProps = IProps & IGlobalProps;

class NewReport extends React.PureComponent<TProps, IState> {
  inputPhotoReportRef: React.RefObject<HTMLInputElement>;

  constructor(props: TProps) {
    super(props);
    this.state = {
      id_report: null,
      id_property: null,
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
      title: "",
      description: "",
      openDate: "",
      closeDate: "",
      id_report_state: REPORT_STATE_NEW,
      id_priority: PRIORITY_LOW, // new report
      isDeleted: false,
      author_name: "",
      author_lastname: "",
      author_email: "",
      owner_email: "",
      owner_name: "",
      id_role: ROLE_OWNER || ROLE_TENANT,
      photo_report: "",
      files: [],
      imagesPreviewUrl: []
    };

    this.inputPhotoReportRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.registerReport = this.registerReport.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }
  // Get info from backend to prevent reload
  componentWillMount() {
    (async () => {
      const { id_property_details } = this.props.match.params;

      // get info from report owner, maybe owner or tenant
      const token = localStorage.getItem("token");
      const { name, lastname, id_role, email } = setProfileFromToken(token);

      const {
        id_property,
        id_user,
        address_line1,
        address_line2,
        locality,
        region,
        postcode,
        photo_property,
        isDeleted
      } = await getProperty(token, id_property_details); // SE QUEDA AQUI
  
      // send email to owner
      let owner_name = name;
      let owner_email = email;
      if (id_role === ROLE_TENANT) {
        const { email, name } = await getEmail(id_property_details);
        owner_email = email;
        owner_name = name;
      }
      this.props.setSelectedProperty(id_property);
      this.setState({
        author_name: name,
        author_lastname: lastname,
        author_email: email,
        id_property: id_property_details,
        owner_email: owner_email,
        owner_name: owner_name,
        id_role: id_role,
        property: {
          id_property: id_property,
          id_user: id_user,
          address_line1: address_line1,
          address_line2: address_line2,
          locality: locality,
          region: region,
          postcode: postcode,
          photo_property: photo_property,
          isDeleted: isDeleted
        }
      });
    })();
  }

  handleChange(e: any) {
    let value = e.target.value;

    if (e.target.name === "priority") {
      value = Number(value);
    }
    this.setState({
      ...this.state,
      [e.target.name]: value
    });
  }

  // function that update photos state with preview
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
    let templateParams = {
      email: this.state.owner_email,
      name: this.state.owner_name,
      message_html: `Se ha creado una nueva incidencia en la vivienda ubicada en ${this.state.property.address_line1}`
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

  async registerReport() {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    if (this.inputPhotoReportRef.current?.files) {
      // varios files en un input
      for (let i = 0; i < this.inputPhotoReportRef.current.files.length; i++) {
        formData.append(
          "photo_report",
          this.inputPhotoReportRef.current.files[i]
        );
      }
    }
    let { 
      title,
      description,
      id_report_state,
      id_priority,
      isDeleted
    } = this.state;

    const { id_property_details } = this.props.match.params;
    let id_property = id_property_details

    formData.append("id_report", null);
    formData.append("id_property", String(id_property));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("openDate", getDate());
    formData.append("closeDate", "");
    formData.append("id_report_state", String(id_report_state));
    formData.append("id_priority", String(id_priority));
    formData.append("isDeleted", String(isDeleted));

    const { id_report } = await postNewReport(token, formData);
    this.setState({ id_report: id_report });

    const report: IReport = {
      id_report: id_report,
      id_property: id_property,
      title: title,
      description: description,
      openDate: getDate(),
      closeDate: "",
      id_report_state: id_report_state,
      id_priority: id_priority,
      isDeleted: isDeleted,
      photos: []
    };
    this.props.setNewReport(report); // set on store
    this.sendEmail();
    this.props.history.push("/");
  }

  render() {
    const { id_property_details } = this.props.match.params;
    const { author_name, author_lastname } = this.state;

    if (id_property_details === undefined) {
      history.push("/");
    }
    const { address_line1, locality } = this.state.property;

    let isEnabled = false;
    if (
      this.state.title !== "" &&
      this.state.description !== "" &&
      this.state.id_priority !== null &&
      this.state.photo_report !== ""
    ) {
      isEnabled = true;
    }

    return (
      <div className="fondoReport">
        <div className="container bigBoxReport">
          <div className="miniLogo"></div>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8 detailsBox">
              <h3>{address_line1}</h3>
              <h3>{locality}</h3>

              <h5>
                {" "}
                Autor: {author_name} {author_lastname}
              </h5>
            </div>
          </div>
          <div className="form-row">
            <div className="col-2"></div>
            <div className="col-8">
              <div className="form-group">
                <label className="col-form-label"> Incidencia:</label>
                <input
                  type="text"
                  name="title"
                  className="form-control form-control-sm"
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label className="col-form-label"> Descripción:</label>
                <textarea
                  name="description"
                  className="form-control form-control-sm textArea"
                  value={this.state.description}
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
                  {" "}
                  <option selected value=""></option>
                  <option value={PRIORITY_URGENT}>Urgente</option>
                  <option value={PRIORITY_MEDIUM}>Prioridad media</option>
                  <option value={PRIORITY_LOW}>Prioridad baja</option>
                </select>
              </div>
              <div className="box">
                <label htmlFor="photo_report">
                  <small>
                    Añadir fotos, max. 4
                    <small style={{ color: "red", fontSize: 12 }}>
                      {" "}
                      min. 1
                    </small>{" "}
                  </small>
                  <img
                    alt="Agregar fotos"
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

              {/* <div className="col-2"></div> */}
            </div>
            {/* <div className="col-2"></div> */}
          </div>
          <div className="row">
            <div className=" offset-md-6 col-md-4">
              <button
                type="submit"
                className="btn btn-sm btn-outline-dark ml-5 reportButton1"
                disabled={!isEnabled}
                onClick={this.registerReport}
              >
                Crear Incidencia
              </button>
              <Link to="/">
                <button
                  type="submit"
                  className="btn btn-sm btn-outline-dark ml-5 reportButton2"
                >
                  Volver
                </button>
              </Link>
              <div className="col-2"></div>
            </div>
            <div className="col-2"></div>
          </div>
        </div>
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
  setPhotoReport: setPhotoReportAction,
  setSelectedProperty: setSelectedPropertyAction
};

export default connect(mapStateToProps, mapDispatchToProps)(NewReport);
