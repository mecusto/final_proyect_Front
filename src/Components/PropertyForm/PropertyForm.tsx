import React from "react";
import { addProperty } from "../../utils/API";
import { connect } from "react-redux";
import firebase from "../../config/config";
import { addPropertyAction } from "../../Redux/actions";
import { IProperty } from "../../interfaces/IProperties";
import { IStore } from "../../interfaces/IStore";
import { IProfile } from "../../interfaces/IProfile";
import { IChatGroup } from "../../interfaces/IMessage";

interface IState {
  address_line1: string;
  address_line2: string;
  locality: string;
  region: string;
  postcode: number | string;
  file?: File;
  imagePreviewUrl?: any;
}

interface IGlobalProps {
  addOneProperty(property: IProperty): void;
  userProfile: IProfile;
}

interface IProps {
  showPropertyDetails(id: number | null): void;
}
type TProps = IProps & IGlobalProps;

class PropertyForm extends React.Component<TProps, IState> {
  inputPhoto_propertyeRef: React.RefObject<HTMLInputElement>;
  constructor(props: TProps) {
    super(props);
    this.state = {
      address_line1: "",
      address_line2: "",
      locality: "",
      region: "",
      postcode: null,
      file: null
    };
    this.inputPhoto_propertyeRef = React.createRef();
    this.sendForm = this.sendForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.cleanData = this.cleanData.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }

  cleanData() {
    this.setState({
      address_line1: "",
      address_line2: "",
      locality: "",
      region: "",
      postcode: "",
      imagePreviewUrl: ""
    });
  }

  // check: mandar siempre foto obligatorio?
  async sendForm() {  
    const formData = new FormData();
    const token = localStorage.getItem("token");
    if (this.inputPhoto_propertyeRef.current?.files) {
      let photo_property = this.inputPhoto_propertyeRef.current.files[0];
      formData.append("photo_property", photo_property);
    }
     
    let {
      address_line1,
      address_line2,
      locality,
      region,
      postcode
    } = this.state;
    postcode = String(postcode);

    formData.append("address_line1", address_line1);
    formData.append("address_line2", address_line2);
    formData.append("locality", locality);
    formData.append("region", region);
    formData.append("postcode", postcode);
    const property = await addProperty(token, formData);
    this.props.addOneProperty(property);

    this.cleanData();

    //create collection on firebase for chat
    const db = firebase.firestore();
    db.collection("properties").add({
      id_property: property.id_property,
      messages: { 1: { createdDate: new Date(), text: "", id_user: 0 } },
      users: {
        1: {
          name: this.props.userProfile.name,
          id: this.props.userProfile.id_user
        }
      }
    });
    this.props.showPropertyDetails(property.id_property);

  }

  handleChange(e: any) {
    let value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    });
  }

  onFileChange(e: any) {
    // preview
    this.setState({ file: e.target.files[0] });
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({ imagePreviewUrl: reader.result });
    };
    reader.readAsDataURL(e.target.files[0]);
   }

  render() {
    let areInputsOk = false;
    let isPostcodeOk = false;
    let { address_line1, locality, region, postcode } = this.state;
    postcode = String(postcode);
    if (address_line1.length > 3 && locality.length > 3 && region.length > 3) {
      areInputsOk = true;
    }
    if (postcode.length === 5) {
      isPostcodeOk = true;
    }

    let $imagePreview = <div className="previewText image-container"></div>;
    if (this.state.imagePreviewUrl) {
      $imagePreview = (
        <div className="image-container">
          <img src={this.state.imagePreviewUrl} alt="icon" width="100" />{" "}
        </div>
      );
    }

    return (
      <div className="propertyForm col-12">
        <label className="col-form-label">Direccion 1*:</label>
        <input
          type="text"
          className="form-control"
          name="address_line1"
          value={this.state.address_line1}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Direccion 2:</label>
        <input
          type="text"
          className="form-control"
          name="address_line2"
          value={this.state.address_line2}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Localidad*:</label>
        <input
          type="text"
          className="form-control"
          name="locality"
          value={this.state.locality}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Region*:</label>
        <input
          type="text"
          className="form-control"
          name="region"
          value={this.state.region}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Codigo Postal*:</label>
        <input
          type="number"
          className="form-control"
          name="postcode"
          value={this.state.postcode}
          onChange={this.handleChange}
        />

        <div className="box">
          <label htmlFor="photoProperty">
            Añadir fotos
            <img
              alt="Agregar fotos"
              style={{ cursor: "pointer", marginLeft: "5%" }}
              width={30}
              src="./img/baseline_add_a_photo_black_18dp.png"
            />
          </label>
          <input
            type="file"
            id="photoProperty"
            ref={this.inputPhoto_propertyeRef}
            style={{ display: "none" }}
            onChange={this.onFileChange}
          />
          {$imagePreview}

          {areInputsOk ||
            (!isPostcodeOk && (
              <div>
                <span
                  style={{ color: "red", fontSize: 12, marginRight: "10%" }}
                >
                  Todos los campos * deben ser introducidos
                </span>
              </div>
            ))}

          {!isPostcodeOk && (
            <div>
              {" "}
              <span style={{ color: "red", fontSize: 12, marginRight: "10%" }}>
                El codigo postal debe ser 5 digitos
              </span>
            </div>
          )}
          {areInputsOk && isPostcodeOk && (
            <button
              style={{ marginLeft: "40%" }}
              type="submit"
              className="btn btn-sm btn-outline-secondary mt-4"
              onClick={this.sendForm}
              data-dismiss="modal"
              disabled={!areInputsOk}
            >
              Enviar
            </button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store: IStore) => ({
  userProfile: store.userProfile
});

const mapDispatchToProps = {
  addOneProperty: addPropertyAction
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertyForm);
