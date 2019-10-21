import React from 'react';
import _ from 'lodash';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
Highcharts.setOptions({
  time: {
    timezoneOffset: -2 * 60
  }
});

const options = {
  title: {
    text: ''
  },

  xAxis: {
    type: 'datetime',
    //	tickInterval: 60 * 1000, // for thin step
    dateTimeLabelFormats: { // don't display the dummy year\
      year:  '%I:%M:%S %p',
      month:  '%I:%M:%S %p',
      day: '%I:%M:%S %p'
    },
    title: {
      text: 'Time'
    }

  },
  tooltip: {
    headerFormat: '<div class="chart-tooltip" style="font-size: 15px;">Godzina: {point.key}<br>',
    footerFormat: '</div>',
    xDateFormat: '%H:%M',
    shared: false

  },


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


    console.log(groupedTemps);
    options.series = groupedTemps;
    return (

      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    )
  }

}

export {TempChart}
