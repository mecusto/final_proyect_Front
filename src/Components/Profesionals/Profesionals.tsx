import React, { Component } from "react";
import "./style.css";
import {
  pathProfesionals1,
  pathProfesionals2,
  pathTelephones1,
  pathTelephones2,
  pathAddress1
} from "../../utils/constants";

// import produce from "immer";

const cheerio = require("cheerio");
const request = require("request-promise");

interface IProps {}
interface IState {
  companyNames: string[];
  telephones: string[];
  addresses: string[];
  category: string;
  city: string;
  isSearched: Boolean;
}

class Profesionals extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      companyNames: [],
      telephones: [],
      addresses: [],
      category: "",
      city: "",
      isSearched: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);
    this.enterPressed = this.enterPressed.bind(this)
  }

  reset() {
    this.setState({ category: "", city: "", isSearched: false });
  }

  init = async () => {
    const arrCompanyName: string[] = [];
    const arrTelephones: string[] = [];
    const arrAddresses: string[] = [];

    const { category, city } = this.state;

    const $ = await request({
      uri: `https://www.paginasamarillas.es/search/${category}/all-ma/${city}/all-is/${city}/all-ba/all-pu/all-nc/1?what=${category}&where=${city}&ub=false&qc=true`,
      transform: (body: HTMLAllCollection) => cheerio.load(body) //una vez hago la peticion lo paso a cheerio para que lo analice
    });

    const profesionals1 = $(pathProfesionals1).each((i: number, el: string) =>
      arrCompanyName.push($(el).text())
    );

    const profesionals2 = $(pathProfesionals2).each((i: number, el: string) =>
      arrCompanyName.push($(el).text())
    );

    const telephones1 = $(pathTelephones1).each((i: number, el: string) =>
      arrTelephones.push($(el).text())
    );

    const telephones2 = $(pathTelephones2).each((i: number, el: string) =>
      arrTelephones.push($(el).text())
    );

    const addresses1 = $(pathAddress1).each((i: number, el: string) =>
      arrAddresses.push($(el).text())
    );

    const sizeArray = arrTelephones.length;
    const finalAddresses = arrAddresses.slice(0, sizeArray);
    const finalCompanies = arrCompanyName.slice(0, sizeArray);
    // con Component
    this.setState({
      telephones: arrTelephones,
      companyNames: finalCompanies,
      addresses: finalAddresses,
      isSearched: true
    });
  };

  handleChange(e: any) {
    const value = e.target.value;
    this.setState({
      ...this.state,
      [e.target.name]: value
    });
  }

  enterPressed(event: any) {
    let code = event.keyCode || event.which;
    if (code === 13) {
      //13 is the enter keycode
      this.init();
    }
  }

  render() {
    const {
      isSearched,
      addresses,
      companyNames,
      telephones,
      city,
      category
    } = this.state;
    return (
      <>
        <div className="row">
          <div className="col-lg-4 col-12" style={{ marginLeft: "5.5rem" }}>
            <div className="form-group">
              <label className="col-form-label">Ciudad:</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={city}
                onChange={this.handleChange}
              ></input>
              <label className="col-form-label">Categoria:</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={category}
                onChange={this.handleChange}
                onKeyPress={this.enterPressed}
              ></input>

              <button
                type="button"
                className="btn btn-secondary mt-2 searchButton"
                onClick={this.init}
              >
                Buscar
              </button>

              <button
                type="button"
                className="btn btn-secondary mt-2 ml-5 resetButton"
                onClick={this.reset}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="offset-1 col-lg-6 col-12 listProfesional">
            {isSearched && (
              <div style={{ overflow: "scroll" }}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Empresa</th>
                      <th scope="col">Telefono</th>
                      <th scope="col">Direccion</th>
                    </tr>
                  </thead>
                  {companyNames.map((name, index) => (
                    <tbody>
                      <tr className="table-active" key={index}>
                        <td>{name}</td>
                        <td>{telephones[index]}</td>
                        <td>{addresses[index]}</td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Profesionals;
