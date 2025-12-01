import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { dark } from 'components/chartThemes/dark';
import HighchartsReact from 'highcharts-react-official';
import Highstock from 'highcharts/highstock';
Highstock.setOptions({
  time: {
    timezone: 'Europe/Warsaw',
  },
  ...dark,
});

const options = {
  title: {
    text: '',
  },

  legend: {
    enabled: true,
  },

  yAxis: {
    opposite: false,
  },

  navigator: {
    series: {
      type: 'areaspline',
      fillOpacity: 0.05,
      dataGrouping: {
        smoothed: true,
      },
      lineWidth: 1,
      marker: {
        enabled: false,
      },
    },
  },

  chart: {
    zoomType: 'x',
  },
  rangeSelector: {
    selected: 4,
    enabled: false,
    inputEnabled: false,
    buttonTheme: {
      visibility: 'hidden',
    },
    labelStyle: {
      visibility: 'hidden',
    },
  },

  tooltip: {
    headerFormat: '<div class="chart-tooltip" style="font-size: 15px;">{point.key}<br>',
    footerFormat: '</div>',
    xDateFormat: 'Godzina: %H:%M;  Data: %d-%m',
    shared: true,
    split: false,
    enabled: true,
  },
};

class TempChartWidgetBase extends React.Component {
  static WidgetConfig = {
    limit: 100,
  };

  constructor(props) {
    super(props);

    this.chartComponent = React.createRef();

    this.state = {
      ...this.parseData(),
    };
  }

  parseData = () => {
    const partitionedById = _.groupBy(this.props.data, 'sensorId');
    const sensorIds = _.sortBy(Object.keys(partitionedById));

    options.series = sensorIds.map((sensorId) => {
      return {
        dataGrouping: {
          enabled: true,
        },
        name: this.getNameOfSensorById(sensorId),
        data: partitionedById[sensorId].map((data) => {
          return [new Date(data.date).valueOf(), data.value];
        }),
      };
    });

    return {
      ...options,
    };
  };

  getNameOfSensorById = (id) => {
    if (!(this.props.locationConfig.tempSettings && this.props.locationConfig.tempSettings.sensors)) {
      return id;
    }

    const matchedSensors = this.props.locationConfig.tempSettings.sensors.filter((sensor) => {
      return sensor.sensorId === id;
    });

    if (matchedSensors.length > 0) {
      return matchedSensors[0].name;
    }

    return id;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const data = this.parseData();
    if (!_.isEqual(this.state.series, data.series)) {
      this.setState(data);
    }

    this.chartComponent.current.chart.xAxis[0].setExtremes(data[0], data[data.length - 1], false);
    this.chartComponent.current.chart.redraw();
  }

  render() {
    return (
      <div className={'line-chart'}>
        {this.state ? (
          <HighchartsReact
            constructorType={'stockChart'}
            highcharts={Highstock}
            options={this.state}
            ref={this.chartComponent}
            allowChartUpdate={true}
          />
        ) : null}
      </div>
    );
  }
}

const getLocationConfig = (state, locationId) => {
  return state.locationStore.locations[locationId];
};

const mapStateToProps = (state, props) => {
  return {
    locationConfig: getLocationConfig(state, props.locationId),
  };
};

export const TempChartWidget = connect(mapStateToProps)(TempChartWidgetBase);
