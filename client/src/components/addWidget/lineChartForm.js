import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons'
class LineChartForm extends React.Component {
  static propTypes = {};

  state = {
      widgetType: 'lineChart',
      chartName: '',
      sensors: [{'sensorId': '', 'sensorUnit': ''}]

  };

  onChange = (e, index) => {
    const sensors = this.state.sensors;
    sensors[index][e.target.name] = e.target.value;

    this.setState({
      sensors: sensors
    }, () => this.props.onChange(this.state));
  };

  onChangeName = (e) => {
    this.setState({
      chartName: e.target.value
    }, () => this.props.onChange(this.state));
  };

  addNewSensor = () => {
    const config = this.state;
    const sensors = [...config.sensors, {'sensorId': '', 'sensorUnit': ''}];

    this.setState({
      sensors: sensors
    });
  };

  render() {
    return (
     <div>
       <Form.Group>
         <Form.Label>Na wykresie liniowym możesz umieścic kilka czujników.</Form.Label>
       </Form.Group>
       <Form.Group controlId="chartName">
         <Form.Label>Nazwa wykresu</Form.Label>
         <Form.Control name={'chartName'} value={this.state.chartName} onChange={this.onChangeName} type="text" placeholder="Pokoj, salon, kuchnia" />
       </Form.Group>
       {this.state.sensors.map((sensor, index)=> {
          return (<Row>
            <Col sm="6">
              <Form.Group controlId="sensorId">
                <Form.Label >Id czujnika</Form.Label>
                <Form.Control name={'sensorId'} value={sensor.sensorId} onChange={(e) => this.onChange(e, index)} type="text" placeholder="room1" />

              </Form.Group>
            </Col>
            <Col sm="6">
              <Form.Group controlId="sensorUnit">
                <Form.Label>Jednostka pomiaru</Form.Label>
                <Form.Control name={'sensorUnit'} value={sensor.sensorUnit} onChange={(e) => this.onChange(e, index)} type="text" placeholder="C, kg, lux..." />
              </Form.Group>
            </Col>
          </Row>)
         })
       }


       <Button onClick={this.addNewSensor}><FontAwesomeIcon icon={faPlusCircle}/>Dodaj kolejny sensor</Button>

     </div>
   )
  }
}


export {LineChartForm};
