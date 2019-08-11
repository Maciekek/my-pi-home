import React from 'react';
import _ from 'lodash';

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const options = {
  title: {
    text: ''
  },
  // series: [{
  //   name: "test",
  //   data: [[new Date(),1], [new Date(),2], [new Date(),3]]
  // }, {
  //   name: "test2",
  //   data: [[new Date(),2], [new Date(),2], [new Date(),3]]
  // }],

  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      day: "%e-%b-%y" ,
      month: "%b-%y"
    }
  }


}

class TempChart extends React.Component {
  constructor(props) {
    super(props);


  }

  render() {
    console.log(this.props.temps)
    const partitionedById = _.groupBy(this.props.temps, "sensorId")
    const sensorIds = Object.keys(partitionedById);

    const groupedTemps = sensorIds.map((sensorId) => {
      return {
        name: sensorId,
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