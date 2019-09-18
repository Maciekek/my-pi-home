import React from 'react';
import {Page} from '../components/page';
import {LocationsService} from "../services/locations.services";
import ListGroup from "react-bootstrap/ListGroup";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Link} from "react-router-dom";
import Form from "react-bootstrap/Form";
import {uuidv4} from "../utils/Utils";
import Button from "react-bootstrap/Button";

class LocationsNewPage extends React.Component {
  state = {
    form: {
      name: "",
      description: "",
      locationId: uuidv4()
    },
  };

  constructor(props) {
    super(props);

  }



  changeValue = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const obj = this.state;
    obj.form[name] = value;

    this.setState(obj);
  };

  submit =() => {
    LocationsService.createNewLocation(this.state.form);
  };

  render() {
    return (
      <Page>Dodaj nową lokalizacje:
        <Form >
          <Form.Group controlId="name">
            <Form.Label>Nazwa lokacji</Form.Label>
            <Form.Control name={'name'} onChange={this.changeValue} type="name" placeholder="Nazwa lokalizacji" value={this.state.form.name} />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Opis Lokalizacji</Form.Label>
            <Form.Control name={"description"} type="description" onChange={this.changeValue} placeholder="opis lokalizacji" value={this.state.form.description} />
          </Form.Group>

        </Form>
        <Button variant="primary" onClick={this.submit}>
          Dodaj
        </Button>

      </Page>
    )
  }

}

export {LocationsNewPage}