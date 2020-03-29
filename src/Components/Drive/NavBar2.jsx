import React from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";

export default class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar navbar-dark bg-dark">
        <div className="container">
        {/* TODO volver al home pulsando aqui */}
          <Link className="navbar-brand" to="/"> 
            Home
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/drive/pictures">
                  Archivos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/drive/upload">
                  Subir archivo
                </Link>
              </li>
            </ul>           
          </div>
        </div>
      </nav>
    );
  }
}
