import React from 'react';
import Form from 'react-bootstrap/Form';

class SpeedChartForm extends React.PureComponent {
  static propTypes = {};

  state = {
    widgetType: 'lineChart',
    sensors: [{'sensorId': '', 'sensorUnit': ''}]
  };

  onChange = (e) => {
    const sensors = this.state.sensors;
    sensors[0][e.target.name] = e.target.value;

    this.setState({
      sensors: sensors
    }, () => this.props.onChange(this.state));
  };

  render() {
    return (
     <div>

       <Form.Group controlId="sensorId">
         <Form.Label >Id czujnika</Form.Label>
         <Form.Control name={'sensorId'} value={this.state.sensorId} onChange={this.onChange} type="text" placeholder="room1, room2, room3" />
       </Form.Group>

       <Form.Group controlId="sensorUnit">
         <Form.Label>Jednostka pomiaru</Form.Label>
         <Form.Control name={'sensorUnit'} value={this.state.sensorUnit} onChange={this.onChange} type="text" placeholder="C, kg, lux..." />
       </Form.Group>
     </div>
   )
 }
}


export {SpeedChartForm};