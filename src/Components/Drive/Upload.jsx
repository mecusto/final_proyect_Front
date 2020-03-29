import React, { Component } from "react";
import firebase from "firebase";
import Dropzone from "react-dropzone";
import Progress from "./Progress";
import { connect } from "react-redux";
import Navbar2 from "../Drive/NavBar2";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "paco",
      progress: 0,
      isUploading: null,
      house_id: this.props.properties.selectedIdProperty
    };
  }
  handleUpload(files) {
    for (let i = 0; i < files.length; i++) {
      const uploadTask = firebase
        .storage()
        .ref(`${this.state.house_id}/${files.item(i).name}`)
        .put(files.item(i));
      uploadTask.on(
        "state_changed",
        snapshot => {
          const isUploading = true;
          this.setState({ isUploading });
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {},
        () => {
          firebase
            .storage()
            .ref(`${this.state.house_id}`)
            .child(files.item(i).name)
            .getDownloadURL()
            .then(url => {
              const isUploading = false;
              this.setState({ isUploading });
              const image = {
                url: url,
                added: new Date()
              };
              firebase
                .firestore()
                .collection(`${this.state.house_id}`)
                .add(image)
                .then(res => {
                  this.props.history.push("/drive/pictures");
                });
            });
        }
      );
    }
  }
  render() {
    return (
      <>
        <div>
          <Navbar2 />
        </div>
        <div className="mt-5 text-center form-group">
          {this.state.isUploading ? (
            <Progress percentage={this.state.progress} />
          ) : (
            ""
          )}
          <Dropzone>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input
                    {...getInputProps()}
                    onDrop={files => this.handleUpload(files)}
                    onChange={e => this.handleUpload(e.target.files)}
                  />
                  <div className="custom-file">
                    <input className="custom-file-input" id="customFile" />
                    <label className="custom-file-label" htmlFor="customFile">
                      Arrastre o seleccione sus archivos
                    </label>
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      </>
    );
  }
}
const mapStateToProps = store => ({ properties: store.properties });
const mapDispatchToProps = null;
export default connect(mapStateToProps, mapDispatchToProps)(Upload);
