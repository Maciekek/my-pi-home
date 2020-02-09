import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {RelayService} from "../../services/deviceServices/relay.service";

class RelayForm extends React.PureComponent {
  static propTypes = {
    locationId: PropTypes.string,
    device: PropTypes.object,
  };

  constructor(props) {
    super(props);

    console.log('qqqqs', props.device);
    console.log('qqqqs', props.device.ip);

    this.state = {
      ip: props.device.ip || "",
      gpio: props.device.gpio || "",
      name: props.device.name || "",
    }
  }

  componentDidMount() {

  }

  onChange = (e) => {
    console.log(e.target.value.trim());
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  submit = () => {
    console.log(this.props.device);
    this.props.device
      ? RelayService.updateRelay(this.props.device._id,
          { locationId: this.props.locationId, ip: this.state.ip, gpio: this.state.gpio, type: 'simpleRelay', name: this.state.name })
      : RelayService.addNewRelay(this.props.locationId,
          { locationId: this.props.locationId, ip: this.state.ip, gpio: this.state.gpio, type: 'simpleRelay', name: this.state.name });
  };

  render() {
    return (
      <div>

        <Form.Group controlId="name">
          <Form.Label>Nazwa</Form.Label>
          <Form.Control name={'name'} value={this.state.name} onChange={this.onChange} type="text" placeholder="Lampka nocna" />
        </Form.Group>

        <Form.Group controlId="ip">
          <Form.Label >Adres urządzęnia docelowego (ip. Na przykład 192.168.1.107)</Form.Label>
          <Form.Control name={'ip'} value={this.state.ip} onChange={this.onChange} type="text" placeholder="192.168.1.107" />
        </Form.Group>

        <Form.Group controlId="gpio">
          <Form.Label >Numer pinu (GPIO)</Form.Label>
          <Form.Control name={'gpio'} value={this.state.gpio} onChange={this.onChange} type="number" placeholder="4" />
        </Form.Group>

        {/*<Form.Group controlId="sensorUnit">*/}
        {/*  <Form.Label>Jednostka pomiaru</Form.Label>*/}
        {/*  <Form.Control name={'sensorUnit'} value={this.state.sensors[0].sensorUnit} onChange={this.onChange} type="text" placeholder="C, kg, lux..." />*/}
        {/*</Form.Group>*/}

        <Modal.Footer>
          <Button variant="success" onClick={this.submit}>Zapisz</Button>

        </Modal.Footer>
      </div>
    )
  }
}


export {RelayForm};
