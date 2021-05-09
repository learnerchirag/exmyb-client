import React, { Component } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import Form from "./Form";
import brand from "./assets/dl.png";

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar color="primary" style={{ height: "250px" }}>
          <NavbarBrand>
            <div>
              <img src={brand} height="168px" />
            </div>
          </NavbarBrand>
        </Navbar>
        <Form />
      </div>
    );
  }
}
