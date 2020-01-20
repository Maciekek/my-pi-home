import React from 'react';
import _ from 'lodash';
import {connect} from "react-redux";

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
Highcharts.setOptions({
  time: {
    timezoneOffset: -1 * 60
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
    headerFormat: '<div class="chart-tooltip" style="font-size: 15px;">{point.key}<br>',
    footerFormat: '</div>',
    xDateFormat: 'Godzina: %H:%M;  Data: %d-%m',
    shared: false
  },
};

class TempChartWidgetBase extends React.Component {
  static WidgetConfig = {
    limit: 100
  };

  constructor(props) {
    super(props);

   this.state = {
     ...this.parseData()
   };
  }

  parseData = () => {
    const partitionedById = _.groupBy(this.props.data, "sensorId");
    const sensorIds = Object.keys(partitionedById);

    options.series = sensorIds.map((sensorId) => {
      return {
        name: this.getNameOfSensorById(sensorId),
        data: partitionedById[sensorId].map(data => {
          return [new Date(data.date).valueOf(), data.value]
        })
      }
    });

    return {
      ...options
    }
  };


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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const data = this.parseData();
    if(!_.isEqual(this.state,  data)) {
      this.setState (
        data
      )
    }
  }

  render() {


    return (
      <div className={'line-chart'}>
        {this.state ? <HighchartsReact
          highcharts={Highcharts}
          options={this.state}
          ref={"chartComponent"}
          allowChartUpdate={true}
        /> : null}
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


