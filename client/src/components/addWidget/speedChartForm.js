import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

class SpeedChartForm extends React.PureComponent {
  static propTypes = {
    hideModal: PropTypes.func
  };

  constructor(props) {
    super(props);

    console.log(props);

    const state = {
      widgetType: 'lineChart',
      sensors: [{'sensorId': '', 'sensorUnit': ''}],
      chartName: '',
    };

    if(!_.isEmpty(props.widget)) {
      state.sensors[0]['sensorId'] = _.head(props.widget.sensors).sensorId;
      state.sensors[0]['sensorUnit'] = _.head(props.widget.sensors).sensorUnit;
    }

    this.state = state;
  }

  componentDidMount() {
    this.props.onChange(this.state)
  }

  onChange = (e) => {
    const sensors = [...this.state.sensors];
    sensors[0][e.target.name] = e.target.value;

    this.setState({
      sensors: sensors
    }, () => this.props.onChange(this.state));
  };

  isSubmitDisabled = () => {
    return _.isEmpty(_.head(this.state.sensors).sensorId) || _.isEmpty(_.head(this.state.sensors).sensorUnit)
  };

  render() {
    return (
     <div>

       <Form.Group controlId="sensorId">
         <Form.Label >Id czujnika</Form.Label>
         <Form.Control name={'sensorId'} value={this.state.sensors[0].sensorId} onChange={this.onChange} type="text" placeholder="room1, room2, room3" />
       </Form.Group>

       <Form.Group controlId="sensorUnit">
         <Form.Label>Jednostka pomiaru</Form.Label>
         <Form.Control name={'sensorUnit'} value={this.state.sensors[0].sensorUnit} onChange={this.onChange} type="text" placeholder="C, kg, lux..." />
       </Form.Group>

       <Modal.Footer>
         <Button variant="success" onClick={this.props.submit} disabled={this.isSubmitDisabled()}>Zapisz</Button>
         <Button onClick={this.props.hideModal}>Zamknij</Button>
       </Modal.Footer>
     </div>
   )
 }
}


export {SpeedChartForm};