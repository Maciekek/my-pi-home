import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import Modal from 'react-bootstrap/Modal';
import { RecentlyUsedSensors } from '../RecentlyUsedSensors';
import { Icon } from 'components/uiComponents/Icon';

class LineChartForm extends React.Component {
  static propTypes = {
    widget: PropTypes.object,
    submit: PropTypes.func,
    hideModal: PropTypes.func,
  };

  constructor(props) {
    super(props);

    const state = {
      widgetType: 'lineChart',
      chartName: '',
      sensors: [{ sensorId: '', sensorUnit: '' }],
    };

    if (!_.isEmpty(props.widget)) {
      state.chartName = props.widget.chartName;
      state.sensors = props.widget.sensors;
    }

    this.state = state;
  }

  componentDidMount() {
    this.props.onChange(this.state);
  }

  onChange = (e, index) => {
    const sensors = this.state.sensors;
    sensors[index][e.target.name] = e.target.value.trim();

    this.setState(
      {
        sensors: sensors,
      },
      () => this.props.onChange(this.state),
    );
  };

  onChangeName = e => {
    this.setState(
      {
        chartName: e.target.value,
      },
      () => this.props.onChange(this.state),
    );
  };

  addNewSensor = (e, sensorId = null) => {
    console.log(sensorId);
    const config = this.state;
    const sensors = [...config.sensors, { sensorId: sensorId ? sensorId : '', sensorUnit: '' }];

    this.setState(
      {
        sensors: sensors,
      },
      () => this.props.onChange(this.state),
    );
  };

  removeSensor = index => {
    const sensors = [...this.state.sensors];
    sensors.splice(index, 1);

    this.setState(
      {
        sensors: sensors,
      },
      () => this.props.onChange(this.state),
    );
  };

  isSubmitDisabled = () => {
    const emptyFields = this.state.sensors.filter(sensor => {
      return _.isEmpty(sensor.sensorId);
    });

    return !(!_.isEmpty(this.state.chartName) && emptyFields.length < 1);
  };

  onQuickAddSensor = (e, sensor) => {
    this.addNewSensor(e, sensor);
  };

  render() {
    return (
      <div>
        <Form.Group>
          <Form.Label>Na wykresie liniowym możesz umieścic kilka czujników.</Form.Label>
        </Form.Group>
        <Form.Group>
          <RecentlyUsedSensors onSensorClick={this.onQuickAddSensor} locationId={this.props.locationId} />
        </Form.Group>
        <Form.Group controlId="chartName">
          <Form.Label>Nazwa wykresu</Form.Label>
          <Form.Control
            name={'chartName'}
            value={this.state.chartName}
            onChange={this.onChangeName}
            type="text"
            placeholder="Pokoj, salon, kuchnia"
          />
        </Form.Group>
        {this.state.sensors.map((sensor, index) => {
          return (
            <Row key={index}>
              <Col sm="6">
                <Form.Group controlId={`sensorId${index}`}>
                  <Form.Label>Id czujnika</Form.Label>
                  <Form.Control
                    name={'sensorId'}
                    value={sensor.sensorId}
                    onChange={e => this.onChange(e, index)}
                    type="text"
                    placeholder="room1"
                  />
                </Form.Group>
              </Col>
              <Col sm="5">
                <Form.Group controlId={`sensorUnit${index}`}>
                  <Form.Label>Jednostka pomiaru</Form.Label>
                  <Form.Control
                    name={'sensorUnit'}
                    value={sensor.sensorUnit}
                    onChange={e => this.onChange(e, index)}
                    type="text"
                    placeholder="C, kg, lux..."
                  />
                </Form.Group>
              </Col>
              <Col sm="1" className={'flex-center'}>
                {this.state.sensors.length > 1 ? (
                  <Icon type={'delete'} onClick={() => this.removeSensor(index)} />
                ) : null}
              </Col>
            </Row>
          );
        })}

        <Button onClick={this.addNewSensor}>
          <Icon type={'add_circle_outline'} />
          Dodaj kolejny sensor
        </Button>

        <Modal.Footer>
          <Button variant="success" onClick={this.props.submit} disabled={this.isSubmitDisabled()}>
            Zapisz
          </Button>
          <Button onClick={this.props.hideModal}>Zamknij</Button>
        </Modal.Footer>
      </div>
    );
  }
}

export { LineChartForm };
