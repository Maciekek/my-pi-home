import {SensorsService} from "../services/sensors.service";

const speedChartDataLoader = {
  get(params) {

    return SensorsService.getSensorValues(params.locationId, params).then(response => {

      return response.data;
    });
  },


};

export {speedChartDataLoader}


