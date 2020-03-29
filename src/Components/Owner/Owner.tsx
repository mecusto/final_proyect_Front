import React from "react";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import UpdateForm from "../updateUser/UpdateForm";
import { setProfileAction } from "../../Redux/actions";
import { IProfile } from "../../interfaces/IProfile";
import { IStore } from "../../interfaces/IStore";
import { host } from "../../utils/constants";
import { postPhoto_profile, deleteUser } from "../../utils/API";
import { setProfileFromToken } from "../../utils/utils";
import { Link } from "react-router-dom";
import PropertiesList from "../PropertiesList/PropertiesList";

interface IState {}
interface IProps {
  logout(): void;
}
interface IGlobalProps {
  userProfile: IProfile;
  setProfile(profile: IProfile): void;
}
type TProps = IProps & IGlobalProps;
class Owner extends React.PureComponent<TProps, IState> {
  inputPhoto_profileRef: React.RefObject<HTMLInputElement>;

  constructor(props: TProps) {
    super(props);

    this.state = {};

    this.inputPhoto_profileRef = React.createRef();

    this.uploadPhotoProfile = this.uploadPhotoProfile.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteSwal = this.deleteSwal.bind(this);
  }
  componentDidMount() {
    const { token } = this.props.userProfile;
    const profile = setProfileFromToken(token);
    this.props.setProfile(profile);
  }

  async uploadPhotoProfile() {
    if (this.inputPhoto_profileRef.current?.files) {
      const photo_profile = this.inputPhoto_profileRef.current.files[0];
      const formData = new FormData();
      formData.append("photo_profile", photo_profile);
      const { token } = await postPhoto_profile(
        this.props.userProfile.token,
        formData
      );
      const profile: IProfile = setProfileFromToken(token);
      this.props.setProfile(profile);
      localStorage.setItem("token", token);
    }
  }

  async delete() {
    const token = localStorage.getItem("token");
    try {
      const { isDeleted } = await deleteUser(token);
      if (isDeleted === true) {
        this.props.logout();
      }
    } catch (err) {
      console.log(err);
    }
  }

  deleteSwal() {
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
        confirmButtonText: "Si, darme de baja!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true
      })
      .then((result: any) => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            "Eliminado!",
            "Tu perfil ha sido dado de baja.",
            "success"
          );
          this.delete();
        }
      });
  }

  render() {
    const { name, lastname, photo_profile } = this.props.userProfile;

    return (
      <>
        <div className="container-fluid">
          <div className="row">
            {/* -------- PHOTO PROFILE ----------------- */}
            <div className="userDetails col-lg-2 col-md-3 col-12">
              {photo_profile &&
              photo_profile !== undefined &&
              photo_profile !== "undefined" ? (
                <div
                  className="photo_profile"
                  style={{
                    backgroundImage: `url(${host}owners/${photo_profile})`,
                    backgroundSize: "cover"
                  }}
                ></div>
              ) : (
                <div
                  className="photo_profile"
                  style={{
                    backgroundImage: `url("https://www.trecebits.com/wp-content/uploads/2018/06/MESSENGER.jpg")`,
                    backgroundSize: "cover"
                  }}
                ></div>
              )}
              {/* ----------------- ICONS ------------------ */}
              <div className="row">
                <div className="box col-6">
                  <label htmlFor="file">
                    <img
                      alt="Foto"
                      width={30}
                      src="../../img/baseline_add_a_photo_white_18dp.png"
                      style={{ cursor: "pointer" }}
                    />
                  </label>
                  <input
                    type="file"
                    id="file"
                    accept="image/* "
                    onChange={this.uploadPhotoProfile}
                    ref={this.inputPhoto_profileRef}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="box col-6">
                  <label htmlFor="update">
                    <img
                      alt="Actualizar"
                      width={30}
                      src="../../img/baseline_account_box_white_18dp.png"
                      style={{ cursor: "pointer" }}
                      data-target="#updateProfile"
                      data-toggle="modal"
                    />
                  </label>
                </div>
                {/* --------- UPDATE MODAL--------------------- */}
                <div
                  className="modal fade"
                  id="updateProfile"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Actualizar perfil
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
                        <UpdateForm />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nameBox">
                <h3>{name}</h3>
                <h3>{lastname} </h3>
              </div>
              <div className="col ocultar"></div>
              <div className="row">
                <div className="col iconBotton iconbotton1">
                  <label htmlFor="delete">
                    <img
                      alt="Eliminar"
                      width={30}
                      src="./img/baseline_delete_forever_white_18dp.png"
                      onClick={this.deleteSwal}
                      style={{ cursor: "pointer" }}
                    />
                  </label>
                </div>
                <div className="col iconBotton iconbotton2">
                  <Link to="/" onClick={this.props.logout}>
                    <img
                      alt="Logout"
                      width={30}
                      src="./img/baseline_exit_to_app_white_18dp.png"
                      style={{ cursor: "pointer" }}
                    />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-10 col-md-9 col-12">
              <PropertiesList />
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (store: IStore) => ({
  userProfile: store.userProfile
});
const mapDispatchToProps = {
  setProfile: setProfileAction
};
export default connect(mapStateToProps, mapDispatchToProps)(Owner);
