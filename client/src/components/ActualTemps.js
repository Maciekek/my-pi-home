import React from 'react';
import _ from 'lodash';


class ActualTemps extends React.Component {
  constructor(props) {
    super(props);
  }

  getNameOfSensorById = (id) => {
    if ( !(this.props.location.tempSettings && this.props.location.tempSettings.sensors)) {
      return id;
    }

    const matchedSensors = this.props.location.tempSettings.sensors.filter(sensor => {
      return sensor.sensorId === id;
    });

    console.log(matchedSensors);
    if(matchedSensors.length > 0) {
      return matchedSensors[0].name
    }

    return id
  };

  render() {
    const partitionedById = _.groupBy(this.props.temps, "sensorId");
    const sensorIds = Object.keys(partitionedById);

    const groupedTemps = sensorIds.map((sensorId) => {
      return {
        name: this.getNameOfSensorById(sensorId),
        data: partitionedById[sensorId].map(data => {
          return [new Date(data.date).valueOf(), data.value]
        })
      }
    });

    return (

      <div>
        <div>
          Aktualna temperatura:

          {groupedTemps.map(groupedTemp => {
            return <div>{this.getNameOfSensorById(groupedTemp.name)}: {groupedTemp.data[0][1]}</div>
          })}
        </div>

      </div>
    )
  }

}

export {ActualTemps}