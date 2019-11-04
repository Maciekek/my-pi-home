import React from 'react';
import _ from 'lodash';
import Card from "react-bootstrap/Card";


class ActualTemps extends React.Component {
  constructor(props) {
    super(props);
  }

  getNameOfSensorById = (id) => {
    if (!(this.props.location.tempSettings && this.props.location.tempSettings.sensors)) {
      return id;
    }

    const matchedSensors = this.props.location.tempSettings.sensors.filter(sensor => {
      return sensor.sensorId === id;
    });

    console.log(matchedSensors);
    if (matchedSensors.length > 0) {
      return matchedSensors[0].name
    }

    return id
  };

  render() {
    const partitionedById = _.groupBy(this.props.temps, "sensorId");
    const sensorIds = Object.keys(partitionedById);

    const groupedTemps = sensorIds.map((sensorId) => {
      return {
        id: sensorId,
        name: this.getNameOfSensorById(sensorId),
        data: partitionedById[sensorId].map(data => {
          return [new Date(data.date).valueOf(), data.value]
        })
      }
    });

    return (

      <div className={'actual-temps'}>

        <span className={'actual-temps__title'}>Aktualne temperatury:</span>

        <div>
          {groupedTemps.map((groupedTemp, index)=> {
            return (<Card className={'actual-temps__row'} key={index}>
              <Card.Body>
                <div>
                  <div>{this.getNameOfSensorById(groupedTemp.name)}:</div>
                  <div className={'actual-temps__row--secondary'}>id czujki: {groupedTemp.id}</div>
                </div>

                <span className={'actual-temps__row-value'}>
                  {groupedTemp.data[0][1]}
                </span>
              </Card.Body>
            </Card>)

          })}
        </div>
      </div>
    )
  }

}

export {ActualTemps}