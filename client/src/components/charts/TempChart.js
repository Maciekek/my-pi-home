import _ from 'lodash';
import React from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { dark } from '../chartThemes/dark';
Highcharts.setOptions({
  time: {
    timezoneOffset: -1 * 60,
  },
  ...dark,
});

const options = {
  title: {
    text: '',
  },

  chart: {
    zoomType: 'x',
  },

  rangeSelector: {
    enabled: false,
  },

  xAxis: {
    type: 'datetime',
    //	tickInterval: 60 * 1000, // for thin step
    dateTimeLabelFormats: {
      // don't display the dummy year\
      year: '%I:%M:%S %p',
      month: '%I:%M:%S %p',
      day: '%I:%M:%S %p',
    },
    title: {
      text: 'Time',
    },
  },
  tooltip: {
    useHTML: true,
    formatter: function () {
      const dateLabel = Highcharts.dateFormat('%A, %d.%m.%Y, %H:%M', this.x);
      let html = `<div class="chart-tooltip" style="font-size: 15px;">Data: ${dateLabel}<br>`;

      if (this.points) {
        this.points.forEach((point) => {
          html += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b><br>`;
        });
      } else {
        html += `${this.series.name}: <b>${this.y}</b><br>`;
      }

      return `${html}</div>`;
    },
    shared: true,
    split: false,
    enabled: true,
  },
};

class TempChart extends React.Component {
  getNameOfSensorById = (id) => {
    if (!(this.props.location.tempSettings && this.props.location.tempSettings.sensors)) {
      return id;
    }

    const matchedSensors = this.props.location.tempSettings.sensors.filter((sensor) => {
      return sensor.sensorId === id;
    });

    if (matchedSensors.length > 0) {
      return matchedSensors[0].name;
    }

    return id;
  };

  render() {
    const partitionedById = _.groupBy(this.props.temps, 'sensorId');
    const sensorIds = _.sortBy(Object.keys(partitionedById));

    const groupedTemps = sensorIds.map((sensorId) => {
      return {
        name: this.getNameOfSensorById(sensorId),
        data: partitionedById[sensorId].map((data) => {
          return [new Date(data.date).valueOf(), data.value];
        }),
      };
    });

    console.log(groupedTemps);
    options.series = groupedTemps;
    return (
      <div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}

export { TempChart };
