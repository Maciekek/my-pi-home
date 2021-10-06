import axios from 'axios';

const SensorsService = {
  getSensorValues: (locationId, params) => {
    if (!params.sensors) {
      return;
    }

    const sensors = params.sensors.map((sensor) => {
      return sensor.sensorId;
    });

    const body = {
      sensorIds: sensors,
      from: params.from,
      to: params.to,
      limit: params.limit || 1,
    };

    return axios.post(`/api/sensors/${locationId}`, body);
  },
};

export { SensorsService };
