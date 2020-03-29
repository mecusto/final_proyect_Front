import React, { Component } from "react";
import firebase from "../../config/config";
import produce from "immer";
import { connect } from "react-redux";
import Navbar2 from "../Drive/NavBar2";

class Pictures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      house_id: this.props.properties.selectedIdProperty
    };
  }

  componentDidMount() {
    let images = [];
    firebase
      .firestore()
      .collection(`${this.state.house_id}`)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          let imageData = {
            url: doc.data().url,
            created: doc.data().added
          };
          images.push(imageData);
        });
      })
      .then(() => this.estado(images));
  }

  estado = images => {
    this.setState(state =>
      produce(state, drafState => {
        images.forEach(image => {
          drafState.photos.push(image);
        });
      })
    );
  };

  render() {
    const items = this.state.photos;
    return (
      <>
        <div>
          <Navbar2 />
        </div>
        <div className="container-fluid pt-3">
          <div className="row">
            {items.map(i => (
              <div className="col-md-4">
                <iframe
                  style={{ width: 500, height: 400 }}
                  src={i.url}
                ></iframe>
                <p>
                  Añadido:
                  {new Date(i.created.seconds * 1000).toString().slice(4, 24)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = store => ({ properties: store.properties });

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
