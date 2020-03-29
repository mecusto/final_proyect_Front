import React from "react";
import { IProperties, IProperty } from "../../interfaces/IProperties";
import { connect } from "react-redux";
import { IStore } from "../../interfaces/IStore";
import { updateProperty } from "../../utils/API";
import { setPropertiesAction, updatePropertyAction } from "../../Redux/actions";

interface IProps {
  propertyId: number;
}

interface IGlobalProps {
  properties: IProperties;
  updateOneProperty(property: IProperty): void; //aqui lo declaro le paso una propiedad(la que voy a actualizar)
}

type TProps = IProps & IGlobalProps;

interface IState {
  id_property: number | null;
  id_user: number | null;
  address_line1: string;
  address_line2: string;
  locality: string;
  region: string;
  postcode: number | string;
  photo_property: string;
  isDeleted?: boolean;
  files?: File[];
  imagesPreviewUrl?: any[];
}

class UpdateProperty extends React.PureComponent<TProps, IState> {
  inputPhoto_propertyeRef: React.RefObject<HTMLInputElement>;
  constructor(props: TProps) {
    super(props);
    //initialize the state with the values the property has in the store
    this.state = {
      id_property: this.props.properties.byId[this.props.propertyId]
        .id_property,
      id_user: this.props.properties.byId[this.props.propertyId].id_user,
      address_line1: this.props.properties.byId[this.props.propertyId]
        .address_line1,
      address_line2: this.props.properties.byId[this.props.propertyId]
        .address_line2,
      locality: this.props.properties.byId[this.props.propertyId].locality,
      region: this.props.properties.byId[this.props.propertyId].region,
      postcode: this.props.properties.byId[this.props.propertyId].postcode,
      photo_property: this.props.properties.byId[this.props.propertyId]
        .photo_property,
      files: [],
      imagesPreviewUrl: []
    };
    this.inputPhoto_propertyeRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.sendForm = this.sendForm.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }

  handleChange(e: any) {
    let value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    });
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
  }

  async sendForm() {
    const formData = new FormData();

    let {
      address_line1,
      address_line2,
      locality,
      region,
      postcode,
      photo_property
    } = this.state;

    formData.append("photo_property", photo_property);
    if (this.inputPhoto_propertyeRef.current?.files.length !== 0) {
      let photo_property = this.inputPhoto_propertyeRef.current.files[0];
      formData.append("photo_property", photo_property);
    }
    postcode = String(postcode);
    formData.append("address_line1", address_line1);
    formData.append("address_line2", address_line2);
    formData.append("locality", locality);
    formData.append("region", region);
    formData.append("postcode", postcode);

    const token = localStorage.getItem("token");
    const id = this.props.propertyId;
    const new_property = await updateProperty(token, id, formData); //fetch
    this.props.updateOneProperty(new_property); //action
  }

  render() {
    return (
      <div className="container-fluid">
        <label className="col-form-label">Direccion 1:</label>
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

        <label className="col-form-label">Localidad:</label>
        <input
          type="text"
          className="form-control"
          name="locality"
          value={this.state.locality}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Region:</label>
        <input
          type="text"
          className="form-control"
          name="region"
          value={this.state.region}
          onChange={this.handleChange}
        ></input>

        <label className="col-form-label">Codigo Postal:</label>
        <input
          type="number"
          className="form-control"
          name="postcode"
          value={this.state.postcode}
          onChange={this.handleChange}
        ></input>

        <div className="box">
          <label htmlFor="newPhotoProperty">
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
            id="newPhotoProperty"
            ref={this.inputPhoto_propertyeRef}
            style={{ display: "none" }}
            onChange={this.onFileChange}
          />
          <div className="previewText image-container">
            {this.state.imagesPreviewUrl
              ? this.state.imagesPreviewUrl.map(image => (
                  <div className="image-container">
                    <img src={image} alt="icon" width="100" />{" "}
                  </div>
                ))
              : null}
          </div>
        </div>

        <button
          style={{ marginLeft: "40%" }}
          type="submit"
          className="btn btn-sm btn-outline-secondary mt-4"
          onClick={this.sendForm}
          data-dismiss="modal"
        >
          Enviar
        </button>
      </div>
    );
  }
}

//states we are gonna take from the IStore
const mapStateToProps = (store: IStore) => ({
  properties: store.properties
});

// we send actions to the reducer(only to save states) and the reducer save what we send in the action
const mapDispatchToProps = {
  setProperties: setPropertiesAction,
  updateOneProperty: updatePropertyAction //aqui lo envio
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProperty);
