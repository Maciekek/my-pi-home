import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highchartsMore from 'highcharts/highcharts-more.js';
import solidGauge from 'highcharts/modules/solid-gauge.js';

highchartsMore(Highcharts);
solidGauge(Highcharts);

class SpeedChartBase extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    unit: PropTypes.string,
    data: PropTypes.array,
  };

  static WidgetConfig = {
    limit: 1,
  };

  renderChart = (props) => {
    return {
      chart: {
        type: 'solidgauge',
      },

      title: null,

      pane: {
        center: ['50%', '85%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc',
        },
      },

      tooltip: {
        enabled: false,
      },

      // the value axis
      yAxis: {
        stops: [
          [0.1, '#153cbf'], // green
          [0.5, '#03df1d'], // yellow
          [0.9, '#DF5353'], // red
        ],
        lineWidth: 0,
        minorTickInterval: null,
        tickAmount: 2,

        labels: {
          y: 16,
        },
        min: -10,
        max: 50,
      },

      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 5,
            borderWidth: 0,
            useHTML: true,
          },
        },
      },

      series: [
        {
          data: [_.last(props.data).value],
          dataLabels: {
            format:
              '<div style="text-align:center">' +
              '<span style="font-size:22px">{y:.1f}</span><br/>' +
              '<span style="font-size:12px;opacity:0.4">' +
              props.options.sensors[0].sensorUnit +
              '</span>' +
              '</div>',
          },
          tooltip: {
            valueSuffix: props.unit || 'C',
          },
        },
      ],

      credits: {
        enabled: false,
      },
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      options: this.renderChart(props),
    };
  }

  render() {
    const sensorId = _.last(this.props.data).sensorId;

    const sensorName = _.find(this.props.locationConfig.tempSettings.sensors, ['sensorId', this.props.data[0].sensorId])
      ? _.find(this.props.locationConfig.tempSettings.sensors, ['sensorId', sensorId]).name
      : sensorId;

    return (
      <div className={'speed-chart'}>
        <div className={'speed-chart__title'}>
          <div className={'speed-chart__title--name'}>{sensorName}</div>
          <div className={'speed-chart__title--id'}>id: {sensorId}</div>
        </div>

        <div className={'speed-chart__widget-wrapper'}>
          <HighchartsReact highcharts={Highcharts} options={this.renderChart(this.props)} ref="chartComponent1" />
        </div>
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

export const SpeedChart = connect(mapStateToProps)(SpeedChartBase);
