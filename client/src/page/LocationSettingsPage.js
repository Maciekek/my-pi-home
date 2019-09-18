import React from 'react';
import {Page} from '../components/page';
import {LocationsService} from "../services/locations.services";
import ListGroup from "react-bootstrap/ListGroup";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {Link} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class LocationSettingsPage extends React.Component {
  state = {
    location: null,
  };

  constructor(props) {
    super(props);
    LocationsService.getLocationSettings(this.props.match.params.id).then((locations) => {
      console.log(locations.data);
      this.setState({
        location: locations.data
      })
    })
  }

  submit = () => {
    console.log('qwe');
    LocationsService.updateLocation(this.props.match.params.id, this.state.location)
  };

  changeValue = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    console.log(name);
    const obj = this.state;
    obj.location[name] = value;


    this.setState(obj);

  };

  changeValueBySensorIndex = (index, name, event) => {
    const value = event.target.value;

    const obj = this.state;
    console.log(obj)
    obj.location.tempSettings.sensors[index][name] = value;
    this.setState(obj);
  };

  addNewSensor = () => {
    const state = this.state.location;

    if (!state.tempSettings) {
      console.log("dodaje obiekt")
      state.tempSettings = {};
    }

    if (!state.tempSettings.sensors) {
      console.log("dodaje tablice")
      state.tempSettings.sensors = [];
    }

    state.tempSettings.sensors.push({
      name: "",
      description: "",
      sensorId: "",
      locationId: this.props.match.params.id
    });

    console.log(state)

    this.setState(state)

  };

  render() {
    console.log("rerender");
    return (
      <Page>

        {!this.state.location
          ? "loading"
          : <Form >
            <Form.Group controlId="name">
              <Form.Label>Nazwa lokacji</Form.Label>
              <Form.Control name={'name'} onChange={this.changeValue} type="name" placeholder="Nazwa lokalizacji" value={this.state.location.name} />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Opis Lokalizacji</Form.Label>
              <Form.Control name={"description"} type="description" onChange={this.changeValue} placeholder="opis lokalizacji" value={this.state.location.description} />
            </Form.Group>
            {console.log(this.state.location)}
            {this.state.location.tempSettings &&
              this.state.location.tempSettings.sensors.map((sensor, index) => {
                  return (

                    <Form>
                      ------------------------------------------------------------------------------------

                      <Form.Group controlId={`sensorSettings-${index}`}>
                        <Form.Label>Nazwa czujki</Form.Label>
                        <Form.Control onChange={(event) => this.changeValueBySensorIndex(index, "name", event)}
                                      type={`sensorSettings-${index}`} placeholder="Nazwa czujki"
                                      value={sensor.name}/>
                      </Form.Group>
                      <Form.Group controlId={`sensorSettings-${index}`}>
                        <Form.Label>Id czujki</Form.Label>
                        <Form.Control onChange={(event) => this.changeValueBySensorIndex(index, "sensorId", event)}
                                      type={`sensorSettings-${index}`} placeholder="Id czujki"
                                      value={sensor.sensorId}/>
                      </Form.Group>
                    </Form>
                  )
                })
              }

            <div><Button variant="secondary" onClick={this.addNewSensor}>Dodaj nową czujkę</Button></div>

            <Button variant="primary" onClick={this.submit}>
              Zapisz
            </Button>
          </Form>

        }


      </Page>
    )
  }

}

export {LocationSettingsPage}