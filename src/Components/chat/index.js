import React from "react";
import firebase from "../../config/config";
import { connect } from "react-redux";
import produce from "immer";
import {
  Widget,
  addResponseMessage,
  addUserMessage,
  dropMessages
} from "react-chat-widget";
import { setIdeIntervalAction } from "../../Redux/actions";
import "react-chat-widget/lib/styles.css";
import "./style.css";
import { ROLE_TENANT, ROLE_OWNER } from "../../utils/constants";
const intervalInMilsg = 4000;
class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      doc_id: null,
      idCollection: "",
      newMessageNumber: 0,
      messages: [],
      intervalId: null,
      notFromCDM: false,
      flag: null
    };
    this.getCollectionId = this.getCollectionId.bind(this);
    this.setIdCollectionOnState = this.setIdCollectionOnState.bind(this);
    this.handleReceivedMessage = this.handleReceivedMessage.bind(this);
    this.handleNewUserMessage = this.handleNewUserMessage.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.changeStateArrayMessages = this.changeStateArrayMessages.bind(this);
    this.startInterval = this.startInterval.bind(this);
    this.setnewMessageNumber = this.setnewMessageNumber.bind(this);
    this.componentCleanup = this.componentCleanup.bind(this);
  }
  getCollectionId(id_property) {
    let id = "";
    firebase
      .firestore()
      .collection("properties")
      .where("id_property", "==", id_property)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          id = doc.id;
        });
      })
      .then(() => this.setIdCollectionOnState(id));
  }
  setIdCollectionOnState(id) {
    this.setState({ idCollection: id });
  }
  // set message on Firebase db

  setMessage(message) {
    const idCollection = this.state.idCollection;
    if (
      idCollection !== null &&
      idCollection !== undefined &&
      idCollection !== ""
    ) {
      const path = new Date().getTime();
      firebase
        .firestore()
        .collection("properties")
        .doc(idCollection)
        .update(`message${path}`, message); // Pass your object to write.
    }
  }

  async handleReceivedMessage() {
    const { id_role } = this.props.userProfile;
    let id_property = null;
    if (id_role === ROLE_TENANT) {
      id_property = this.props.tenantInfo.id_property;
    } else if (id_role === ROLE_OWNER) {
      id_property = this.props.properties.selectedIdProperty;
    }
    const id_user = this.props.userProfile.id_user;
    let newMessages = [];
    let actualMessages = this.state.messages;
    let num = 0;
    try {
      firebase
        .firestore()
        .collection("properties")
        .where("id_property", "==", id_property)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            let data = {
              data: doc.data()
            };
            const aux = Object.values(data.data);
            //
            aux.sort(function(a, b) {
              return b.createdDate - a.createdDate;
            });
            if (aux.length - 1 > actualMessages.length) {
              aux.splice(0, actualMessages.length);
              for (let i = 1; i < aux.length; i++) {
                newMessages.push(aux[i]);
                if (aux[i].text !== undefined) {
                  if (aux[i].id_user !== id_user) {
                    addResponseMessage(aux[i].user_name + ":  " + aux[i].text);
                  } else if (aux[i].id_user === id_user) {
                    addUserMessage(aux[i].text);
                  }
                }
              }
            }
            // aux=[]
          });
        })
        .then(() => this.changeStateArrayMessages(newMessages))
        .then(() => this.setnewMessageNumber(num));
    } catch {}
    this.setState(state => ({ flag: state.flag + 1 }));
  }
  setnewMessageNumber(num) {
    this.setState({ newMessageNumber: num });
  }
  async handleNewUserMessage(newMessage) {
    const message = [
      {
        createdData: new Date(),
        text: newMessage,
        id_user: this.props.userProfile.id_user,
        user_name: this.props.userProfile.name
      }
    ];
    this.changeStateArrayMessages(message);
    this.setMessage(message[0]);
  }
  changeStateArrayMessages(messages) {
    this.setState(state =>
      produce(state, drafState => {
        messages.forEach(data => {
          drafState.messages.push(data);
        });
      })
    );
  }
  startInterval() {
    this.intervalId = setInterval(this.handleReceivedMessage, intervalInMilsg);
    this.props.setIdInterval(this.intervalId);
  }
  componentDidMount() {
    setTimeout(() => {
      const { id_role } = this.props.userProfile;
      // get collection Id on firebase
      if (id_role === ROLE_TENANT) {
        this.getCollectionId(this.props.tenantInfo.id_property);
      } else if (id_role === ROLE_OWNER) {
        this.getCollectionId(this.props.properties.selectedIdProperty);
      }
      this.setState({ notFromCDM: false });
      this.handleReceivedMessage();
      this.setState({ notFromCDM: true });
    }, 2000);
    window.addEventListener("beforeunload", this.componentCleanup);
  }
  componentWillUnmount() {
    this.componentCleanup();
    this.setState({ messages: [] });
    window.removeEventListener("beforeunload", this.componentCleanup); // remove the event handler for normal unmounting
  }
  componentCleanup() {
    // this will hold the cleanup code
    clearInterval(this.state.intervalId); // whatever you want to do when the component is unmounted or page refreshes
    dropMessages();
  }
  // TODO check si con tenant se cargan los datos de la vivienda
  render() {
    const token = localStorage.getItem("token");
    let subtitle = "";
    let propertyId = null;
    let notFromCDM = this.state.notFromCDM;
    if (token) {
      const { id_role } = this.props.userProfile;
      if (
        id_role === ROLE_TENANT &&
        this.props.tenantInfo.id_property !== null
      ) {
        propertyId = this.props.tenantInfo.id_property;
        subtitle = this.props.tenantInfo.address_line1;
      } else if (
        id_role === ROLE_OWNER &&
        this.props.properties.selectedIdProperty !== null &&
        this.props.properties.selectedIdProperty !== undefined
      ) {
        propertyId = this.props.properties.selectedIdProperty;
        subtitle = this.props.properties.byId[propertyId].address_line1;
      }
    }
    return (
      <>
        <div onClick={this.startInterval}>
          <Widget
            handleNewUserMessage={this.handleNewUserMessage}
            title="Bienvenido"
            subtitle={subtitle}
            senderPlaceHolder="Escriba un mensaje..."
            // badge={notFromCDM === true ? this.state.newMessageNumber : 0}
            // badge={this.state.newMessageNumber}
          />
        </div>
      </>
    );
  }
}
const mapStateToProps = store => ({
  userProfile: store.userProfile,
  properties: store.properties,
  tenantInfo: store.tenantInfo
});
const mapDispatchToProps = {
  setIdInterval: setIdeIntervalAction
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
