import React, { PureComponent } from "react";
import { IProperty } from "../../interfaces/IProperties";
import { host } from "../../utils/constants";

interface IProps {
    atributo: IProperty;
}

interface IGlobalProps {}

type TProps = IProps & IGlobalProps;

interface IState {}

class Card extends React.PureComponent<TProps, IState> {
  constructor(props: TProps) {
    super(props);
    //initialize the state with the values the property has in the store
    this.state = {};
  }

  render() {
    const { atributo } = this.props;
    return (
   
      <div
        id="propertiesList"
        key={atributo.id_property}
        className="card border-light my-2 ml-1 "
        style={{
          maxWidth: "14rem",
          maxHeight: "16rem",
          cursor: "pointer"
        }}
        // onClick={() => this.showPropertyDetails(property.id_property)}
      >
        {atributo.photo_property ? (
          <img
            style={{ maxHeight: 100 }}
            src={`${host}properties/${atributo.photo_property}`}
            className="card-img-top"
            alt="..."
          ></img>
        ) : (
          <img
            src="https://www.esididiomas.es/blog/wp-content/uploads/2018/08/casa.jpg"
            className="card-img-top"
            alt="..."
          ></img>
        )}
        <div
          style={{
            backgroundColor: "rgb(70, 88, 102)",
            color: "white",
            textAlign: "center"
          }}
          className="card-header"
        >
          <div className="card-body">
            <p style={{ fontSize: 14 }} className="card-title">
              {atributo.address_line1}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
