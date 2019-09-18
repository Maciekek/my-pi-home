import React from 'react';
import _ from 'lodash';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const options = {
  title: {
    text: ''
  },

  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      day: "%e-%b-%y" ,
      month: "%b-%y"
    }
  }
};

class TempChart extends React.Component {
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
    const partitionedById = _.groupBy(this.props.temps, "sensorId")
    const sensorIds = Object.keys(partitionedById);

    const groupedTemps = sensorIds.map((sensorId) => {
      return {
        name: this.getNameOfSensorById(sensorId),
        data: partitionedById[sensorId].map(data => {
          return [new Date(data.date).valueOf(), data.value]
        })
        }
    });


    console.log(groupedTemps);
    options.series = groupedTemps
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    )
  }

}

export {TempChart}