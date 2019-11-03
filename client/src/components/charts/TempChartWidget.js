import React from 'react';
import _ from 'lodash';
import {connect} from "react-redux";

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
    formatter: function() {
      return Highcharts.dateFormat('%I:%M:%S %p', this.x);
    }
  },

};

class TempChartWidgetBase extends React.Component {
  static WidgetConfig = {
    limit: 100
  };

  constructor(props) {
    super(props);
  }


  getNameOfSensorById = (id) => {
    if ( !(this.props.locationConfig.tempSettings && this.props.locationConfig.tempSettings.sensors)) {
      return id;
    }

    const matchedSensors = this.props.locationConfig.tempSettings.sensors.filter(sensor => {
      return sensor.sensorId === id;
    });

    if(matchedSensors.length > 0) {
      return matchedSensors[0].name
    }

    return id
  };

  render() {
    const partitionedById = _.groupBy(this.props.data, "sensorId");
    const sensorIds = Object.keys(partitionedById);

    const groupedTemps = sensorIds.map((sensorId) => {
      return {
        name: this.getNameOfSensorById(sensorId),
        data: partitionedById[sensorId].map(data => {
          return [new Date(data.date).valueOf(), data.value]
        })
        }
    });

    options.series = groupedTemps;

    return (
      <div className={'line-chart'}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    )
  }

}

const getLocationConfig = (state, locationId) => {
  return state.locationStore.locations[locationId];
};

const mapStateToProps = (state, props) => {
  return {
    locationConfig: getLocationConfig(state, props.locationId)
  }
};

export const TempChartWidget = connect(mapStateToProps)(TempChartWidgetBase);


