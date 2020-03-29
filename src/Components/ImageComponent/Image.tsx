import React from "react";

interface IState {
  isOpen: boolean;
}

interface IProps {
  src: string;
}

class ImageComponent extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = { isOpen: false };
  }

  handleShowDialog = () => {
    this.setState({ isOpen: !this.state.isOpen }); 
  };

  render() {
    const { src } = this.props;

    return (
      <div>
        <img
          className="small"
          src={src}
          onClick={this.handleShowDialog}
          alt="small"
          style={{ width: "150px", height: "150px" , cursor:"zoom-in"}}
          
        />
        {this.state.isOpen && (
          <dialog
            className="dialog"
            style={{ position: "absolute" }}
            open
            onClick={this.handleShowDialog}
          >
            <img
              className="image"
              src={src}
              onClick={this.handleShowDialog}
              alt="big"
              style={{ width: "300px", height: "300px", cursor:"zoom-out" }}
            />
          </dialog>
        )}
      </div>
    );
  }
}
export default ImageComponent;
