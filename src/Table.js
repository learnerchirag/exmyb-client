import { faUserTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { user } from "firebase-functions/lib/providers/auth";
import React, { Component } from "react";
import { Container, Table } from "reactstrap";

export default class UserTable extends Component {
  state = {
    userArray: [],
  };
  componentDidMount() {
    this.setState({
      userArray: this.props.userArray,
    });
  }
  render() {
    return (
      <Container fluid className="mt-3">
        <Table className="align-items-center table-flush" responsive>
          <thead>
            <tr>
              <th scope="col">User Name</th>
              <th scope="col">Email Address</th>
              <th scope="col">Skills</th>
              <th scope="col">Remove</th>
            </tr>
          </thead>
          <tbody>
            {this.state.userArray.map((user, index) => (
              <tr>
                <th scope="row">{user.name}</th>
                <td>{user.email}</td>
                <td>
                  {user.techArray.map((tech) => (
                    <div className="d-flex">
                      <div className="mr-2">{tech.tech}</div>
                      <div>{tech.skill}</div>
                    </div>
                  ))}
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faUserTimes}
                    onClick={() => this.props.removeUser(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}
